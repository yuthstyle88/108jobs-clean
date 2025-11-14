import type {RefObject} from "react";
import {HttpService} from "@/services";
import {REQUEST_STATE, RequestState} from "@/services/HttpService";
import {emitReadReceipt} from "@/modules/chat/events";
import type {ChatMessageView, ChatRoomResponse} from "lemmy-js-client";
import {ChatMessage} from "lemmy-js-client";
import {NormalizedEnvelope} from "@/modules/chat/utils/chatSocketUtils";
import {RoomView} from "@/modules/chat/types";

// Type guard: narrow a NormalizedEnvelope to the typing envelope (explicit interface)
export type TypingEnv = {
    event: 'chat:typing';
    roomId: string;
    typing: boolean;
    sender?: ChatMessageView['sender'];
};

function isTypingEnvelope(env: NormalizedEnvelope): env is TypingEnv {
    return !!env && (env as any).event === 'chat:typing' && typeof (env as any).roomId === 'string';
}

export function parseTypingDetail(env: NormalizedEnvelope, _fallbackRoomId: string, localUserId: number): {
    roomId: string;
    senderId: number;
    typing: boolean
} | null {
    try {
        if (!isTypingEnvelope(env)) return null;
        const roomId = env.roomId?.trim();

        if (!roomId) return null;
        const senderId = Number(env.sender?.id ?? 0);
        if (!senderId || senderId === Number(localUserId)) return null; // ignore self

        const typing = Boolean(env.typing);

        return {roomId, senderId, typing};
    } catch {
        return null;
    }
}

// ---- helpers: status-change ----
// export async function maybeHandleStatusChange(env: any, roomId: string): Promise<boolean> {
//     try {
//         const evName = String(env?.event ?? "");
//         if (!evName.toLowerCase().includes("update")) return false;
//
//
//         const api = require("@/modules/chat/store/roomsStore");
//         const {upsertRoom} = api.useRoomsStore.getState();
//
//         const chatRoomRes = await HttpService.client.getChatRoom(roomId);
//         if (chatRoomRes.state === REQUEST_STATE.SUCCESS) {
//             const newRoom = chatRoomRes.data.room;
//             upsertRoom(newRoom as RoomView);
//         } else {
//             console.error("[maybeHandleStatusChange] failed:", chatRoomRes);
//         }
//
//         return true;
//     } catch (err) {
//         if (localStorage.getItem("chat_debug") === "1") {
//             console.error("[maybeHandleStatusChange] error:", err);
//         }
//         return false;
//     }
// }
export async function maybeHandleStatusChange(env: any, roomId: string, fetchedRoomData: ChatRoomResponse | null, refetchRoom: () => Promise<RequestState<ChatRoomResponse> | undefined>): Promise<boolean> {
    // --- Debug helper ---
    const logStep = (label: string, value: any) => {
        try {
            const logs = JSON.parse(localStorage.getItem("maybeHandleStatusChange_debug") || "[]");
            logs.push({
                time: new Date().toISOString(),
                label,
                value
            });
            localStorage.setItem("maybeHandleStatusChange_debug", JSON.stringify(logs));
        } catch (_) {
            // ignore localStorage errors
        }
    };

    try {
        logStep("env received", env);

        const evName = String(env?.event ?? "");
        logStep("parsed event name", evName);

        const isUpdateEvent = evName.toLowerCase().includes("update");
        logStep("is update event?", isUpdateEvent);

        if (!isUpdateEvent) {
            logStep("skipped - not update event", null);
            return false;
        }

        // Load room store
        logStep("loading store", {roomId});

        const api = require("@/modules/chat/store/roomsStore");
        const {upsertRoom} = api.useRoomsStore.getState();
        await refetchRoom();
        // Fetch Chat Room Info
        logStep("chat room response", fetchedRoomData);

        const newRoom = fetchedRoomData?.room;
        logStep("upserting new room", newRoom);

        upsertRoom(newRoom as RoomView);


        logStep("finished successfully", null);
        return true;

    } catch (err) {
        logStep("caught error", err);

        if (localStorage.getItem("chat_debug") === "1") {
            console.error("[maybeHandleStatusChange] error:", err);
        }
        return false;
    }
}


