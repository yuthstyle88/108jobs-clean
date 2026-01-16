import {HttpService, UserService} from "@/services";
import {getApiHost, isHttps} from "@/utils/env";
import type {
    ChatMessage,
    ChatMessagesResponse,
    ChatMessageView,
    ChatRoom,
    ChatRoomId,
    ChatStatus,
    LocalUserId
} from "lemmy-js-client";
import {decrypt} from "@/utils";
import {REQUEST_STATE} from "@/services/HttpService";
import {dbg} from "@/modules/chat/utils/helpers";

// ---- Centralized browser/event helpers (reduce duplication across contexts) ----

/**
 * Normalize Phoenix frames/envelopes into a normalized envelope type for chat events.
 */
// NormalizedEnvelope type
export type NormalizedEnvelope =
// history page event
    { event: 'history_page'; results: ChatMessageView[]; prevPage?: string; nextPage?: string }
    // single message event (e.g., chat:message)
    | {
    event: string;
    roomId: string;
    readerId?: ChatRoomId;
    lastReadMessageId?: string;
    message?: ChatMessage;
    room?: ChatRoom;
    typing?: boolean;
    updateType?: string,
    prevStatus?: string,
    statusTarget?: string,
    sender?: ChatMessageView['sender']
    updatedAt?: string;
};

// Server-side payload shapes (mirroring Rust `MessageModel` and `IncomingEvent`)
export type ServerMessageModel = ChatMessage & {
    readerId?: ChatRoomId;
    lastReadMessageId?: string;
    typing?: boolean;
    updateType?: string;
    statusTarget?: string;
    prevStatus?: string;
    createdAt?: string;
    updatedAt?: string;
    response?: any;
}

interface IncomingEventLike {
    event: string;
    roomId: string; // Phoenix topic room id (without the `room:` prefix on server side)
    topic?: string;
    payload?: ServerMessageModel;
}

function isIncomingEventLike(v: unknown): v is IncomingEventLike {
    return !!(
        v && typeof v === 'object'
    );
}

function isChatMessagesResponse(v: unknown): v is ChatMessagesResponse {
    return !!(v && typeof v === 'object' && Array.isArray((v as ChatMessagesResponse).results));
}

export function normalizePhoenixEnvelope(
    payload: ChatMessagesResponse | IncomingEventLike,
    fallbackRoomId?: string
): NormalizedEnvelope {
    // 1) If it's already normalized, return as history_page envelope
    if (isChatMessagesResponse(payload)) {
        return {
            event: 'history_page',
            results: payload.results,
            prevPage: payload.prevPage,
            nextPage: payload.nextPage,
        };
    }

    // 2) If it is an `IncomingEventLike`, normalize events
    if (isIncomingEventLike(payload)) {
        const ev = payload.event;
        const evLower = ev.toLowerCase();
        const rid = payload.roomId || fallbackRoomId || '';
        const p: ServerMessageModel | undefined = payload.payload;

        // --- chat:message ---
        if (evLower === 'chat:message') {
            if (!p || !p.content || !p.senderId) {
                return {event: ev, roomId: rid};
            }

            const msg: ChatMessage = {
                id: String(p.id ?? ''),
                roomId: rid,
                senderId: p.senderId,
                secure: p.secure ?? false,
                content: p.content,
                status: (p.status as ChatStatus) ?? 'sent',
                createdAt: p.createdAt ?? new Date().toISOString(),
                isOwner: undefined,
            };

            return {
                event: 'chat:message',
                roomId: rid,
                message: msg,
                room: {id: rid} as ChatRoom,
                sender: {id: p.senderId} as unknown as ChatMessageView['sender'],
            };
        }

        // --- typing events ---
        if (['chat:typing', 'typing:start', 'typing:stop'].includes(evLower)) {
            return {
                event: ev,
                roomId: rid,
                typing: p?.typing,
                sender: p?.senderId ? ({id: p.senderId} as unknown as ChatMessageView['sender']) : undefined,
            };
        }

        // --- update events ---
        if (evLower === 'chat:update') {
            return {
                event: ev,
                roomId: rid,
                updateType: p?.updateType,
                prevStatus: p?.prevStatus,
                statusTarget: p?.statusTarget,
                sender: p?.senderId ? ({id: p.senderId} as unknown as ChatMessageView['sender']) : undefined,
            };
        }

        // --- read_up_to events ---
        if (ev === 'readUpTo') {
            return {
                event: ev,
                roomId: rid,
                lastReadMessageId: p?.lastReadMessageId,
                updatedAt: p?.updatedAt,
                readerId: p?.readerId,
            };
        }
    }

    if (isIncomingEventLike(payload) && payload.event === 'phx_reply') {
        return {event: 'phx_reply', roomId: fallbackRoomId || ''};
    }

    // 3) Unknown shape → return empty envelope with generic event
    const ev = 'unknown';
    const rid = fallbackRoomId || '';
    return {event: ev, roomId: rid};
}

