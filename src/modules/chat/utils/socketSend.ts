import {dbg} from "@/modules/chat/utils/helpers";
import {SendMessageDeps} from "@/modules/chat/types";

let __phxRef = 0;
const nextRef = () => String(++__phxRef);

export function wsSend(socket: any, obj: any) {
    if (!socket) return false;
    const event = obj?.event ?? obj?.type ?? 'message';
    const payload = obj?.payload ?? obj;
    const frame = { event, payload };
    try {
        // 1) Phoenix Channel API (channel.push(event, payload))
        if (typeof socket.push === 'function') {
            dbg('wsSend → phoenix.push', frame);
            socket.push(event, payload);
            return true;
        }
        // 2) Adapter with emit(event, payload)
        if (typeof socket.emit === 'function') {
            dbg('wsSend → adapter.emit', frame);
            socket.emit(event, payload);
            return true;
        }
        // 3) Raw WebSocket API
        if (typeof socket.send === 'function') {
            const canCheckReady = typeof (globalThis as any).WebSocket !== 'undefined' && typeof socket.readyState === 'number';
            if (canCheckReady && socket.readyState !== (globalThis as any).WebSocket.OPEN) {
                dbg('wsSend → raw ws not open', { readyState: socket.readyState });
                return false;
            }
            // If payload hints at Phoenix topic, send Phoenix wire frame; otherwise send JSON {event,payload}
            const topic = payload?.roomTopic ?? (payload?.roomId ? `room:${payload.roomId}` : null);
            if (topic) {
                const phxFrame = [null, nextRef(), String(topic), String(event), payload ?? {}];
                dbg('wsSend → raw ws (phoenix frame)', { phxFrame });
                socket.send(JSON.stringify(phxFrame));
            } else {
                dbg('wsSend → raw ws (json)', frame);
                socket.send(JSON.stringify(frame));
            }
            return true;
        }
        // 4) postMessage (BroadcastChannel/Worker/ServiceWorker)
        if (typeof socket.postMessage === 'function') {
            dbg('wsSend → postMessage', frame);
            socket.postMessage(frame);
            return true;
        }
        // 5) Generic sendMessage(event, payload) or sendMessage(frame)
        if (typeof socket.sendMessage === 'function') {
            dbg('wsSend → sendMessage', frame);
            try { socket.sendMessage(event, payload); } catch { socket.sendMessage(frame); }
            return true;
        }
        dbg('wsSend → no send method found');
        return false;
    } catch (err) {
        dbg('wsSend → error', { err });
        return false;
    }
}

/**
 * Wait for an ack ('chat:ack') that matches the given message id.
 * Uses onAny/onMessage if available; otherwise resolves false after timeout.
 */
export function waitForAck(deps: SendMessageDeps, clientId: string, timeoutMs = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    let unsubs: Array<() => void> = [];

    // Phoenix protocol acknowledges messages with `phx_reply` event containing status 'ok' or 'error'
    const transport: any = (deps as any)?.adapter || (deps as any)?.sender;

    const cleanup = () => {
      try { clearTimeout(timer); } catch {}
      for (const off of unsubs) {
        try {
          if (typeof off === 'function') {
            off();
          }
        } catch {}
      }
      unsubs = [];
    };

    const timer: any = setTimeout(() => {
      if (!settled) {
        settled = true;
        try {
          dbg('waitForAck timeout', {
            clientId,
            timeoutMs,
            transport: !!transport,
            at: new Date().toISOString(),
          });
        } finally {
          cleanup();
          resolve(false);
        }
      }
    }, timeoutMs);


    try {
      const addMessageListener = (deps as any)?.addMessageListener;
      if (typeof addMessageListener === 'function') {
        const off = addMessageListener((packet: any) => {
          const ev = packet?.event;
          const payload = packet?.payload ?? packet;
          dbg('waitForAck addMessageListener event', { ev, payload });
          if (ev !== 'phx_reply') return;
          const status = payload?.status;
          const response = payload?.response;
          const id = response?.id ?? response?.message?.id ?? response?.msgRefId;
          
          if (status === 'ok' && (String(id) === String(clientId) || !id)) {
            dbg('waitForAck received', { clientId, status, id });
            if (!settled) { settled = true; cleanup(); resolve(true); }
          }
        });
        if (typeof off === 'function') unsubs.push(off);
      } else {
        dbg('waitForAck no addMessageListener on deps');
      }
    } catch (err) {
      dbg('waitForAck addMessageListener error', err);
    }

    dbg('waitForAck subscription summary', {
      hasAddMessageListener: typeof (deps as any)?.addMessageListener === 'function',
    });

    // Fallback: no event subscription → resolve false after timeout
  });
}