// ---- helpers: read receipt ----
export function maybeHandleReadReceipt(env: any, fallbackRoomId: string): boolean {
    try {
        const evName = String(env?.event || env?.content || "");
        if (evName !== "readUpTo") return false;

        const roomId = String(env?.roomId || env?.topic || fallbackRoomId);
        const lastReadMessageId = String(env?.lastReadMessageId || "");
        const readerId = Number(env?.readerId ?? 0);
        const updatedAt = env?.updatedAt || env?.createdAt || null; // <- depending on backend payload

        // Emit event for internal WS listeners
        emitReadReceipt(roomId, lastReadMessageId, readerId);
        const api = require('@/modules/chat/store/readStore');
        const {setPeerLastReadAt} = api.useReadLastIdStore.getState?.() || {};
        if (typeof setPeerLastReadAt === 'function' && updatedAt) {
            setPeerLastReadAt(roomId, readerId, updatedAt);
        }
        return true;
    } catch {
        return false;
    }
}

export async function maybeHandlePresenceUpdate(env: any, meId: number): Promise<boolean> {
    try {
        const evName = String(env?.event || '');
        // accept any heartbeat-like event names and avoid throwing on missing sender
        if (!evName || !evName.toLowerCase().includes('heartbeat')) return false;
        const senderId = Number(env?.sender?.id ?? env?.readerId ?? env?.payload?.senderId ?? 0);
        if (!senderId || senderId === Number(meId)) return false;
        try {
            const api = require('@/modules/chat/store/presenceStore');
            const {setSnapshot} = api.usePresenceStore.getState();
            setSnapshot([{userId: senderId, lastSeenAt: Date.now()}]);
        } catch (err) {
            try {
                if (localStorage.getItem('chat_debug') === '1') console.error('presence update failed:', err);
            } catch {
            }
        }
        return true;
    } catch {
        return false;
    }
}