export function safeParse(val: unknown): unknown {
    try {
        const result = typeof val === "string" ? JSON.parse(val as string) : val;
        dbg(`safeParse: Parsed value`, result);
        return result;
    } catch {
        dbg(`safeParse: Failed to parse value`, val);
        return val;
    }
}

export function buildActixWsUrl(): string {
    // Always go through Actix first → Phoenix-compatible endpoint
    // Do not append token/roomId in the URL. Phoenix client will send auth via params.
    const proto = isHttps() ? 'wss' : 'ws';
    const host = getApiHost();
    // Actix will handle `/socket/websocket` (either as WS proxy to Phoenix on :4000 or native Phoenix-compatible handler)
    return `${proto}://${host}/socket`;
}

export function isBase64Like(s: string): boolean {
    return /^[A-Za-z0-9+/=]+$/.test(s);
}


export function addOnce(set: Set<string>, key: string): boolean {
    if (set.has(key)) {
        return false;
    }
    set.add(key);
    return true;
}

export function unwrapPhoenixFrame(data: unknown): unknown {
    try {
        // If MessageEvent-like
        const raw = typeof data === 'string' ? data : (typeof (data as any)?.data === 'string' ? (data as any).data : null);

        // Already an object (not a string)? return as-is
        if (raw == null) return data;

        // Phoenix array frame: [join_ref, msg_ref, topic, event, payload]
        if (raw.startsWith('[')) {
            const arr: unknown = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length >= 5) {
                return arr[4]; // return payload only; let higher-level normalizer handle event/topic
            }
            return arr;
        }

        // JSON object: return parsed object as-is, no merging of topic/event
        return JSON.parse(raw);
    } catch {
        return data;
    }
}

// ---- handleIncomingPayload: normalize and map incoming chat payloads ----
export async function handleIncomingPayload(
    payload: ChatMessagesResponse,
    ctx: {
        roomId: ChatRoomId;
        localUserId: LocalUserId;
        receivedSet: Set<string>;
        setPageCursor?: (cursor: { prev: string | null; next: string | null } | null) => void;
        setHasMoreMessages?: (v: boolean) => void;
        setIsFetching?: (v: boolean) => void;
        fetchTimeoutRef?: { current: any } | null;
        fetchResolveRef?: { current: any } | null;
    }
): Promise<ChatMessage[]> {
    try {
        const env = normalizePhoenixEnvelope(payload, ctx.roomId);
        const eventName = String(env.event || '').toLowerCase();

        const mapOne = async (raw: any): Promise<ChatMessage | null> => {
            // prefer explicit message node if present
            const flat = raw?.message ? {...raw.message, roomId: raw?.room?.id ?? raw?.message?.roomId} : raw;
            return mapIncomingToChatMessage(flat, {
                fallbackRoomId: String(ctx.roomId || flat?.roomId || ''),
                localUserId: ctx.localUserId,
                receivedSet: ctx.receivedSet,
                decryptLabel: 'ws frame',
            }, true);
        };

        // HISTORY PAGE PUSHED FROM SERVER
        if (env.event === 'history_page') {
            try {
                const prev = (env as any)?.prevPage ?? null;
                const next = (env as any)?.nextPage ?? null;
                ctx.setPageCursor?.({prev, next});
                ctx.setHasMoreMessages?.(prev); // has older pages when prev exists
            } catch {
            }
            try {
                ctx.setIsFetching?.(false);
            } catch {
            }
            try {
                if (ctx.fetchTimeoutRef?.current) {
                    clearTimeout(ctx.fetchTimeoutRef.current);
                    ctx.fetchTimeoutRef.current = null;
                }
                if (ctx.fetchResolveRef?.current) {
                    ctx.fetchResolveRef.current();
                    ctx.fetchResolveRef.current = null;
                }
            } catch {
            }

            const list = Array.isArray((env as any).results)
                ? (env as any).results
                : Array.isArray((env as any).messages)
                    ? (env as any).messages
                    : [];

            const out: ChatMessage[] = [];
            for (const item of list) {
                const mapped = await mapOne(item);
                if (mapped) out.push(mapped);
            }
            return out;
        }

        // NEW MESSAGE (canonical)
        if (eventName === 'chat:message') {
            const mapped = await mapOne(env);
            return mapped ? [mapped] : [];
        }

        // IGNORE non-message events here (typing/read handled elsewhere)
        return [];
    } catch (e) {
        dbg('handleIncomingPayload: failed', e);
        return [];
    }
}

