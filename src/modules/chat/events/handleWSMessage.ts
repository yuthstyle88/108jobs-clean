import * as React from "react";
import type {NormalizedEnvelope} from "@/modules/chat/utils/chatSocketUtils";
import {
    broadcastToListeners,
    handleIncomingPayload,
    isChatMessageLike,
    isValidIncomingChatPayload,
    normalizePhoenixEnvelope,
    unwrapPhoenixFrame,
} from "@/modules/chat/utils/chatSocketUtils";
import {emitChatTyping,} from "@/modules/chat/events/index";
import type {ChatMessage, ChatRoomData} from "lemmy-js-client";
import {
    buildMessageSignature,
    cleanupFetch, maybeHandlePresenceUpdate,
    maybeHandleReadReceipt,
    maybeHandleStatusChange,
    parseTypingDetail,
    tryFlushAutoAck
} from "@/modules/chat/utils";
import {ChatTypingDetail} from "@/modules/chat/types";

export interface HandlerRefs {
    /** set of processed message signatures for dedupe */
    processedMsgRef: React.RefObject<Set<string>>;
    /** mark that peer is active right now */
    peerActiveRef: React.RefObject<boolean>;
    /** pending page cursor setter from history fetch */
    setPageCursor?: (cursor: any) => void;
    setHasMoreMessages?: (b: boolean) => void;
    setIsFetching?: (b: boolean) => void;
    /** fetch coordination */
    fetchTimeoutRef?: React.RefObject<any>;
    fetchResolveRef?: React.RefObject<(() => void) | null>;
    /** read-ack support */
    readAckRef: React.RefObject<((lastId: string) => void) | null>;
    /** delivery-ack support */
    deliveryAckRef?: React.RefObject<((lastId: string) => void) | null>;
    ackCooldownRef: React.RefObject<number>;
}

export interface HandlerDeps extends HandlerRefs {
    roomId: string;
    /** current user id */
    localUserId: number;
    /** inform UI that room data has been refreshed */
    setRefreshRoomData: (data: ChatRoomData) => void;
    /** inform that peer is active (UI hint) */
    markPeerActive: () => void;
    /** optional: push typing state directly to UI in addition to DOM event */
    onRemoteTyping?: (detail: ChatTypingDetail) => void;
    upsertMessage: (msg: ChatMessage) => void;
}

/**
 * Factory to create a stable WS onmessage handler, with all external state passed via deps.
 */
