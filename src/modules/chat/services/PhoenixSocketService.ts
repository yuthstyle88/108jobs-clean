"use client";
/**
 * Phoenix socket/channel adapter — MINIMAL
 * - No retries / no heartbeat overrides / no caches
 * - Just connect → join → forward → push/emit/close
 */
import {Socket as PhoenixSocket} from "phoenix";
import {buildActixWsUrl} from "@/modules/chat/utils/chatSocketUtils";

// Safe resolver for socket connection state across Phoenix versions / typings
function phoenixSocketState(s: any): 'connecting' | 'open' | 'closing' | 'closed' | 'unknown' {
  try {
    const byMethod = s?.connectionState?.();
    if (byMethod) return String(byMethod) as any;
  } catch {}
  try {
    const rs = s?.conn?.readyState;
    if (rs === 0) return 'connecting';
    if (rs === 1) return 'open';
    if (rs === 2) return 'closing';
    if (rs === 3) return 'closed';
  } catch {}
  try {
    return s?.isConnected?.() ? 'open' : 'closed';
  } catch {}
  return 'unknown';
}

// Keep a single Phoenix socket per URL to avoid double-connect/early-close from remounts
const socketCache = new Map<string, PhoenixSocket>();
function getOrCreateSocket(url: string, opts?: any): PhoenixSocket {
  const key = url;
  const existing = socketCache.get(key);
  if (existing) {
    // update params (e.g., token may rotate) without breaking phoenix versions
    if (opts?.params) {
      const curr: any = (existing as any).params;
      const incoming: any = (opts as any).params;
      if (typeof curr === 'function') {
        const currFn = curr.bind(existing);
        (existing as any).params = () => ({ ...(currFn() || {}), ...(typeof incoming === 'function' ? incoming() : incoming || {}) });
      } else if (curr && typeof curr === 'object') {
        (existing as any).params = { ...curr, ...(typeof incoming === 'function' ? incoming() : incoming || {}) };
      } else {
        // keep as function to be compatible with phoenix that expects params()
        (existing as any).params = () => (typeof incoming === 'function' ? incoming() : (incoming || {}));
      }
    }
    return existing;
  }

  // Normalize opts.params to a function for cross-version compatibility
  let normOpts = opts as any;
  if (opts?.params && typeof (opts as any).params !== 'function') {
    normOpts = { ...(opts as any), params: () => ((opts as any).params || {}) };
  }
  const s = new PhoenixSocket(url, normOpts);
  socketCache.set(key, s);
  return s;
}

export interface RealtimeChannelAdapter {
    readyState: number; // 0 connecting, 1 open, 2 closing, 3 closed
    onopen?: () => void;
    onmessage?: (event: { data: string }) => void;
    onclose?: (event: { code?: number; reason?: string }) => void;
    onerror?: (event?: unknown) => void;
    onheartbeat?: (ts: number) => void;
    send: (data: string | Record<string, unknown>) => void;
    emit?: (event: string, payload: unknown) => void;
    sendHeartbeat?: (payload?: Record<string, unknown>) => void;
    ackConfirm?: (clientIds: string[]) => void;
    syncPending?: (list: string[], sseqNext?: string) => void;
    startHeartbeat?: (intervalMs: number) => void;
    stopHeartbeat?: () => void;
    close: () => void;
}

const DEV = typeof process !== "undefined" && process.env.NODE_ENV !== "production";
const isInternalEvent = (ev?: string): boolean => !!ev && (
    ev.startsWith("chan_reply") || ev === "heartbeat" || ev === "presence_state" || ev === "presence_diff"
);