// ---- Lightweight runtime validators for chat payloads ----
export function isValidIncomingChatPayload(p: any): boolean {
    console.log("isValidIncomingChatPayload", p)
    if (!p) return false;
    // Allow arrays of messages
    if (Array.isArray(p)) {
        return p.some((it) => isValidIncomingChatPayload(it));
    }
    if (typeof p !== 'object') return false;
    // View style { message: { content, roomId? }, room?: { id } }
    if ((p as any).message && typeof (p as any).message === 'object') {
        const m = (p as any).message;
        const hasContent = typeof m.content === 'string' && m.content.length > 0;
        const hasRoom = typeof m.roomId === 'string' || typeof m.roomId === 'number' || typeof (p as any)?.room?.id === 'string' || typeof (p as any)?.room?.id === 'number';
        return hasContent && hasRoom;
    }
    // Flat style
    const hasRoom = typeof (p as any).roomId === 'string' || typeof (p as any).roomId === 'number' || typeof (p as any).roomId === 'string' || typeof (p as any).roomId === 'number';
    const hasContent = typeof (p as any).content === 'string' && (p as any).content.length > 0;
    return hasRoom && hasContent;
}

// === Helpers extracted from RealtimeChatContext / shared across contexts ===
/**
 * Install exactly ONE message listener depending on adapter capability and return a cleanup function.
 * Supports Phoenix EventEmitter-style `.on("message")`, DOM `addEventListener`, or `onmessage` property.
 */
export function installBestMessageListener(sock: any, handler: (evt: any) => void): () => void {
    // Prefer EventEmitter-style `.on("message")` for Phoenix adapters
    if (sock && typeof sock.on === 'function') {
        try {
            const wrapped = (payload: any) => handler({data: JSON.stringify(payload)});
            sock.on('message', wrapped);
            return () => {
                try {
                    sock.off?.('message', wrapped);
                } catch {
                }
            };
        } catch {
        }
    }
    // Next, try DOM-style addEventListener
    if (sock && typeof sock.addEventListener === 'function') {
        try {
            sock.addEventListener('message', handler);
            return () => {
                try {
                    sock.removeEventListener?.('message', handler);
                } catch {
                }
            };
        } catch {
        }
    }
    // Fallback: property assignment
    if (sock) {
        try {
            (sock as any).onmessage = handler as any;
            return () => {
                try {
                    if ((sock as any).onmessage === handler) (sock as any).onmessage = null;
                } catch {
                }
            };
        } catch {
        }
    }
    // Last resort: no-op cleanup
    return () => {
    };
}

// A flattened, incoming message shape after envelope normalization
// (already merged with view.room.id when applicable)
export type IncomingFlatMessage = {
    id?: string;
    msgRefId?: string;
    roomId?: ChatRoomId;
    senderId?: LocalUserId;
    content?: string;
    status?: ChatStatus;
    createdAt?: string;   // camelCase from server
} & Record<string, unknown>;

/**
 * Map various incoming shapes to a ChatMessage, with optional decryption.
 * Uses `addOnce` to de-duplicate by a stable signature (id or composite key).
 */
