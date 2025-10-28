// src/modules/chat/store/chatStore.ts
import {create} from 'zustand'
import {ChatMessage, ChatStatus} from 'lemmy-js-client'
import {normRoom} from "@/utils/helpers";
import {useReadLastIdStore} from "@/modules/chat/store/readStore";
import {isBrowser} from "@/utils";

// Utility function for read-last-id store interaction
const readLastIdUtils = {
    setLastReadAt: (roomId: string, senderId: number, createdAt: string) => {
        try {
            const state = useReadLastIdStore.getState();
            if(typeof state.setLastReadAt === 'function') {
                state.setLastReadAt(roomId, senderId, createdAt);
            }
        } catch (e) {
            if(process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.debug('[chatStore.readLastIdUtils] setLastReadAt failed', e);
            }
        }
    }
};


// --- local pure helpers (no Zustand refs) ---
function mergeIntoMessages(list: ChatMessage[], msg: ChatMessage): ChatMessage[] {
    const k = String(msg.id);
    const map = new Map(list.map(m => [String(m.id), m]));
    const prev = map.get(k);
    map.set(k, prev ? {...prev, ...msg} : msg);
    return Array.from(map.values());
}

function removeAt<T>(arr: T[], index: number): T[] {
    if(index < 0 || index >= arr.length) return arr.slice();
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

function flushByStatus(
  getFn: () => ChatStoreState & ChatStoreActions,
  status: 'pending' | 'retrying' | 'failed',
  roomId?: string
): ChatMessage[] {
  const { listMessages, retryMeta } = getFn();
  const now = Date.now();
  const norm = roomId ? normRoom(String(roomId)) : undefined;
  return listMessages.filter((m: any) => {
    const isRoomOk = !norm || normRoom(String(m.roomId)) === norm;
    const isStatus = m.status === status;
    const meta = retryMeta[String(m.id)];
    const due = !meta || meta.next <= now;
    return isRoomOk && isStatus && due;
  });
}

type RetryMeta = Record<string, { retry: number; next: number }>

interface ChatStoreState {
    retryMeta: RetryMeta
    listMessages: ChatMessage[]
}

interface ChatStoreActions {
    addMessage: (msg: ChatMessage) => void
    upsertHistory: (items: ChatMessage[]) => void
    upsertMessage: (msg: ChatMessage) => void
    addPending: (msg: ChatMessage) => void
    removePending: (id: string) => void
    promoteToSent: (id: string) => void
    markFailed: (id: string) => void
    upsertRetryMeta: (id: string, meta: { retry: number; next: number }) => void
    dropRetryMeta: (id: string) => void
    getByRoom: (roomId: string) => ChatMessage[]
    getMessageById: (id: string) => ChatMessage | undefined
    commitStatus: (id: string, status: ChatStatus) => void
    retryMessage: (id: string) => void
    flushPending: (roomId?: string) => ChatMessage[]
    flushFailed: (roomId?: string) => ChatMessage[]
    removeMessage: (id: string) => void
    addPendingMessage: (msg: ChatMessage) => void
    removePendingMessage: (id: string) => void
    clearPendingMessages: () => void
}

export const useChatStore = create<ChatStoreState & ChatStoreActions>((set, get) => ({
    retryMeta: {},
    listMessages: [],

    addMessage: (msg) => set((s) => {
        // Store every message; this store is the render source of truth.
        if (isBrowser() && (msg as any).roomId && (msg as any).senderId && (msg as any).createdAt) {
            const ts = Date.parse(String((msg as any).createdAt));
            if (Number.isFinite(ts)) {
                try { readLastIdUtils.setLastReadAt((msg as any).roomId, (msg as any).senderId, (msg as any).createdAt); } catch {}
            }
        }
        return { listMessages: mergeIntoMessages(s.listMessages, msg) };
    }),

    upsertHistory: (items) => {
        if (!Array.isArray(items) || items.length === 0) return;
        set((s) => {
            const existing = s.listMessages;
            // Prepend unique messages (older first)
            const existingIds = new Set(existing.map(m => String(m.id)));
            const newOnes = items.filter(m => !existingIds.has(String(m.id)));
            return { listMessages: [...newOnes, ...existing] };
        });
    },

    upsertMessage: (msg) => set((s) => {
        // Persist peer's read-last-at for any valid message
        if (isBrowser() && msg.roomId && msg.senderId && msg.createdAt) {
            const ts = Date.parse(String(msg.createdAt));
            if (Number.isFinite(ts)) {
                try { readLastIdUtils.setLastReadAt(msg.roomId, msg.senderId, msg.createdAt); } catch {}
            }
        }
        // Always merge incoming messages regardless of status to ensure real-time display
        // Pending/failed messages will still be updated/cleaned up via commitStatus
        return { listMessages: mergeIntoMessages(s.listMessages, msg) };
    }),

    addPending: (msg) => {
        const withPending = { ...(msg as any), clientId: (msg as any).id, isOwner: true, status: 'pending' as ChatStatus } as ChatMessage;
        get().addMessage(withPending);
    },

    removePending: (id) => set((s) => ({
        listMessages: s.listMessages.filter((m) => String(m.id) !== String(id))
    })),

    promoteToSent: (id) => get().commitStatus(id, 'sent' as ChatStatus),

    markFailed: (id) => set((s) => {
        const k = String(id);
        const idx = s.listMessages.findIndex(m => String(m.id) === k);
        if(idx === -1) return {} as any;
        const next = s.listMessages.slice();
        next[idx] = {...next[idx], status: 'failed' as ChatStatus} as ChatMessage;
        return {listMessages: next};
    }),

    upsertRetryMeta: (id, meta) =>
      set((s) => ({retryMeta: {...s.retryMeta, [id]: meta}})),

    dropRetryMeta: (id) =>
      set((s) => {
          const meta = {...s.retryMeta}
          delete meta[id]
          return {retryMeta: meta}
      }),

    getByRoom: (roomId) => {
        const norm = normRoom(String(roomId));
        const list = get().listMessages.filter(m => normRoom(String(m.roomId)) === norm && (m as any).status !== 'removed');
        list.sort((a, b) => {
            const ta = Date.parse(String(a.createdAt ?? ''));
            const tb = Date.parse(String(b.createdAt ?? ''));
            if (Number.isFinite(ta) && Number.isFinite(tb) && ta !== tb) return ta - tb;
            // fallback: compare numeric id when possible
            const ia = Number(a.id), ib = Number(b.id);
            if (Number.isFinite(ia) && Number.isFinite(ib) && ia !== ib) return ia - ib;
            return String(a.id).localeCompare(String(b.id));
        });
        return list;
    },

    getMessageById: (id) => get().listMessages.find(m => String(m.id) === String(id)),

    commitStatus: (id, status) => set((s) => {
        const k = String(id);
        // 1) try match by message id (server or temp id)
        let idx = s.listMessages.findIndex(m => String(m.id) === k);
        // 2) fallback: match by clientId (stable on sender)
        if (idx === -1) {
            idx = s.listMessages.findIndex((m: any) => m && m.clientId && String(m.clientId) === k);
        }

        let next = s.listMessages;
        const nextMeta = { ...s.retryMeta } as RetryMeta;

        if (idx !== -1) {
            const target: any = s.listMessages[idx];
            next = s.listMessages.map((m, i) => (i === idx ? ({ ...m, status } as ChatMessage) : m));

            // Clear retry meta when message is confirmed sent (both id & clientId variants)
            if (status === 'sent') {
                if (target) {
                    if (target.id != null) delete nextMeta[String(target.id)];
                    if (target.clientId != null) delete nextMeta[String(target.clientId)];
                }
                delete nextMeta[k];
            }
        } else if (status === 'sent') {
            // No matching message found, still try to clear meta under provided key
            delete nextMeta[k];
        }

        return { listMessages: next, retryMeta: nextMeta } as Partial<ChatStoreState>;
    }),

    retryMessage: (id) => set((s) => {
        const cur = s.retryMeta[id] ?? {retry: 0, next: 0};
        const retry = cur.retry + 1;
        const delay = Math.min(60000, Math.round(1500 * Math.pow(2, retry)));
        const nextTime = Date.now() + delay;
        return {
            listMessages: s.listMessages.map((m) =>
              String(m.id) === String(id) ? ({...m, status: 'retrying' as ChatStatus} as ChatMessage) : m
            ),
            retryMeta: {...s.retryMeta, [id]: {retry, next: nextTime}},
        };
    }),

    flushPending: (roomId) => {
        // Include messages marked as 'pending' or 'retrying'
        const pending = flushByStatus(get, 'pending', roomId);
        const retrying = flushByStatus(get, 'retrying', roomId);
        return [...pending, ...retrying];
    },
    flushFailed:  (roomId) => flushByStatus(get, 'failed', roomId),

    removeMessage: (id) => set((s) => {
        const nextMeta = { ...s.retryMeta };
        delete nextMeta[String(id)];
        const next = s.listMessages.map((m) =>
            String(m.id) === String(id)
                ? ({ ...m, status: 'removed' as ChatStatus } as ChatMessage)
                : m
        );
        return { listMessages: next, retryMeta: nextMeta };
    }),

    addPendingMessage: (msg) => get().addPending(msg),
    removePendingMessage: (id) => get().removePending(id),
    clearPendingMessages: () => set((s) => ({listMessages: s.listMessages.filter((m: any) => m.status !== 'pending' && m.status !== 'retrying')})),

}))