export function getChannelAdapter(token: string, topic: string, roomId: string, senderId: number): RealtimeChannelAdapter {
    const url = buildActixWsUrl();
    console.log("[phoenix] getChannelAdapter", {url, topic, roomId, senderId});
    const opts = token ? ({params: {token}} as any) : (undefined as any);

    if (!topic) throw new Error('phoenix: topic is required');
    const params: any = {topic};
    if (roomId) params.roomId = roomId;
    params.senderId = senderId;
    if (token) params.token = token;
    if (DEV) console.debug('[phoenix] channel()', { topic, params });

    const socket = getOrCreateSocket(url, opts);

    // Attach low-level diagnostics once
    try {
        (socket as any)._dbg_hooked ||= false;
        if (!(socket as any)._dbg_hooked) {
            (socket as any)._dbg_hooked = true;
            socket.onOpen(() => {
                if (DEV) console.debug('[phoenix] socket open', { url, state: phoenixSocketState(socket) });
            });
            (socket as any).onClose?.((ev: any) => {
                if (DEV) console.warn('[phoenix] socket close', { code: ev?.code, reason: ev?.reason, wasClean: ev?.wasClean });
            });
            (socket as any).onError?.((err: any) => {
                if (DEV) console.error('[phoenix] socket error', err);
            });
            (socket as any).onMessage?.((msg: any) => {
                if (DEV && msg?.event === 'phx_error') console.warn('[phoenix] phx_error', msg);
            });
        }
    } catch {}

    if (phoenixSocketState(socket) !== 'open') {
        socket.connect();
    }

    const ch = socket.channel(topic, params);

    let readyState = 0;
    const adapter: RealtimeChannelAdapter = {
        get readyState() {
            return readyState;
        },
        set readyState(v: number) {
            readyState = v;
        },
        onopen: undefined,
        onmessage: undefined,
        onclose: undefined,
        onerror: undefined,
        send(data: string | Record<string, any>) {
            try {
                const payload = typeof data === "string" ? JSON.parse(data) : data;
                (ch as any).push("chat:message", payload);
            } catch (e) {
                if (DEV) console.error("[phoenix] send() invalid JSON payload", {data, e});
                adapter.onerror?.({code: "INVALID_JSON", reason: "send() expects a JSON string or object", data});
            }
        },
        emit(event: string, payload: any) {
            try {
                (ch as any).push(event, payload);
            } catch (e) {
                if (DEV) console.warn("[phoenix] emit failed", {event, e});
            }
        },
        sendHeartbeat(payload?: Record<string, any>) {
            const base = { senderId, event: "heartbeat" };
            const merged = typeof payload === 'object' && payload ? { ...base, ...payload } : base;
            try {
                ch.push("heartbeat", merged);
                try { adapter.onheartbeat?.(Date.now()); } catch {}
                try { if (typeof window !== 'undefined') window.dispatchEvent(new Event('chat:heartbeat')); } catch {}
                if (DEV) console.debug("[phoenix] custom heartbeat sent", merged);
            } catch (err) {
                console.warn("[phoenix] heartbeat send failed", err);
            }
        },
        close() {
            if (readyState === 3) return;
            readyState = 2;
            try {
                (ch as any).leave?.();
            } catch {
            }
            try {
                socket.disconnect?.();
            } catch {
            }
            readyState = 3;
            adapter.onclose?.({code: 1000, reason: "client closed"});
        },
    } as RealtimeChannelAdapter;

    // --- Protocol helpers ---
    adapter.ackConfirm = (clientIds: string[]) => {
        try {
            (ch as any).push("ackConfirm", { roomId, senderId, clientIds });
        } catch (e) { if (DEV) console.warn("[phoenix] ackConfirm failed", e); }
    };

    adapter.syncPending = (list: string[], sseqNext?: string) => {
        try {
            (ch as any).push("sync:pending", {
                roomId, senderId, list,
                sseqHello: sseqNext ? { next: sseqNext } : undefined,
            });
        } catch (e) { if (DEV) console.warn("[phoenix] sync:pending failed", e); }
    };

    // Heartbeat scheduler (client-side trigger)
    let hbTimer: ReturnType<typeof setInterval> | null = null;
    adapter.startHeartbeat = (intervalMs: number) => {
        if (hbTimer) clearInterval(hbTimer);
        hbTimer = setInterval(() => adapter.sendHeartbeat?.(), Math.max(1000, intervalMs|0));
    };
    adapter.stopHeartbeat = () => { if (hbTimer) clearInterval(hbTimer); hbTimer = null; };

    // Forward all non-internal events as a normalized envelope
    try {
        const orig = (ch as any).onMessage?.bind(ch);
        (ch as any).onMessage = (event: string, payload: any, ref: any) => {
            if (event && !isInternalEvent(event)) {
                let outEvent = event;
                let outPayload: any = payload == null ? {} : payload;
                if (payload && typeof payload === "object" && typeof (payload as any).event === "string") {
                    outEvent = String((payload as any).event);
                    const inner = (payload as any).payload;
                    outPayload = inner == null ? {} : inner;
                }
                const env = {event: outEvent, topic: topic.replace(/^room:/, ""), payload: outPayload};
                try {
                    adapter.onmessage?.({data: JSON.stringify(env)});
                } catch {
                }
            }
            return orig ? orig(event, payload, ref) : payload;
        };
    } catch {
    }

    // Basic lifecycle hooks
    try {
        (ch as any).onError?.((e: any) => {
            if (DEV) console.warn('[phoenix] channel error', { topic, e });
            adapter.onerror?.(e);
        });
    } catch {}
    try {
        (ch as any).onClose?.((e?: any) => {
            const info = { code: e?.code ?? 1006, reason: e?.reason ?? 'channel closed' };
            if (DEV) console.warn('[phoenix] channel closed', { topic, ...info });
            readyState = 3;
            adapter.onclose?.(info);
        });
    } catch {}

    // Single join
    try {
        (ch as any).join()
            .receive("ok", () => {
                if (DEV) console.log("[phoenix] join ok", {topic});
                if (readyState === 0) {
                    readyState = 1;
                    adapter.onopen?.();
                }
                try {
                    const pending: string[] = (typeof window !== 'undefined' && (window as any)?.chatOutbox?.pending?.(roomId, senderId)) || [];
                    adapter.syncPending?.(pending);
                } catch {}
            })
            .receive("error", (e: any) => {
                if (DEV) console.log("[phoenix] join error", {topic, e});
                adapter.onerror?.(e);
            });
    } catch (e) {
        if (DEV) console.log("[phoenix] join exception", {topic, e});
        adapter.onerror?.(e);
    }

    return adapter;
}
