/**
 * ResendManager
 * --------------
 * จัดการคิว resend สำหรับข้อความที่ส่งไม่สำเร็จ (retry/backoff/jitter/limit)
 *
 * แนวคิดหลัก:
 * - ไม่มี loop ทำงานเองตลอดเวลา
 * - จะถูก "ปลุก" จากสองเหตุการณ์เท่านั้น
 *   1) onSendFailure(messageId) → ตั้ง retry meta และกำหนดรอบถัดไป
 *   2) flushAll() จาก NetworkMonitor เมื่อ OFF→ON
 * - สามารถสั่ง flushActive(roomId) ได้จาก UI (เช่นปุ่มลองใหม่ในห้องปัจจุบัน)
 * - ใช้ mutex ป้องกันการทำงานซ้อน
 */

import type {PhoenixSenderAdapter, SendDraft} from '../adapters/PhoenixSenderAdapter'
import {ChatMessageModel} from "@/modules/chat/types";


export type RetryMeta = Record<string, { retry: number; next: number }>

/** พอร์ตขั้นต่ำของ store ที่ ResendManager ต้องใช้ */
export interface ChatStorePort {
    getState(): {
        failedMessages: ChatMessageModel[]
        retryMeta: RetryMeta
    }

    upsertRetryMeta: (id: string, meta: { retry: number; next: number }) => void
    dropRetryMeta: (id: string) => void
    markFailed: (roomId: string, id: string) => void;
    promoteToSent: (roomId: string, id: string) => void;
}

export class ResendManager {
    private isResendingAll = false
    private isResendingActive = false
    private inFlight = new Set<string>()

    // delay ตารางพื้นฐาน (ms)
    private readonly baseDelays = [1000, 2000, 5000] as const

    constructor(
        private readonly store: ChatStorePort,
        private readonly sender: PhoenixSenderAdapter,
    ) {
    }

    /**
     * เรียกเมื่อส่งข้อความล้มเหลวครั้งแรก (หรือครั้งต่อ ๆ มา)
     * จะตั้ง retry meta และรอบเวลา next
     */
    onSendFailure(messageId: string) {
        const {retryMeta} = this.store.getState()
        const prev = retryMeta[messageId]
        const retry = (prev?.retry ?? 0)
        const delay = this.backoffDelay(retry)
        this.store.upsertRetryMeta(messageId, {retry, next: Date.now() + delay})
    }

    /** ปลุกเฉพาะห้องปัจจุบันให้ลองส่งใหม่ */
    async flushActive(roomId: string) {
        if (this.isResendingAll || this.isResendingActive) return
        this.isResendingActive = true
        try {
            await this.flush((m) => String(m.roomId) === String(roomId))
        } finally {
            this.isResendingActive = false
        }
    }

    /** ปลุกทุกห้อง (เช่นตอน OFF→ON) */
    async flushAll() {
        if (this.isResendingAll || this.isResendingActive) return
        this.isResendingAll = true
        try {
            const {failedMessages, retryMeta} = this.store.getState()
            const now = Date.now()

            // สร้าง/รีเฟรช retry meta สำหรับทุก failed เพื่อให้พร้อมส่งทันที
            for (const msg of failedMessages) {
                const meta = retryMeta[msg.id]
                const retry = meta?.retry ?? 0
                this.store.upsertRetryMeta(msg.id, {retry, next: now}) // next=now → due
            }

            // ส่งทุกห้องที่ครบกำหนด (predicate = true)
            await this.flush(() => true)
        } finally {
            this.isResendingAll = false
        }
    }


    /** ตัวทำงานหลัก ใช้ predicate เลือกข้อความ */
    private async flush(predicate: (m: ChatMessageModel) => boolean) {
        const {failedMessages, retryMeta} = this.store.getState()
        const now = Date.now()

        // NOTE: failedMessages มีเฉพาะที่ส่งไม่สำเร็จ เราอนุญาตให้ resend ได้เมื่อ meta.next ถึงกำหนด
        // คัดเฉพาะข้อความที่ครบกำหนดและยังไม่เกินลิมิต 3 ครั้ง
        const due = failedMessages.filter((m) => {
            if (!predicate(m)) return false
            const meta = retryMeta[m.id]
            const count = meta?.retry ?? 0
            if (!meta) return false // ต้องมี meta จาก onSendFailure ก่อน
            return meta.next <= now && count < 3 && !this.inFlight.has(m.id)
        })

        for (const msg of due) {
            this.inFlight.add(msg.id)
            try {
                // เตรียม draft สำหรับส่ง
                const draft: SendDraft = {
                    roomId: msg.roomId,
                    senderId: msg.senderId,
                    secure: msg.secure,
                    content: msg.content,
                    createdAt: msg.createdAt,
                    status: 'retrying',
                    id: msg.id, // ใช้ client id เพื่อให้ server ทำ idempotency ได้
                }

                const serverId = await this.sender.sendMessage("chat:message", draft)
                if (typeof serverId === 'string' && serverId.length > 0) {
                    // ส่งสำเร็จ → promote และล้าง retry meta
                    this.store.promoteToSent(msg.roomId, msg.id)
                    this.store.dropRetryMeta(msg.id)
                } else {
                    // ส่งไม่สำเร็จ → เพิ่มรอบ retry และตั้ง next ใหม่
                    const {retryMeta: metaNow} = this.store.getState()
                    const prev = metaNow[msg.id] ?? {retry: 0, next: now}
                    const nextRetry = prev.retry + 1
                    if (nextRetry >= 3) {
                        this.store.markFailed(msg.roomId, msg.id)
                        this.store.upsertRetryMeta(msg.id, {retry: nextRetry, next: now + this.backoffDelay(nextRetry)})
                    } else {
                        this.store.upsertRetryMeta(msg.id, {retry: nextRetry, next: now + this.backoffDelay(nextRetry)})
                    }
                }
            } catch {
                // treat as failure with backoff
                const {retryMeta: metaNow} = this.store.getState()
                const prev = metaNow[msg.id] ?? {retry: 0, next: now}
                const nextRetry = prev.retry + 1
                if (nextRetry >= 3) {
                    this.store.markFailed(msg.roomId, msg.id)
                }
                this.store.upsertRetryMeta(msg.id, {retry: nextRetry, next: now + this.backoffDelay(nextRetry)})
            } finally {
                this.inFlight.delete(msg.id)
            }
        }
    }

    /**
     * คำนวณดีเลย์ถัดไปตาม retry ครั้งที่ n (0-based)
     * ใช้ jitter เล็กน้อยเพื่อลดโอกาสชนกัน (±15%)
     */
    private backoffDelay(retryCount: number) {
        const base = this.baseDelays[Math.min(retryCount, this.baseDelays.length - 1)]
        return withJitter(base, 0.15)
    }
}

function withJitter(ms: number, ratio = 0.15) {
    const delta = ms * ratio
    const min = Math.max(0, ms - delta)
    const max = ms + delta
    return Math.floor(min + Math.random() * (max - min))
}