export function createHandleWSMessage(deps: HandlerDeps) {
    const {
        roomId,
        localUserId,
        setRefreshRoomData,
        markPeerActive,
        onRemoteTyping,
        processedMsgRef,
        peerActiveRef,
        setPageCursor,
        setHasMoreMessages,
        setIsFetching,
        fetchTimeoutRef,
        fetchResolveRef,
        readAckRef,
        deliveryAckRef,
        ackCooldownRef,
        upsertMessage
    } = deps;
    const meId = Number(localUserId);
    const roomIdStr = String(roomId);

    const handleWSMessage = async (event: any) => {
        let payload: any;
        try {
            payload = unwrapPhoenixFrame(event);
            const evt = payload?.data?.event;
            if (evt === 'chat:message' && !isValidIncomingChatPayload(payload)) {
                // Keep log lightweight; the permissive mapper below will try its best.
                try {
                    console.debug("[ws] payload failed strict validation (chat:message); attempting permissive mapping");
                } catch {}
            }
            // Normalize once only
            const env: NormalizedEnvelope = normalizePhoenixEnvelope(payload.data, roomIdStr);

            // Only mark peer as active if the message is from the peer, not from local user
            try {
                // Prefer normalized env ids; fall back to raw/nested payload (e.g., chat:active_rooms → data.payload.readerId)
                const rawSender = payload?.data?.payload?.senderId
                  ?? payload?.data?.payload?.readerId;
                const senderIdNum = rawSender != null ? Number(rawSender) : undefined;
                const isFromPeer = senderIdNum != null && senderIdNum !== meId;
                if (isFromPeer) {
                    markPeerActive();
                }
            } catch {
            }

            // 1) status-change → refresh & return
            if (await maybeHandleStatusChange(env, roomIdStr, setRefreshRoomData)) {
                return null;
            }

            // 2) presence update
            if (await maybeHandlePresenceUpdate(env, meId)) {
                return null;
            }

            // 2.5) sync event (network recovery) → re-flush pending delivery/read acks then return
            try {
                const rawEvt = payload?.data?.event;
                if (rawEvt === 'sync:pending') {
                    // Allow immediate ack
                    try { if (ackCooldownRef) ackCooldownRef.current = 0 as any; } catch {}
                    const lastId = (handleWSMessage as any)._batchAckLastId
                        || (handleWSMessage as any)._lastDeliveredId;
                    if (lastId) {
                        try { deliveryAckRef?.current?.(lastId); } catch {}
                        try {
                            // Reuse auto-ack to push read receipt if applicable
                            (handleWSMessage as any)._batchAckLastId = lastId;
                            tryFlushAutoAck(handleWSMessage, roomIdStr, readAckRef, ackCooldownRef);
                        } catch {}
                    }
                    return null;
                }
            } catch {}

            // 2.6) ack protocol events from server
            try {
              const rawEvt2 = payload?.data?.event;
              // A) ackReminder → mark pending locally and reply ackConfirm
              if (rawEvt2 === 'ackReminder') {
                const ids: string[] = payload?.data?.payload?.clientIds ?? [];
                try { (window as any)?.chatOutbox?.markPending?.(roomIdStr, meId, ids); } catch {}
                try { (window as any)?.chatChannel?.ackConfirm?.(ids); } catch {}
                return;
              }
              // B) messageAck → mark delivered/sent for that clientId
              if (rawEvt2 === 'messageAck') {
                const cid: string | undefined = payload?.data?.payload?.clientId;
                if (cid) {
                  try { (window as any)?.chatOutbox?.markDelivered?.(roomIdStr, meId, cid); } catch {}
                  try { (window as any)?.chatStore?.markMessageDelivered?.(roomIdStr, cid); } catch {}
                }
                return;
              }
            } catch {}

            // 3) typing → DOM + optional callback

            const typingInfo = parseTypingDetail(env, roomIdStr, meId);
            if (typingInfo) {
                try {
                    emitChatTyping(typingInfo);
                } catch {
                }
                try {
                    onRemoteTyping?.(typingInfo);
                } catch {
                }
            }

            // 4) read-receipt → persist peer's read-last then return
            if (maybeHandleReadReceipt(env, roomIdStr)) {
                return;
            }

            // 5) message payloads → handle + merge
            const msgs = await handleIncomingPayload(payload.data, {
                roomId: roomIdStr,
                localUserId: meId,
                receivedSet: processedMsgRef.current,
                setPageCursor,
                setHasMoreMessages,
                setIsFetching,
                fetchTimeoutRef,
                fetchResolveRef,
            });

            if (Array.isArray(msgs) && msgs.length) {
                let lastAckId: string | undefined;

                for (const item of msgs) {
                    broadcastToListeners(item);
                    if (!isChatMessageLike(item)) continue;

                    const signature = buildMessageSignature(item);
                    // if (processedMsgRef.current.has(signature)) continue;
                    processedMsgRef.current.add(signature);


                    const fromSelf = Number(item.senderId) === meId;
                    const peerActiveNow = peerActiveRef.current;
                    const enhancedItem = {...item, unread: fromSelf ? !peerActiveNow : false} as ChatMessage;

                    const msgId = String(item.id || "");
                    const sameRoom = String(item.roomId) === roomIdStr;
                    if (sameRoom && !fromSelf && msgId) lastAckId = msgId;
                    upsertMessage(enhancedItem)
                }

                if (lastAckId) {
                    (handleWSMessage as any)._batchAckLastId = lastAckId;
                    try {
                        // Also send delivery ack to server to confirm we received it
                        deliveryAckRef?.current?.(lastAckId);
                        (handleWSMessage as any)._lastDeliveredId = lastAckId;
                    } catch {}
                }
                // 6) auto-ack flush (once)
                tryFlushAutoAck(handleWSMessage, roomIdStr, readAckRef, ackCooldownRef);
            }
        } catch (e) {
            cleanupFetch(setIsFetching, fetchTimeoutRef, fetchResolveRef);
            try {
                broadcastToListeners(payload ?? unwrapPhoenixFrame(event));
            } catch {
            }
        }
    };

    return handleWSMessage;
}
