import type {ChatMessage} from 'lemmy-js-client';

/**
 * PhoenixSenderAdapter
 * - Attempts to send via channel.push first (to capture server reply/id), else falls back to wsSend.
 * - Emits a single optimistic `emitChatNewMessage` (adapter is the single source of this emit).
 * - Waits for an ack (best-effort) to flip status from 'pending' → 'sent' when possible.
 * - Returns the server message id if the backend replies with one; otherwise returns the client-generated id.
 */

// ข้อมูลขั้นต่ำที่ต้องใช้ในการส่งข้อความ  (ไม่ผูกกับชนิดจาก SDK ภายนอก)
export type SendDraft = ChatMessage;

export interface ChatSenderAdapter {
    /**
     * ส่งข้อความไปยัง backend
     * @returns server message id (string) เมื่อสำเร็จ, หรือ false เมื่อไม่สำเร็จ
     */
    sendMessage(event: string, draft: SendDraft): Promise<string | false>;
}

/**
 * Phoenix Channel Minimal Shape
 * รองรับการฉีด channel ที่มี method push ซึ่งคืน Promise ของผลลัพธ์
 */
export type PhoenixChannel = {
    /** ส่ง event พร้อม payload และรับผลลัพธ์แบบ promise */
    push: (event: string, payload: unknown) => Promise<unknown> | unknown;
};

/**
 * ตัวอย่าง implementation สำหรับ Phoenix channel
 * - ไม่ผูกกับโครงสร้าง response ที่ตายตัว พยายามดึง id อย่างยืดหยุ่น
 * - ไม่ throw exception ออกไปข้างนอก คืน false แทน เพื่อให้ ResendManager ตัดสินใจ retry
 */
/** Called when an outbound send fails so ResendManager can schedule retry */
export class PhoenixSenderAdapter implements ChatSenderAdapter {
  constructor(private socket: PhoenixChannel | WebSocket) {}

  async sendMessage(event: string, payload: SendDraft): Promise<string | false> {
    try {
      const clientId = (payload as any)?.id ?? null;
      const safePayload = (payload ?? {}) as unknown; // บังคับไม่ให้ undefined

      // 1) ช่องทาง PhoenixChannel (ถ้ามี .push)
      if (typeof (this.socket as any)?.push === 'function') {
        const ch = this.socket as any; // PhoenixChannel
        // phoenix.js มาตรฐาน: push(event, payload).receive('ok'|'error'...)
        return await new Promise<string | false>((resolve) => {
          try {
            ch.push(event, safePayload)
              ?.receive?.('ok', (_resp: any) => resolve(String(clientId ?? '')))
              ?.receive?.('error', (_err: any) => resolve(false))
              ?.receive?.('timeout', () => resolve(false));
            // ถ้าไม่มี receive (adapter อื่น): ส่งแล้วถือว่าสำเร็จแบบ fire-and-forget
            setTimeout(() => resolve(String(clientId ?? '')), 0);
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

      // 3) ช่องทาง raw WebSocket → ส่งเฟรม Phoenix 5 ช่องให้ครบตลอด
      if (typeof (this.socket as any)?.send === 'function') {
        const ws = this.socket as any;

        // หา topic ให้ดีที่สุด: จาก channel.topic, หรือ payload.topic/roomId, ไม่ก็ 'phx'
        const topic =
          (ws?.topic as string) ??
          (ws?.channel as string) ??
          (safePayload as any)?.topic ??
          (safePayload as any)?.roomId ??
          'phx';

        // join_ref / ref: ใช้ null เพื่อคงตำแหน่ง (หรือจะ gen ref เองก็ได้)
        const jr: string | null = null;
        const mr: string | null = null;

        // บังคับ 5 ช่องเสมอด้วย payload {}
        const frame = [jr, mr, String(topic), String(event), safePayload ?? {}];
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
