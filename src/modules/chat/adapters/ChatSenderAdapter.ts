import type {ChatMessage} from '108jobs-client';

/**
 * ChatSenderAdapter
 * - Attempts to send via channel.push first (to capture server reply/id), else falls back to wsSend.
 * - Emits a single optimistic `emitChatNewMessage` (adapter is the single source of this emit).
 * - Waits for an ack (best-effort) to flip status from 'pending' → 'sent' when possible.
 * - Returns the server message id if the backend replies with one; otherwise returns the client-generated id.
 */

// ข้อมูลขั้นต่ำที่ต้องใช้ในการส่งข้อความ  (ไม่ผูกกับชนิดจาก SDK ภายนอก)
export type SendDraft = ChatMessage;

export interface ChatSenderPort {
    /**
     * ส่งข้อความไปยัง backend
     * @returns server message id (string) เมื่อสำเร็จ, หรือ false เมื่อไม่สำเร็จ
     */
    sendMessage(event: string, draft: SendDraft): Promise<string | false>;
}

/**
 * Chat Channel Minimal Shape
 * รองรับการฉีด channel ที่มี method push ซึ่งคืน Promise ของผลลัพธ์
 */
export type ChatChannelLike = {
    /** ส่ง event พร้อม payload และรับผลลัพธ์แบบ promise */
    push: (event: string, payload: unknown) => Promise<unknown> | unknown;
};

/**
 * ตัวอย่าง implementation สำหรับ chat channel
 * - ไม่ผูกกับโครงสร้าง response ที่ตายตัว พยายามดึง id อย่างยืดหยุ่น
 * - ไม่ throw exception ออกไปข้างนอก คืน false แทน เพื่อให้ ResendManager ตัดสินใจ retry
 */
/** Called when an outbound send fails so ResendManager can schedule retry */
export class ChatSenderAdapter implements ChatSenderPort {
  constructor(private socket: ChatChannelLike | WebSocket) {}

  async sendMessage(event: string, payload: SendDraft): Promise<string | false> {
    try {
      const clientId = (payload as any)?.id ?? null;
      const safePayload = (payload ?? {}) as unknown; // บังคับไม่ให้ undefined

      // 1) ช่องทาง ChatChannel (ถ้ามี .push)
      if (typeof (this.socket as any)?.push === 'function') {
        const ch = this.socket as any; // ChatChannel
        // ChatChannel: push(event, payload).receive('ok'|'error'|'timeout', cb)
        return await new Promise<string | false>((resolve) => {
          try {
            // Push exactly ONCE and reuse the single result both to chain
            // .receive(...) and to check whether .receive exists. Calling
            // ch.push() a second time here would send the message over the
            // wire again -- it's a real network send, not an idempotent
            // getter (see Bug B regression test).
            const pushResult = ch.push(event, safePayload);

            pushResult
              ?.receive?.('ok', (resp: any) => {
                // If backend returns {id: "..."} or {message: {id: "..."}}
                const serverId = resp?.id ?? resp?.message?.id ?? resp?.msgRefId ?? clientId;
                resolve(String(serverId ?? clientId ?? ''));
              })
              ?.receive?.('error', (_err: any) => resolve(false))
              ?.receive?.('timeout', () => resolve(false));

            // If no receive method (unlikely for ChatChannel, but for safety)
            if (typeof pushResult?.receive !== 'function') {
                setTimeout(() => resolve(String(clientId ?? '')), 0);
            }
          } catch (_e) {
            resolve(false);
          }
        });
      }

      // 2) ช่องทาง adapter ที่มี emit(event, payload)
      if (typeof (this.socket as any)?.emit === 'function') {
        (this.socket as any).emit(event, safePayload);
        return String(clientId ?? '');
      }

      // 3) ช่องทาง raw WebSocket → ส่ง wire-v2 object envelope
      if (typeof (this.socket as any)?.send === 'function') {
        const ws = this.socket as any;

        // หา room ให้ดีที่สุด: จาก channel.room, หรือ payload.roomId
        // v2 carries the bare room id -- no `chat:`/`room:` topic prefix, and
        // no five-slot array to keep positionally aligned. An absent room is
        // simply an omitted field now, not a null placeholder.
        const room =
          (ws?.room as string) ??
          (ws?.channel as string) ??
          (safePayload as any)?.roomId;

        const frame: Record<string, unknown> = {
          event: String(event),
          payload: safePayload ?? {},
        };
        if (room) frame.room = String(room);
        ws.send(JSON.stringify(frame));

        return String(clientId ?? '');
      }

      // ส่งไม่ได้จริง ๆ
      return false;
    } catch (_err) {
      return false;
    }
  }
}
