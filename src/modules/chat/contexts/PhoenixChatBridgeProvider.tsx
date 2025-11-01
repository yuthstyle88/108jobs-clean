"use client";
import React, {createContext, useContext, useEffect, useMemo, useRef} from "react";
import {useChatStore} from "@/modules/chat/store/chatStore";
import {useNetworkStore} from "@/store/networkStore";
import {useWebSocketContext} from "@/modules/chat/contexts/WebSocketContext";
import {PhoenixSenderAdapter} from "@/modules/chat/adapters/PhoenixSenderAdapter";
import {type ChatStorePort, ResendManager} from "@/modules/chat/services/ResendManager";
import {GlobalAckMatcher} from "@/modules/chat/utils/AckMatcher";
import {isBrowser} from "@/utils/browser";
import {ChatMessageModel} from "@/modules/chat/types";
import {ChatRoomId, ChatStatus} from "lemmy-js-client";


function pickChannel(ws: any, roomId?: string) {
    if(!ws) return null;
    if(ws.channel && typeof ws.channel.on === "function") return ws.channel;
    if(ws.chan && typeof ws.chan.on === "function") return ws.chan;
    if(ws.currentChannel && typeof ws.currentChannel.on === "function") return ws.currentChannel;
    const list = ws.channels || ws._channels || ws.__channels__;
    if(Array.isArray(list) && list.length) {
        if(roomId) {
            const topic = `room:${roomId}`;
            const byRoom = list.find((c: any) => String(c?.topic || "") === topic || String(c?.topic || "").includes(roomId));
            if(byRoom) return byRoom;
        }
        return list[0];
    }
    return null;
}

interface WebSocketProviderProps {
    isLoggedIn: boolean;
    roomId: string;
    peerPublicKeyHex?: string;
    children: React.ReactNode;
}

// ----- Chat Services Context (for optional consumers) -----
export type ChatServices = {
    sender: PhoenixSenderAdapter | null;
    resend: ResendManager | null;
};
const ChatServicesContext = createContext<ChatServices>({sender: null, resend: null});
export const useChatServices = () => useContext(ChatServicesContext);

/**
 * PhoenixChatBridgeProvider (new design)
 * -------------------------------------
 * - ประกอบ sender/resend/ack matcher ตามดีไซน์ใหม่
 * - ไม่ setSender ตรงใน store อีกต่อไป
 * - ใช้ AckMatcher จับคู่ clientId ↔ serverId แล้ว promote ใน store
 */
