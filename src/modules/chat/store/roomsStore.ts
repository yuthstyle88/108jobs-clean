import {create} from 'zustand';

import {useUnreadStore} from '@/modules/chat/store/unreadStore';
import {useReadLastIdStore} from "@/modules/chat/store/readStore";
import {ChatParticipantView, LocalUserId} from "lemmy-js-client";
import {RoomView} from "@/modules/chat/types";

// Utility functions for store interactions
const unreadStoreUtils = {
    getState: () => useUnreadStore.getState(),
    pruneByRooms: async (rooms: RoomView[]) => {
        try {
            const {pruneUnreadByRooms} = await import('@/modules/chat/store/unreadStore');
            if (typeof pruneUnreadByRooms === 'function') {
                pruneUnreadByRooms(rooms);
            }
        } catch {
        }
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
    pruneByRooms: async (rooms: RoomView[]) => {
        try {
            const {pruneReadLastByRooms} = await import('@/modules/chat/store/readStore');
            if (typeof pruneReadLastByRooms === 'function') {
                pruneReadLastByRooms(rooms);
            }
        } catch {
        }
    },
    clearRoom: (roomId: string) => {
        try {
            const {clearRoom} = require('@/modules/chat/store/readStore');
            if (typeof clearRoom === 'function') {
                clearRoom(roomId);
            }
        } catch {
        }
    },
    setPeerLastAt: (roomId: string, userId: number, timestamp: string) => {
        const state = useReadLastIdStore.getState();
        if (typeof state.setPeerLastReadAt === 'function') {
            state.setPeerLastReadAt(roomId, userId, timestamp);
        }
    }
};


export type RoomsState = {
    // state
    rooms: RoomView[];

    // basic mutators (kept for backward compatibility)
    setRooms: (rooms: RoomView[]) => void;
    addRoom: (room: RoomView) => void;
    removeRoom: (roomId: string) => void;
    /** Mark room as read: set unreadCount=0 and (optionally) sync readLastId to lastMessageId */
    markRoomRead: (roomId: string) => void;
    setActiveRoomId: (roomId: string | null) => void;
    /** Move a room to the top of the list (e.g., new message or focus) */
    bumpRoomToTop: (roomId: string) => void;
    /** Upsert room by id */
    upsertRoom: (room: RoomView) => void;
    /** Get an immutable snapshot of all rooms */
    getRooms: () => RoomView[];
    /** Get a single room by id */
    getRoom: (roomId: string) => RoomView | undefined;
    /** Filter by room name (case-insensitive, partial match) */
    getRoomsByFilter: (query: string) => RoomView[];
    /** Active room id (derived) */
    getActiveRoomId: () => string | null;
    /** Active room (derived) */
    getActiveRoom: () => RoomView | undefined;
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
    findByParticipant: (participantId: number) => RoomView | undefined;
    findPartner: (roomId: string, currentUserId?: LocalUserId) => ChatParticipantView | undefined;
    /** Reset the store to initial (clear rooms) */
    reset: () => void;
};

export const useRoomsStore = create<RoomsState>((set, get) => ({
    rooms: [],

    // ——— Basic mutators (BC) ———
    setRooms: (rooms) => {
        const next = Array.isArray(rooms) ? rooms : [];
        set({rooms: next});
        // Prune child stores to avoid stale entries
        unreadStoreUtils.pruneByRooms(next);
        readLastIdStoreUtils.pruneByRooms(next);
    },
    addRoom: (room) =>
        set((s) => ({rooms: s.rooms.some((r) => r.room.id === room.room.id) ? s.rooms : [...s.rooms, room]})),
    removeRoom: (roomId) => {
        set((s) => ({rooms: s.rooms.filter((r) => r.room.id !== roomId)}));
        unreadStoreUtils.removeRoom(roomId);
        readLastIdStoreUtils.clearRoom(roomId);
    },
    // Delegate read-marking to unreadStore (roomsStore no longer owns unread counts)
    markRoomRead: (roomId) => {
        unreadStoreUtils.resetRoom(roomId);
    },
    setActiveRoomId: (roomId) =>
        set((s) => ({
            rooms: s.rooms.map((roomView) =>
                roomId && roomView.room.id === roomId
                    ? {...roomView, isActive: true}
                    : {...roomView, isActive: false}
            ),
        })),
    bumpRoomToTop: (roomId: string) => {
        set((s) => {
            const idx = s.rooms.findIndex((r) => r.room.id === roomId);
            if (idx === -1) return s; // room not found, no change
            const bumped = s.rooms[idx];
            const rest = s.rooms.filter((_, i) => i !== idx);
            return {rooms: [bumped, ...rest]};
        });
    },

    upsertRoom: (room) =>
        set((s) => ({
            rooms: s.rooms.some((r) => r.room.id === room.room.id)
                ? s.rooms.map((r) => (r.room.id === room.room.id ? {...r, ...room} : r))
                : [...s.rooms, room],
        })),

    getRooms: () => get().rooms.slice(),

    getRoom: (roomId) => get().rooms.find((r) => r.room.id === roomId),

    getRoomsByFilter: (query: string) => {
        const q = (query ?? '').trim().toLowerCase();
        if (!q) return get().rooms.slice();
        return get().rooms.filter((r) => r.room.roomName?.toLowerCase().includes(q));
    },

    getActiveRoomId: () => get().rooms.find((r) => r.isActive)?.room.id ?? null,

    getActiveRoom: () => get().rooms.find((r) => r.isActive),

    isActive: (roomId) => !!get().rooms.find((r) => r.room.id === roomId && r.isActive),

    updateLastMessage: (roomId, readerUserId, lastMessageAt) => {
        // update room metadata for display (only lastMessageAt is kept)
        set((s) => ({
            rooms: s.rooms.map((r) =>
                r.room.id === roomId
                    ? {...r, lastMessageAt: lastMessageAt ?? r.lastMessage?.createdAt}
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
        get().rooms.find((r) =>
            r.participants?.some((p) => p.participant?.memberId === participantId)
        ),

    findPartner: (roomId: string, currentUserId?: LocalUserId) => {
        const room = get().rooms.find(r => r.room.id === roomId);
        if (!room) return undefined;
        return room.participants.find(p => p.participant.memberId !== currentUserId);
    },

    reset: () => set({rooms: []}),
}));

// Convenience hooks/selectors
export const useActiveRoomId = () => useRoomsStore((s) => s.getActiveRoomId());
export const useActiveRoom = () => useRoomsStore((s) => s.getActiveRoom());
export const useRooms = () => useRoomsStore((s) => s.getRooms());
