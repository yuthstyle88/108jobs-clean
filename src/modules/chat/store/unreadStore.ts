import {create} from "zustand";
import {isBrowser} from "@/utils/browser";

// -----------------------------
// Minimal unread store: counts only
// -----------------------------
export type UnreadState = {
  perRoom: Record<string, number>;
  total: number;
  reset: (roomId: string) => void;        // set room's unread to 0 and update total
  clearAll: () => void;                   // clear all counters
  markSeen: (roomId: string) => void;     // alias of reset
  removeRoom: (roomId: string) => void;   // drop room entry and adjust total
  _inc: (roomId: string, by?: number) => void;              // internal increment
  _hydrate: (snapshot: Record<string, number>) => void;     // replace all counters
  _setCount: (roomId: string, count: number) => void;       // set exact count for a room
};

const STORAGE_KEY = "chat_unread_v1";

function loadPersisted(): Pick<UnreadState, "perRoom"> {
  if (!isBrowser()) return { perRoom: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { perRoom: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { perRoom: {} };
    return { perRoom: parsed.perRoom || {} };
  } catch {
    return { perRoom: {} };
  }
}

function persist(state: Pick<UnreadState, "perRoom">) {
  if (!isBrowser()) return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export const useUnreadStore = create<UnreadState>((set, get) => {
  const initial = loadPersisted();
  const totalInitial = Object.values(initial.perRoom).reduce((a, b) => a + (b || 0), 0);
  return {
    perRoom: initial.perRoom,
    total: totalInitial,

    _inc: (roomId: string, by: number = 1) => {
      set((s) => {
        const step = Number.isFinite(by) ? Math.floor(by) : 1;
        const delta = Math.max(1, step);
        const cur = Math.max(0, Number(s.perRoom[roomId]) || 0);
        const nextVal = cur + delta;
        const perRoom = { ...s.perRoom, [roomId]: nextVal };
        const total = Math.max(0, s.total + delta);
        persist({ perRoom });
        return { ...s, perRoom, total };
      });
    },

    _setCount: (roomId: string, count: number) => {
      set((s) => {
        const num = Number(count);
        const val = Number.isFinite(num) ? Math.max(0, Math.floor(num)) : 0;
        const cur = Math.max(0, Number(s.perRoom[roomId]) || 0);
        const delta = val - cur;
        const perRoom = { ...s.perRoom, [roomId]: val };
        const total = Math.max(0, s.total + delta);
        persist({ perRoom });
        return { ...s, perRoom, total };
      });
    },

    _hydrate: (snapshot: Record<string, number>) => {
      set((s) => {
        const perRoom: Record<string, number> = {};
        let total = 0;
        for (const [k, v] of Object.entries(snapshot)) {
          const num = Number(v);
          const val = Number.isFinite(num) ? Math.max(0, Math.floor(num)) : 0;
          perRoom[k] = val;
          total += val;
        }
        persist({ perRoom });
        return { ...s, perRoom, total };
      });
    },

    reset: (roomId: string) => {
      set((s) => {
        const cur = Math.max(0, Number(s.perRoom[roomId]) || 0);
        if (cur === 0) return s;
        const perRoom = { ...s.perRoom, [roomId]: 0 };
        const total = Math.max(0, s.total - cur);
        persist({ perRoom });
        return { ...s, perRoom, total };
      });
    },

    clearAll: () => {
      set(() => {
        persist({ perRoom: {} });
        return { perRoom: {}, total: 0 } as any;
      });
    },

    markSeen: (roomId: string) => {
      get().reset(roomId);
    },

    removeRoom: (roomId: string) => {
      set((s) => {
        if (!(roomId in s.perRoom)) return s;
        const cur = Math.max(0, Number(s.perRoom[roomId]) || 0);
        const perRoom = { ...s.perRoom };
        delete perRoom[roomId];
        const total = Math.max(0, s.total - cur);
        persist({ perRoom });
        return { ...s, perRoom, total };
      });
    },
  };
});

// -----------------------------
// Selectors & hooks
// -----------------------------
export const selectUnreadCount = (roomId: string) => (s: UnreadState) => s.perRoom[roomId] ?? 0;
export const selectTotalUnread = (s: UnreadState) => s.total;

export const useUnreadCount = (roomId: string) =>
  useUnreadStore((s) => s.perRoom[roomId] ?? 0);

export const useTotalUnread = () =>
  useUnreadStore((s) => s.total);

// -----------------------------
// Small helpers for services/adapters
// -----------------------------
export function markRoomSeen(roomId: string) {
  useUnreadStore.getState().markSeen(roomId);
}

export function hydrateUnread(snapshot: Record<string, number>) {
  useUnreadStore.getState()._hydrate(snapshot);
}

export function clearAllUnread() {
  useUnreadStore.getState().clearAll();
}

/**
 * Prune unread counts to only those rooms currently present.
 * Call this when the room list changes.
 */
export function pruneUnreadByRooms(rooms: Array<{ id: string | number }>) {
  const allowed = new Set<string>(Array.isArray(rooms) ? rooms.map((r: any) => String(r?.id ?? '')) : []);
  const st = useUnreadStore.getState();
  const before = st.perRoom || {};
  let changed = false;
  const perRoom: Record<string, number> = {};
  let total = 0;
  for (const [id, val] of Object.entries(before)) {
    if (allowed.has(String(id))) {
      const v = Math.max(0, Number(val) || 0);
      perRoom[id] = v;
      total += v;
    } else {
      changed = true;
    }
  }
  if (!changed) return;
  useUnreadStore.setState((s) => ({ ...s, perRoom, total }));
  try { persist({ perRoom }); } catch {}
}