export const PhoenixChatBridgeProvider: React.FC<WebSocketProviderProps> = ({children, roomId}) => {
    const ws = useWebSocketContext?.() as any;
    const store = useChatStore();
    const setOnline = useNetworkStore(s => s.setOnline);
    const isOnline = useNetworkStore(s => s.isOnline());

    const wiredWsRef = useRef<any>(null);
    const servicesRef = useRef<ChatServices>({sender: null, resend: null});
    const wasOnlineRef = useRef<boolean>(isOnline);

    // Build ResendManager + Sender when ws/channel ready
    useEffect(() => {
        if(!ws) return;
        const ch = pickChannel(ws, roomId);
        if(!ch) return;

        // Avoid rebuilding on same instance
        if(wiredWsRef.current === ch) return;
        wiredWsRef.current = ch;

        // Build sender bound to channel
        const sender = new PhoenixSenderAdapter(ch);

        // Map store to ChatStorePort (抓เฉพาะที่ ResendManager ใช้)
        const port: ChatStorePort = {
            getState: () => {
                const s = useChatStore.getState();
                // Strict gate: only messages with complete required fields are allowed to resend.
                // This prevents resend loops when malformed drafts slip into the failed list.
                const rawList = Array.isArray(s.listMessages) ? s.listMessages : [];
                // ResendManager expects a list named failedMessages, but we supply only failed ones as per the new policy.
                const pendings: ChatMessageModel[] = rawList
                  .filter((m: any) => {
                      return (
                          m?.status === "failed" &&
                          typeof m?.id === "string" && m.id.length > 0 &&
                          typeof m?.roomId === "string" && m.roomId.length > 0 &&
                          typeof m?.senderId === "number" && Number.isFinite(m.senderId) &&
                          typeof m?.content === "string" && m.content.length > 0 &&
                          typeof m?.createdAt === "string" && m.createdAt.length > 0
                      );
                  })
                  .map((m: any) => ({
                      id: m.id as string,
                      roomId: m.roomId as ChatRoomId,
                      senderId: m.senderId as number,
                      secure: Boolean(m.secure),
                      content: m.content as string,
                      status: "failed" as ChatStatus,
                      createdAt: m.createdAt as string,
                      isOwner: Boolean(m.isOwner),
                  }));
                return {failedMessages: pendings, retryMeta: s.retryMeta};
            },
            upsertRetryMeta: useChatStore.getState().upsertRetryMeta,
            dropRetryMeta: useChatStore.getState().dropRetryMeta,
            markFailed: useChatStore.getState().markFailed,
            promoteToSent: useChatStore.getState().promoteToSent,
        };

        const resend = new ResendManager(port, sender);
        servicesRef.current = {sender, resend};

        // Online/Offline wiring
        const onOpen = () => {
            setOnline(true);
        };
        const onClose = () => {
            setOnline(false);
        };

        const onError = () => {
            setOnline(false);
        };

        const onWindowOffline = () => {
            setOnline(false);
        };

        const onWindowOnline = () => {
            setOnline(true);
        };

        if(isBrowser()) {
            window.addEventListener('offline', onWindowOffline);
            window.addEventListener('online', onWindowOnline);
        }
        try {
            ws.on?.('error', onError);
        } catch {
        }

        try {
            ws.on?.("open", onOpen);
        } catch {
        }
        try {
            ws.on?.("close", onClose);
        } catch {
        }

        if(typeof ws?.connected === "boolean" && ws.connected) onOpen();

        return () => {
            if(isBrowser()) {
                window.removeEventListener('offline', onWindowOffline);
                window.removeEventListener('online', onWindowOnline);
            }
            try {
                ws.off?.('error', onError);
            } catch {
            }
            try {
                ws.off?.("open", onOpen);
            } catch {
            }
            try {
                ws.off?.("close", onClose);
            } catch {
            }
            servicesRef.current = {sender: null, resend: null};
            wiredWsRef.current = null;
        };
    }, [ws, roomId, store]);

    // Inbound: pipe to AckMatcher and promote in store when clientId matched
    useEffect(() => {
        if(!ws) return;
        const ch = pickChannel(ws, roomId);

        const toAck = (raw: any) => {
            try {
                const inner = raw?.payload?.payload ?? raw?.payload ?? raw;
                const isForward = inner?.event && inner?.payload;
                const p = isForward ? inner.payload : inner;
                const serverId = String(p?.id ?? "");
                if(!serverId) return;
                const clientId = p?.clientId ? String(p.clientId) : undefined;
                const rid = String(p?.roomId ?? roomId ?? "");
                const sid = Number(p?.senderId ?? 0);
                GlobalAckMatcher.onAck({clientId, serverId, roomId: rid, senderId: sid});
            } catch {
            }
        };

        if(ch && typeof ch.on === "function") {
            try {
                ch.on("chat:message", toAck);
            } catch {
            }
            try {
                ch.on("forward", toAck);
            } catch {
            }
            return () => {
                try {
                    ch.off?.("chat:message", toAck);
                } catch {
                }
                try {
                    ch.off?.("forward", toAck);
                } catch {
                }
            };
        } else {
            try {
                ws.on?.("chat:message", toAck);
            } catch {
            }
            try {
                ws.on?.("forward", toAck);
            } catch {
            }
            return () => {
                try {
                    ws.off?.("chat:message", toAck);
                } catch {
                }
                try {
                    ws.off?.("forward", toAck);
                } catch {
                }
            };
        }
    }, [ws, roomId]);

    // Promote in store when AckMatcher confirms a clientId
    useEffect(() => {
        const unsub = GlobalAckMatcher.subscribe((ack) => {
            if(ack.clientId) {
                try {
                    store.promoteToSent(ack.roomId, ack.clientId);
                    store.dropRetryMeta(ack.clientId);
                } catch {
                }
            }
        });
        return () => {
            unsub();
        };
    }, [store]);
    // Flush resend when going from offline -> online
    useEffect(() => {
        const justBecameOnline = isOnline && !wasOnlineRef.current;
        if(justBecameOnline) {
            try {
                servicesRef.current.resend?.flushAll();
            } catch {
            }
        }
        wasOnlineRef.current = isOnline;
    }, [isOnline]);

    const services = useMemo(() => servicesRef.current, [servicesRef.current]);
    return (
      <ChatServicesContext.Provider value={services}>
          {children}
      </ChatServicesContext.Provider>
    );

};
