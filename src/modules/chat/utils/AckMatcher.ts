

/**
 * AckMatcher
 * -----------
 * ใช้สำหรับจับคู่ข้อความที่ client ส่งออก (pending) กับข้อความที่ได้รับกลับจาก server
 * เพื่ออัปเดตสถานะจาก pending → sent (หรือ failed)
 *
 * ออกแบบให้ใช้งานในระบบ Phoenix/Realtime ที่อาจส่งซ้ำหรือมี delay
 * มีระบบเก็บ clientId และ serverId mapping พร้อม timeout cleanup
 */

export interface AckEvent {
  clientId?: string;
  serverId: string;
  roomId: string;
  senderId: number;
}

export type AckListener = (ack: AckEvent) => void;

export class AckMatcher {
  // Maps clientId -> serverId ('' if pending, or filled when acked)
  private readonly clientToServer = new Map<string, string>();
  private readonly listeners = new Set<AckListener>();
  private readonly timeoutMs: number;

  constructor(timeoutMs = 60000) {
    this.timeoutMs = timeoutMs;
  }

  /**
   * เรียกเมื่อได้รับข้อความจาก server (พร้อม serverId)
   * ถ้ามี clientId ที่จับคู่ได้ จะล้าง mapping และแจ้ง listener
   */
  onAck(ack: AckEvent) {
    if (ack.clientId) {
      this.clientToServer.set(ack.clientId, ack.serverId);
      setTimeout(() => this.clientToServer.delete(ack.clientId!), this.timeoutMs);
    }
    this.emit(ack);
  }

  /**
   * จับคู่ message ที่ client ส่งออกเพื่อรอ ack
   */
  trackPending(clientId: string) {
    if (!clientId) return;
    this.clientToServer.set(clientId, ''); // empty until ack received
    setTimeout(() => this.clientToServer.delete(clientId), this.timeoutMs);
  }

  /**
   * ตรวจสอบว่า clientId นี้ได้รับ ack แล้วหรือยัง
   */
  isAcked(clientId: string): boolean {
    const mapped = this.clientToServer.get(clientId);
    return !!mapped && mapped.length > 0;
  }

  /**
   * ตรวจสอบว่า serverId มีอยู่ใน mapping หรือไม่ (กัน duplicate)
   */
  hasServerId(serverId: string): boolean {
    for (const id of this.clientToServer.values()) {
      if (id === serverId) return true;
    }
    return false;
  }

  /** เพิ่ม listener สำหรับ event ack */
  subscribe(listener: AckListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(ack: AckEvent) {
    for (const fn of this.listeners) {
      try {
        fn(ack);
      } catch (e) {
        // Event safety: never throw from listeners
        console.warn('[AckMatcher] listener error', e);
      }
    }
  }
}

/**
 * ตัวช่วยสร้าง global instance แบบ singleton ได้
 */
export const GlobalAckMatcher = new AckMatcher(60000);