export async function mapIncomingToChatMessage(
    m: IncomingFlatMessage,
    opts: {
        fallbackRoomId: string;
        localUserId: number;
        receivedSet: Set<string>;
        decryptLabel?: string;
    },
    secure: boolean = true,
): Promise<ChatMessage | null> {
    try {
        // Skip empty content frames
        try {
            if (m?.content === "{}") return null;
        } catch {
        }

        const createdAtVal = m.createdAt || new Date().toISOString();

        // Stable signature to dedupe messages
        const messageSignature = m.id ?? "";

        if (!addOnce(opts.receivedSet, messageSignature)) {
            return null; // duplicate
        }

        // Optional decrypt (only when looks like base64 and we have key)
        let content = m.content;

        const aesKey = UserService.Instance.authInfo?.sharedKey;
        if (secure && aesKey && typeof m.content === 'string' && isBase64Like(m.content)) {
            dbg(`mapIncomingToChatMessage: decrypting ${opts.decryptLabel} message`, m);
            try {
                const plain = await decrypt(m.content, aesKey);
                if (plain && plain.length > 0) content = plain;
            } catch {
                console.warn('mapIncomingToChatMessage: failed to decrypt message', m);
            }
        }

        const roomIdMapped = m.roomId || opts.fallbackRoomId;
        const senderIdMapped = Number(m.senderId) || 0;
        const createdAtMapped = m.createdAt || createdAtVal;
        const displayId = (m.msgRefId) ? m.msgRefId : m.id;

        return {
            id: displayId,
            senderId: senderIdMapped,
            roomId: roomIdMapped,
            content,
            status: "sent" as ChatStatus,
            createdAt: createdAtMapped,
            isOwner: senderIdMapped === opts.localUserId,
        } as ChatMessage;
    } catch {
        return null;
    }
}

// ===== Room listeners (shared across contexts) =====
export type RoomListener = { roomId: string; fn: (event: MessageEvent) => void };
const __roomListeners = new Map<string, RoomListener>();

/** Register a listener for a specific room id under a unique key. */
export function addRoomListener(key: string, roomId: string, fn: (event: MessageEvent) => void) {
    __roomListeners.set(key, {roomId: String(roomId), fn});
}

/** Remove a previously registered listener by key. */
export function removeRoomListener(key: string) {
    __roomListeners.delete(key);
}

function __pickRoomId(payload: any): string | null {
    if (!payload) return null;
    const norm = (v: any) => {
        if (!v) return null;
        let s = String(v);
        if (s.startsWith('room:')) s = s.slice(5);
        return s || null;
    };
    try {
        if (Array.isArray(payload) && payload.length > 0) {
            const h = payload[0];
            return norm(h?.roomId ?? h?.roomId ?? h?.topic);
        }
        return norm(payload?.roomId ?? payload?.roomId ?? payload?.topic);
    } catch {
        return null;
    }
}

/** Broadcast payload to listeners of its room (or to all if the room cannot be determined). */
export function broadcastToListeners(payload: unknown): void {
    const event = {data: JSON.stringify(payload)} as MessageEvent;
    try {
        (globalThis as any).__rtLast = payload;
    } catch {
    }

    let pid: string | null;
    try {
        const parsed = typeof payload === 'string' ? JSON.parse(payload as any) : payload;
        pid = __pickRoomId(parsed);
    } catch {
        pid = null;
    }

    if (pid) {
        for (const {roomId, fn} of __roomListeners.values()) {
            if (String(roomId) === String(pid)) fn(event);
        }
        return;
    }
    // Fallback: broadcast to all
    for (const {fn} of __roomListeners.values()) fn(event);
}

/**
 * Fetch one page of chat history via HTTP and map each item to ChatMessage.
 * The caller can decide how to broadcast the mapped messages.
 */
export async function fetchHistoryPage(
    params: { roomId: string; cursor: string | null; limit: number; lastReadId?: string | null },
    deps: {
        localUserId: number;
        receivedSet: Set<string>;
        broadcast?: (m: import("lemmy-js-client").ChatMessage) => void;
    }
) {

    const res = await HttpService.client.getChatHistory({
        roomId: params.roomId,
        cursor: params.cursor ?? undefined,
        limit: params.limit,
        back: true,
    } as any);

    if (res.state !== REQUEST_STATE.SUCCESS) return {prev: null, next: null} as any;
    const resp = res.data as any;
    const items = Array.isArray(resp?.results) ? resp.results : [];

    const mappedItems: any[] = [];
    for (const view of items) {
        const m = {
            ...view.message,
            id: view.message?.msgRefId,
            roomId: view.message?.roomId,
        };
        const mapped = await mapIncomingToChatMessage(m, {
            fallbackRoomId: params.roomId,
            localUserId: deps.localUserId,
            receivedSet: deps.receivedSet,
            decryptLabel: "history line",
        });

        if (mapped) {
            // Mark read/unread relative to lastReadId if provided.
            if (typeof params.lastReadId !== 'undefined') {
                // Assume items are ordered newest -> oldest within the page.
                // All items before hitting lastReadId are newer (unread),
                // once we hit lastReadId, it and the rest are read.
                // We'll compute this after the loop to avoid early assumptions.
            }
            mappedItems.push(mapped);
            if (deps.broadcast) deps.broadcast(mapped);
        }
    }

    // Post-process isRead flags based on lastReadId
    if (typeof params.lastReadId !== 'undefined' && mappedItems.length > 0) {
        let hit = false;
        for (let i = 0; i < mappedItems.length; i++) {
            const it = mappedItems[i];
            if (String(it.id) === String(params.lastReadId)) hit = true;
            (mappedItems[i] as any).isRead = hit;
        }
    }

    return {
        // backend return latest to oldest so need reverse
        prev: resp.nextPage,
        next: resp.prevPage,
        items: mappedItems,
    };
}

