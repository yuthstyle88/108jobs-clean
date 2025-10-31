import {create} from 'zustand';

// Import store modules at top level to avoid async imports in functions
import {useUnreadStore} from '@/modules/chat/store/unreadStore';
import {useReadLastIdStore} from "@/modules/chat/store/readStore";

// Utility functions for store interactions
const unreadStoreUtils = {
  getState: () => useUnreadStore.getState(),
  pruneByRooms: async (rooms: Room[]) => {
    try {
      const { pruneUnreadByRooms } = await import('@/modules/chat/store/unreadStore');
      if (typeof pruneUnreadByRooms === 'function') {
        pruneUnreadByRooms(rooms);
      }
    } catch {}
  },
  removeRoom: (roomId: string) => {
    const state = useUnreadStore.getState();
    if (typeof state.removeRoom === 'function') {
      state.removeRoom(roomId);
    }
  },
  resetRoom: (roomId: string) => {
    const state = useUnreadStore.getState();
    if (typeof state.reset === 'function') {
      state.reset(roomId);
    } else if (typeof state._setCount === 'function') {
      state._setCount(roomId, 0);
    }
  },
  setCount: (roomId: string, count: number) => {
    const state = useUnreadStore.getState();
    const val = Math.max(0, Number(count) || 0);
    if (typeof state._setCount === 'function') {
      state._setCount(roomId, val);
    } else if (val === 0 && typeof state.reset === 'function') {
      state.reset(roomId);
    }
  },
  incrementCount: (roomId: string, delta: number) => {
    const state = useUnreadStore.getState();
    const step = Number.isFinite(delta) ? Number(delta) : 1;
    if (typeof state._inc === 'function') {
      state._inc(roomId, step);
    } else if (typeof state._setCount === 'function') {
      const cur = Math.max(0, Number(state?.perRoom?.[roomId]) || 0);
      state._setCount(roomId, Math.max(0, cur + step));
    }
  },
  getUnreadCount: (roomId: string) => {
    const state = useUnreadStore.getState();
    const cur = state?.perRoom?.[roomId];
    return Math.max(0, Number(cur) || 0);
  }
};

const readLastIdStoreUtils = {
  getState: () => useReadLastIdStore.getState(),
  pruneByRooms: async (rooms: Room[]) => {
    try {
      const { pruneReadLastByRooms } = await import('@/modules/chat/store/readStore');
      if (typeof pruneReadLastByRooms === 'function') {
        pruneReadLastByRooms(rooms);
      }
    } catch {}
  },
  clearRoom: async (roomId: string) => {
    try {
      const mod = await import('@/modules/chat/store/readStore');
      if (typeof mod.clearRoom === 'function') await mod.clearRoom(roomId);
    } catch {}
  },
  setPeerLastAt: (roomId: string, userId: number, timestamp: string) => {
    const state = useReadLastIdStore.getState();
    if (typeof state.setPeerLastReadAt === 'function') {
      state.setPeerLastReadAt(roomId, userId, timestamp);
    }
  }
};

// Each Room represents a 1-to-1 conversation, so it has exactly one participant besides the current user.
export type Room = {
  id: string;
  name: string;
  participant: { id: number; name: string }; // exactly one participant (the other person in the room)
  // other metadata if needed
  lastMessageAt?: string;
  isActive?: boolean;
};

export type RoomsState = {
  // state
  rooms: Room[];

  // basic mutators (kept for backward compatibility)
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  removeRoom: (roomId: string) => void;
  /** Mark room as read: set unreadCount=0 and (optionally) sync readLastId to lastMessageId */
  markRoomRead: (roomId: string) => void;
  setActiveRoomId: (roomId: string | null) => void;

  // ——— Enhancements ———
  /** Upsert room by id */
  upsertRoom: (room: Room) => void;
  /** Get an immutable snapshot of all rooms */
  getRooms: () => Room[];
  /** Get a single room by id */
  getRoom: (roomId: string) => Room | undefined;
  /** Active room id (derived) */
  getActiveRoomId: () => string | null;
  /** Active room (derived) */
  getActiveRoom: () => Room | undefined;
  /** Check if a given room is active */
  isActive: (roomId: string) => boolean;
  /** Update last message metadata */
  updateLastMessage: (
    roomId: string,
    readerUserId: number,
    lastMessageAt?: string
  ) => void;
  /** Set unread count (delegates to unreadStore; roomsStore won't own the value) */
  setUnread: (roomId: string, count: number) => void;
  /** Increment unread count by delta (delegates to unreadStore) */
  incrementUnread: (roomId: string, delta?: number) => void;
  /** Read unread count from unreadStore (single source of truth) */
  getUnread: (roomId: string) => number;
  /** Find a room by participant id */
  findByParticipant: (participantId: number) => Room | undefined;
  /** Reset the store to initial (clear rooms) */
  reset: () => void;
  /** Batch upsert rooms */
  bulkUpsert: (incoming: Room[]) => void;
  /** Get total unread count */
  getTotalUnread: () => number;
};

