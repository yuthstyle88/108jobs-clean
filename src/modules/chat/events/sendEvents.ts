import type {ChatMessage, LocalUserId} from "lemmy-js-client";
import {UserService} from "@/services";
import {encrypt} from "@/utils";
import {dbg} from "@/modules/chat/utils";
import {MessagePayload, PhoenixEvent, PhoenixPacket, SendMessageDeps} from "@/modules/chat/types";
import {createMessage} from "@/modules/chat/domain/entities/message";
import {waitForAck, wsSend} from "@/modules/chat/utils/socketSend";
import {useChatStore} from "@/modules/chat/store/chatStore";

// ---- Ack / Retry tuning (keep minimal & explicit)
const ACK_TIMEOUT_MS   = Number(process.env.CHAT_ACK_TIMEOUT ?? 8000);
// Allow extending ACK wait more than once. Default 3x (24s total when timeout=8s)
const ACK_EXTENDS     = Number(process.env.CHAT_ACK_EXTENDS ?? 3);

// ---- Packet helpers ----
export function createEvent<T>(event: PhoenixEvent, payload?: T): PhoenixPacket<T> & {
    roomId?: string;
    timestamp: string
} {
    const p: any = {event, payload, timestamp: new Date().toISOString()};
    Object.keys(p).forEach((k) => p[k] === undefined && delete p[k]);
    return p;
}

export interface SendEventDeps {
    roomId: string;
    senderId: LocalUserId;
    adapter?: SendMessageDeps['adapter'];
    sender?: SendMessageDeps['sender'];
}

// ---- Lightweight emits ----
export function sendTyping(deps: SendEventDeps, typing: boolean) {
    const a = (deps as any).adapter;
    if(!a) return;
    wsSend(a, createEvent('chat:typing', {typing, senderId: deps.senderId, roomId: deps.roomId}));
}

export function sendReadReceipt(deps: SendEventDeps, lastMessageId: string) {
    const a = (deps as any).adapter;
    if(!a) return;
    const pkt = createEvent('chat:readUpTo', {
        secure: false,
        roomId: deps.roomId,
        readerId: deps.senderId,
        lastReadMessageId: lastMessageId || ''
    });
    dbg('sendReadReceipt', pkt);
    wsSend(a, pkt);
}

export function sendRoomUpdateEvent(deps: SendEventDeps, update: Record<string, any>) {
    const a = (deps as any).adapter;
    if(!a) return;
    wsSend(a, createEvent('chat:update', {roomId: deps.roomId, ...update}));
}

/**
 * Send delivery acknowledgment to server for a received message.
 * Minimal payload: roomId, receiverId (me), messageId
 */
export function sendDeliveryAck(deps: SendEventDeps, messageId: string) {
    const a = (deps as any).adapter;
    if(!a) return;
    const pkt = createEvent('chat:ack', {
        roomId: deps.roomId,
        receiverId: deps.senderId,
        messageId: String(messageId || '')
    });
    dbg('sendDeliveryAck', pkt);
    wsSend(a, pkt);
}

// ---- Core send/ack ----
async function doSend(deps: SendMessageDeps, msg: ChatMessage): Promise<{ id: string; sent: boolean }> {
    const id = (msg as any).id; // keep original id type (number/string) to match store keys
    const s = (deps as any).sender;
    const a = (deps as any).adapter;
    const isChannelClosed = () => {
        try {
            return a && (a.closed === true || a.isClosed?.() === true || a.isOpen?.() === false);
        } catch { return false; }
    };
    if(!s) return {id, sent: false};
    dbg('doSend:start', {id, roomId: (deps as any)?.roomId});
    try {
        const ok = await s.sendMessage('chat:message', msg);
        if(!ok) return (dbg('doSend:sendMessage failed', {id}), {id, sent: false});
        // Transport send initiated successfully → mark as 'sending'
        try { useChatStore.getState()?.commitStatus?.(msg.roomId, id, 'sending' as any); } catch {}
        // Wait for ACK, auto-extend waiting if no reply
        let totalWait = 0;
        let acked = false;
        let markedRetrying = false;
        while (totalWait < ACK_TIMEOUT_MS * ACK_EXTENDS && !acked) {
            if (isChannelClosed()) { dbg('doSend:channel-closed-before-ack', { id, totalWait }); break; }
            acked = await waitForAck(deps, msg.id, ACK_TIMEOUT_MS).catch((e) => (dbg('doSend:waitForAck error', e), false));
            if (!acked) {
                totalWait += ACK_TIMEOUT_MS;
                dbg('doSend:auto-extend-wait', { id, totalWait });
                if (!markedRetrying) {
                    try { useChatStore.getState()?.commitStatus?.(msg.roomId, id, 'retrying' as any); } catch {}
                    markedRetrying = true;
                }
            }
        }
        return acked ? (dbg('doSend:ack ok', {id}), {id, sent: true}) : (dbg('doSend:ack timeout', {id}), {
            id,
            sent: false
        });
    } catch (err: any) {
        const reason = err?.message || err?.reason || String(err);
        dbg('doSend:error', { id, reason });
        return { id, sent: false };
    }
}

// ---- Public: send chat message ----
export async function sendChatMessage(deps: SendMessageDeps, data: MessagePayload): Promise<{
    id: string;
    sent: boolean
} | undefined> {
    const store = useChatStore.getState();
    const message = data?.message ?? '';
    if(!message) return;
    const hasSender = !!(deps as any)?.sender, hasRoom = !!(deps as any)?.roomId, hasSenderId = !!data?.senderId;
    if(!hasSender || !hasRoom || !hasSenderId) return;

    const msgId = (data as any)?.id; // keep id type; avoid string-casting
    const sentSet = (deps as any)?.sentSet as Set<any> | undefined;
    // Do not early-return if message id is already in sentSet — we still want to ensure it exists in the UI/store.
    // sentSet is only used to reduce duplicate transport sends, not to suppress UI state.

    const allowEncrypt = data?.secure !== false;
    const p = createMessage(message, (deps as any).roomId, data.senderId, data.secure, data.id);
    if(!p) return;
    p.status = 'sending' as any;
    try {
        store?.addSending?.(p);
    } catch {
    }
    if(msgId) try {
        sentSet?.add?.(msgId);
    } catch {
    }

    try {
        const key = UserService.Instance.authInfo?.sharedKey;
        const useEnc = !!(key && message && allowEncrypt);
        const cipher = useEnc ? await encrypt(message, key!) : null;
        (p as any).content = cipher && cipher !== message ? cipher : message;
        (p as any).secure = !!(cipher && cipher !== message);
    } catch {
        (p as any).content = message;
        (p as any).secure = false;
    }

    if(!(deps as any)?.sender) return; // guard (shouldn’t happen; already checked)


    try {
        const res = await doSend(deps, p);
        const pid = (p as any).id;                   // preserve original type
        const rid = (res as any)?.id ?? pid;         // if server returns new id only on success
        // update status without changing identity type
        store?.commitStatus?.(rid, res?.sent ? rid : pid, res?.sent ? 'delivered' : 'failed');
        // If send failed, allow future retries by clearing the de-dup marker
        if (!res?.sent && msgId != null) try { sentSet?.delete?.(msgId); } catch {}
        return { id: rid, sent: !!res?.sent } as any;
    } catch (err) {
        dbg('sendChatMessage: transport error', err);
        store?.commitStatus?.(deps.roomId, (p as any).id, 'failed');
        if (msgId != null) try { sentSet?.delete?.(msgId); } catch {}
        return { id: (p as any).id, sent: false } as any;
    }
}