// Type guard: ensure we only treat real chat messages (not typing frames) as messages
export function isChatMessageLike(m: any): m is {
    id: string;
    roomId: string;
    senderId: number;
    content: string;
    createdAt: string
} {
    return !!(
        m && typeof m === 'object' &&
        typeof m.id === 'string' &&
        (typeof m.roomId === 'string') &&
        (typeof m.senderId === 'number') &&
        typeof m.content === 'string' && m.content.trim() !== '' &&
        typeof (m.createdAt) === 'string'
    );
}

/**
 * Emit-based read acker for sockets that expose `.emit(event, payload)` instead of Phoenix Channel `.push(...)`.
 * - Debounced (50ms) to avoid flooding
 * - Monotonic for numeric ids, de-dupe for string/UUID ids
 */
/**
 * Emit-based read acker for sockets that expose `.emit(event, payload)`.
 * เปิดดีบักด้วย: localStorage.setItem('debug_read_ack','1')
 */
export function makeEmitReadAcker(
    emit: (event: string, payload: any) => void,
    roomId: string,
    initialPointer: number | string = 0
) {
    const DBG =
        typeof window !== 'undefined' &&
        typeof window.localStorage !== 'undefined' &&
        window.localStorage.getItem('debug_read_ack') === '1';

    let maxPointerNum = Number.isFinite(Number(initialPointer)) ? Number(initialPointer) : -Infinity;
    let lastIdStr: string | null = typeof initialPointer === 'string' ? String(initialPointer) : null;

    let scheduled = false;
    let pendingIdStr: string | null = null;

    if (DBG) {
        try {
            console.log('[read-ack][emit] init', {roomId, initialPointer, maxPointerNum, lastIdStr});
        } catch {
        }
    }

    const schedulePush = () => {
        if (scheduled || !pendingIdStr) return;
        scheduled = true;
        if (DBG) {
            try {
                // console.log('[read-ack][emit] schedule', {roomId, pendingIdStr});
            } catch {
            }
        }
        setTimeout(() => {
            scheduled = false;
            if (!pendingIdStr) return;
            const payload = {
                roomId: roomId,
                lastReadMessageId: pendingIdStr,
            };
            if (DBG) {
                try {
                    console.log('[read-ack][emit] push', payload);
                } catch {
                }
            }
            try {
                emit('chat:read', payload);
            } catch (e) {
                try {
                    console.warn('[read-ack][emit] push failed', e);
                } catch {
                }
            } finally {
                pendingIdStr = null;
            }
        }, 50);
    };

    return function ack(messageId: number | string | null | undefined) {
        if (messageId == null) {
            if (DBG) {
                try {
                    console.log('[read-ack][emit] skip:null');
                } catch {
                }
            }
            return;
        }

        const idStr = String(messageId);
        const idNum = Number(messageId);

        if (Number.isFinite(idNum)) {
            if (idNum <= maxPointerNum) {
                if (DBG) {
                    try {
                        console.log('[read-ack][emit] skip:not-advancing', {roomId, idNum, maxPointerNum});
                    } catch {
                    }
                }
                return;
            }
            maxPointerNum = idNum;
            lastIdStr = idStr;
            if (DBG) {
                try {
                    console.log('[read-ack][emit] accept:numeric', {roomId, idNum, maxPointerNum});
                } catch {
                }
            }
        } else {
            if (lastIdStr === idStr) {
                if (DBG) {
                    try {
                        console.log('[read-ack][emit] skip:dup-uuid', {roomId, idStr});
                    } catch {
                    }
                }
                return;
            }
            lastIdStr = idStr;
            if (DBG) {
                try {
                    console.log('[read-ack][emit] accept:uuid', {roomId, idStr});
                } catch {
                }
            }
        }

        pendingIdStr = idStr;
        schedulePush();
    };
}