// ---- helpers: new messages merge ----
export function mergeNewMessages(
    prev: ChatMessage[],
    incoming: ChatMessage[],
) {
    const map = new Map<string, ChatMessage>();
    for (const m of prev) map.set(String(m.id), m);
    for (const m of incoming) map.set(String(m.id), m);
    const arr = Array.from(map.values());
    return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ---- helpers: auto-ack (read receipt) ----
export function tryFlushAutoAck(handleWSMessageFn: any, roomIdStr: string, readAckRef: RefObject<((lastId: string) => void) | null>, ackCooldownRef: RefObject<number | undefined>) {
    try {
        const batchId = (handleWSMessageFn as any)._batchAckLastId as string | undefined;
        (handleWSMessageFn as any)._batchAckLastId = null;
        if (!batchId) return;

        const now = Date.now();
        const lastAcked = (handleWSMessageFn as any)._lastAckedId as string | undefined;

        const requireFocus = (() => {
            try {
                return localStorage.getItem("read_ack_require_focus") !== "0";
            } catch {
                return true;
            }
        })();
        const isActiveTab = typeof document !== "undefined"
            ? (document.visibilityState === "visible" && (typeof (document as any).hasFocus === 'function' ? (document as any).hasFocus() : true))
            : true;
        if (requireFocus && !isActiveTab) {
            try {
                if (localStorage.getItem("debug_read_ack") === "1") console.log("[read-ack] skip: tab not active (visibility/focus required)");
            } catch {
            }
            return;
        }
        if (lastAcked === batchId) return;
        if (now < (ackCooldownRef.current ?? 0)) return;

        readAckRef.current?.(batchId);
        (handleWSMessageFn as any)._lastAckedId = batchId;
        ackCooldownRef.current = now + 900;
    } catch {
    }
}

// ---- helpers: failure cleanup ----
export function cleanupFetch(setIsFetching?: (b: boolean) => void, fetchTimeoutRef?: RefObject<any>, fetchResolveRef?: RefObject<(() => void) | null>) {
    try {
        setIsFetching?.(false);
    } catch {
    }
    try {
        if (fetchTimeoutRef?.current) {
            clearTimeout(fetchTimeoutRef.current);
            fetchTimeoutRef.current = null as any;
        }
    } catch {
    }
    try {
        if (fetchResolveRef?.current) {
            fetchResolveRef.current();
            fetchResolveRef.current = null;
        }
    } catch {
    }
}

export function buildMessageSignature(msg: any): string {
    // Fast path: prefer stable ids first
    const id = msg?.id ?? "";
    if (id != null) return String(id);

    // Fallback: composite signature (room|sender|ts|content)
    const room = msg?.roomId ?? "";
    const sender = msg?.senderId ?? "";
    const ts = msg?.createdAt ?? "";
    const c = msg?.content;
    const content = typeof c === "string" ? c : (c == null ? "" : JSON.stringify(c));

    return `${room}|${sender}|${ts}|${content}`;
}


/**
 * Lightweight, safe debug logger for websocket flows.
 * Enable with localStorage.setItem('debugWs','1') or NEXT_PUBLIC_DEBUG_WS=1
 *
 * NOTE: keep the same name/signature so all existing call sites work.
 */
export function dbg(label: string, data?: unknown) {
    try {
        // Gate – support both browser/local flag and env flag.
        const enabled =
            (typeof localStorage !== 'undefined' && localStorage.getItem('debugWs') === '1') ||
            (typeof process !== 'undefined' && (process as any)?.env?.NEXT_PUBLIC_DEBUG_WS === '1');
        if (!enabled) return;

        // Timestamped, namespaced header
        const ts = new Date().toISOString();
        const header = `[debug ${ts}] ${label}`;

        // Redact potentially sensitive blobs (tokens, long ciphertexts)
        const redact = (v: any): any => {
            if (v == null) return v;
            if (typeof v === 'string') {
                // redact obvious JWT/ciphertext-looking strings
                if (v.length > 120) return `${v.slice(0, 32)}…[${v.length} chars]`;
                return v;
            }
            if (Array.isArray(v)) return v.map(redact);
            if (typeof v === 'object') {
                const out: Record<string, any> = {};
                for (const [k, val] of Object.entries(v)) {
                    if (/token|authorization|auth|secret/i.test(k)) {
                        out[k] = '[redacted]';
                    } else if (k === 'content' && typeof val === 'string' && val.length > 120) {
                        out[k] = `${val.slice(0, 32)}…[${val.length} chars]`;
                    } else {
                        out[k] = redact(val as any);
                    }
                }
                return out;
            }
            return v;
        };

        const payload = redact(data);

        // Compact output by default; expand in console to inspect
        if (typeof console.groupCollapsed === 'function') {
            console.groupCollapsed(header);
            // eslint-disable-next-line no-console
            console.log(payload ?? '');
            console.groupEnd();
        } else {
            // eslint-disable-next-line no-console
            console.info(header, payload ?? '');
        }
    } catch {
        // never throw from a debug helper
    }
}

// Normalize various timestamp inputs (ISO string, epoch seconds, epoch ms) to ms
// SINGLE SOURCE OF TRUTH for time normalization:
export function toMsNormalized(v: any): number {
    if (v == null) return 0;
    if (typeof v === 'number') {
        return v < 1e12 ? Math.trunc(v * 1000) : Math.trunc(v);
    }
    if (v instanceof Date) {
        return Math.trunc(v.getTime());
    }
    if (typeof v === 'string') {
        const num = Number(v);
        if (Number.isFinite(num)) {
            return num < 1e12 ? Math.trunc(num * 1000) : Math.trunc(num);
        }
        // Normalize ISO-ish strings to a strict form similar to previous logic
        let s = v.trim();
        s = s.replace(' ', 'T');
        s = s.replace(/(\.\d{3})\d+/, '$1');
        s = s.replace(/\s*\+00:00$/, 'Z');
        if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(s)) s += 'Z';
        const t = Date.parse(s);
        return Number.isFinite(t) ? Math.trunc(t) : 0;
    }
    const t = Date.parse(String(v));
    return Number.isFinite(t) ? Math.trunc(t) : 0;
}

export function isOlder(
    lastReadAt: string | number | Date,
    createdAt: string | number | Date,
): boolean {
    const t1 = toMsNormalized(lastReadAt);
    const t2 = toMsNormalized(createdAt);
    if (!Number.isFinite(t1) || !Number.isFinite(t2)) return false;
    return t1 < t2;
}

/**
 * Return true if `a` is the same moment (within drift) or after `b`.
 */
export function isSameOrAfter(
    a: string | number | Date,
    b: string | number | Date,
    driftMs = 1000,
): boolean {
    const tA = toMsNormalized(a);
    const tB = toMsNormalized(b);
    if (!Number.isFinite(tA) || !Number.isFinite(tB)) return false;
    return tA + driftMs >= tB;
}

/**
 * Approximate equality within a drift window (default 1s).
 */
export function isApproxSame(
    a: string | number | Date,
    b: string | number | Date,
    driftMs = 1000,
): boolean {
    const tA = toMsNormalized(a);
    const tB = toMsNormalized(b);
    if (!Number.isFinite(tA) || !Number.isFinite(tB)) return false;
    return Math.abs(tA - tB) <= driftMs;
}