export const useRoomsStore = create<RoomsState>((set, get) => ({
  rooms: [],

  // ——— Basic mutators (BC) ———
  setRooms: (rooms) => {
    const next = Array.isArray(rooms) ? rooms : [];
    set({ rooms: next });
    // Prune child stores to avoid stale entries
    unreadStoreUtils.pruneByRooms(next);
    readLastIdStoreUtils.pruneByRooms(next);
  },
  addRoom: (room) =>
    set((s) => ({ rooms: s.rooms.some((r) => r.id === room.id) ? s.rooms : [...s.rooms, room] })),
  removeRoom: (roomId) => {
    set((s) => ({ rooms: s.rooms.filter((r) => r.id !== roomId) }));
    unreadStoreUtils.removeRoom(roomId);
    readLastIdStoreUtils.clearRoom(roomId);
  },
  // Delegate read-marking to unreadStore (roomsStore no longer owns unread counts)
  markRoomRead: (roomId) => {
    unreadStoreUtils.resetRoom(roomId);
  },
  setActiveRoomId: (roomId) =>
    set((s) => ({
      rooms: s.rooms.map((room) =>
        roomId && room.id === roomId
          ? { ...room, isActive: true }
          : { ...room, isActive: false }
      ),
    })),

  // ——— Enhancements ———
  upsertRoom: (room) =>
    set((s) => ({
      rooms: s.rooms.some((r) => r.id === room.id)
        ? s.rooms.map((r) => (r.id === room.id ? { ...r, ...room } : r))
        : [...s.rooms, room],
    })),

  bulkUpsert: (incoming: Room[]) =>
    set((s) => {
      const byId = new Map(s.rooms.map(r => [r.id, r]));
      for (const room of incoming) {
        const prev = byId.get(room.id);
        byId.set(room.id, prev ? { ...prev, ...room } : room);
      }
      return { rooms: Array.from(byId.values()) };
    }),

  getRooms: () => get().rooms.slice(),

  getRoom: (roomId) => get().rooms.find((r) => r.id === roomId),

  getActiveRoomId: () => get().rooms.find((r) => r.isActive)?.id ?? null,

  getActiveRoom: () => get().rooms.find((r) => r.isActive),

  isActive: (roomId) => !!get().rooms.find((r) => r.id === roomId && r.isActive),

  updateLastMessage: (roomId, readerUserId, lastMessageAt) => {
    // update room metadata for display (only lastMessageAt is kept)
    set((s) => ({
      rooms: s.rooms.map((r) =>
        r.id === roomId
          ? { ...r, lastMessageAt: lastMessageAt ?? r.lastMessageAt }
          : r
      ),
    }));

    // forward who-read info to readLastIdStore
    if (readerUserId != null && lastMessageAt) {
      readLastIdStoreUtils.setPeerLastAt(roomId, readerUserId, lastMessageAt);
    }
  },

  // Delegate unread mutations to unreadStore to avoid duplication
  setUnread: (roomId, count) => {
    unreadStoreUtils.setCount(roomId, count);
  },

  incrementUnread: (roomId, delta = 1) => {
    unreadStoreUtils.incrementCount(roomId, delta);
  },

  getUnread: (roomId) => {
    return unreadStoreUtils.getUnreadCount(roomId);
  },

  findByParticipant: (participantId) =>
    get().rooms.find((r) => r.participant?.id === participantId),

  reset: () => {
    const empty: Room[] = [];
    set({ rooms: empty });
    unreadStoreUtils.pruneByRooms(empty);
    readLastIdStoreUtils.pruneByRooms(empty);
  },

  getTotalUnread: () => {
    const ids = get().rooms.map(r => r.id);
    return ids.reduce((sum, id) => sum + unreadStoreUtils.getUnreadCount(id), 0);
  },
}));

// Convenience hooks/selectors
export const useActiveRoomId = () => useRoomsStore((s) => s.getActiveRoomId());
export const useActiveRoom = () => useRoomsStore((s) => s.getActiveRoom());
export const useRooms = () => useRoomsStore((s) => s.getRooms());

export const useRoomsSortedByLastMessage = () =>
  useRoomsStore((s) =>
    [...s.getRooms()].sort((a, b) => (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? ''))
  );
