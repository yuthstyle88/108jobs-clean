import {dbg} from "@/modules/chat/utils/helpers";
import {SendMessageDeps} from "@/modules/chat/types";
import {WS_EVENT} from "@/modules/chat/protocol/wireEvents";

let __wireRef = 0;
const nextRef = () => String(++__wireRef);

export function wsSend(socket: any, obj: any) {
    if (!socket) return false;
    const event = obj?.event ?? obj?.type ?? 'message';
    const payload = obj?.payload ?? obj;
    const frame = { event, payload };
    try {
        // 1) ChatChannel API (channel.push(event, payload))
        if (typeof socket.push === 'function') {
            dbg('wsSend → channel.push', frame);
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
            // wire v2: one object envelope, always. `room` is the bare room id
            // and is simply omitted when there isn't one -- under the old
            // five-slot array a missing field had to be a null placeholder or
            // everything after it shifted. `ref` correlates the server's reply.
            const room = payload?.roomId ? String(payload.roomId) : null;
            const wireFrame: Record<string, unknown> = {
                ref: nextRef(),
                event: String(event),
                payload: payload ?? {},
            };
            if (room) wireFrame.room = room;
            dbg('wsSend → raw ws (wire v2)', { wireFrame });
            socket.send(JSON.stringify(wireFrame));
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
 * Wait for a `reply` ack (see WS_EVENT.AckConfirm's counterpart on the
 * inbound side) that matches the given message id.
 * Uses onAny/onMessage if available; otherwise resolves false after timeout.
 */
export function waitForAck(deps: SendMessageDeps, clientId: string, timeoutMs = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    let unsubs: Array<() => void> = [];

    // wire v2 answers a ref-carrying frame with a `reply` event whose payload
    // is {status: 'ok' | 'error', response}. Same two statuses phx_reply had.
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
          if (ev !== WS_EVENT.Reply) return;
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