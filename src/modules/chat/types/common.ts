import {ChatMessage, LocalUserId} from "lemmy-js-client";

export type WsMessageSender = (data: MessagePayload) => void | Promise<void>;

export interface MessagePayload {
    message: string;
    senderId: LocalUserId;
    secure: boolean,
    id?: string;
}
/**
 * Canonical typing detail for `chat:typing` events.
 * - roomId: room identifier (same as topic without the `room:` prefix)
 * - senderId: local user id of the typist
 * - typing: true when typing starts, false when stops
 * - createdAt: optional ISO timestamp when the event was generated (server/client)
 */
export interface ChatTypingDetail {
    roomId: string;
    senderId: LocalUserId;
    typing: boolean;
    createdAt?: string;
}
export const TYPING_EVENT_NAMES = ['chat:typing'];

export const EVENTS = [
    'phxReply',
    'forward',
    'chat:message',
    'chat:typing',
    'chat:read',
    "chat:ack",
    "sync:pending",
    'historyPage',
];

export type PhoenixEvent =
  | "phxJoin"
  | "phxLeave"
  | "phxReply"
  | "phxError"
  | "phxElose"
  | "chat:message"
  | "chat:typing"
  | "chat:read"
  | "chat:readUpTo"
  | "chat:update"
  | "chat:ack"
  | "sync:pending"
  | "forward"
  | "historyPage";

export type ChatMessageModel = ChatMessage & {
    isOwner: boolean
};

export type WebSocketStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

export interface PhoenixPacket<T = any> {
    event: PhoenixEvent;
    payload?: T;
}

export interface SendMessageDeps {
    isE2EMock: boolean;
    roomId: string;
    sentSet: Set<string>;
    // เชื่อม Chat Store แบบ optional: ถ้าไม่ได้ส่งมาก็ยังทำงานผ่าน DOM event เหมือนเดิม
    adapter?: {
        send: (packet: any) => Promise<string | false> | string | false;
        emit?: (event: string, payload: any) => void;
        onMessage?: (cb: (packet: any) => void) => () => void;
        onAny?: (cb: (event: string, payload: any) => void) => () => void;
    };
    /**
     * High-level message sender (preferred when available).
     * If provided, sendChatMessage may delegate the actual transport to this sender.
     */
    sender?: {
        /**
         * Send a fully prepared ChatMessage (content/id/roomId/senderId set).
         * Returns the server id when available, else the client id; `false` on failure.
         */
        sendMessage: (event: string, msg: ChatMessage) => Promise<boolean>;
    };

}