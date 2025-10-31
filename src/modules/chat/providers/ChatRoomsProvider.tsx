"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { ChatRoom as AppChatRoom } from "@/modules/chat/types/chat";
import { useHttpGet } from "@/hooks/api/http/useHttpGet";
import { useUnreadStore } from "@/modules/chat/store/unreadStore";
import { useActiveRoomId, useRoomsStore } from "@/modules/chat/store/roomsStore";
import { ChatRoomsContext, ChatRoomsContextValue } from "@/modules/chat/contexts/ChatRoomsContext";

export const ChatRoomsProvider: React.FC<{ children: React.ReactNode; pageSize?: number }> = ({
  children,
  pageSize = 40,
}) => {
  // pagination state (client-only)
  const [page, setPage] = useState(1);

  // single source of truth for rooms list & active room
  const setRoomsStore = useRoomsStore((s) => s.setRooms);
  const storeRooms = useRoomsStore((s) => s.rooms as any as AppChatRoom[] | undefined);
  const storeActiveId = useActiveRoomId();
  const setActive = useRoomsStore((s) => s.setActiveRoomId);

  // fetch minimal rooms list (without heavy profile lookups)
  const { data, error, isLoading, execute } = useHttpGet("listChatRooms", { limit: page * pageSize });

  // map API payload → AppChatRoom (lightweight, no extra HTTP calls here)
  const mappedRooms: AppChatRoom[] = useMemo(() => {
    const items: any[] = (data as any)?.rooms ?? [];
    return items
      .map((it: any) => {
        const view = it?.room?.room ? it.room : it; // normalize shape
        const id = String(view?.room?.id ?? view?.id ?? it?.roomId ?? it?.id);
        const name = String(view?.room?.roomName ?? view?.roomName ?? it?.roomName ?? "Room");
        const participants = (view?.participants ?? it?.participants ?? [])
          .map((p: any) => String(p?.memberId ?? p?.id))
          .filter(Boolean);
        const unreadCount = Number(it?.unreadCount ?? 0);
        const partnerAvatar = String(it?.partnerAvatar ?? view?.partnerAvatar ?? "");
        const postId = view?.room?.postId ?? view?.post?.id ?? it?.postId;
        return {
          id,
          name,
          participants,
          unreadCount,
          partnerAvatar,
          postId,
        } as any as AppChatRoom;
      })
      .filter(Boolean);
  }, [data]);

  // hasMore: ปลอดภัยด้วย heuristic (หรือใช้ nextPage ถ้ามี)
  const hasMore = useMemo(() => {
    const items = (data as any)?.rooms ?? [];
    const apiNext = (data as any)?.nextPage;
    if (typeof apiNext !== "undefined") return Boolean(apiNext);
    return items.length >= page * pageSize;
  }, [data, page, pageSize]);

  // sync rooms to global store (thin list, no reordering side-effects)
  useEffect(() => {
    try {
      if (Array.isArray(mappedRooms)) {
        setRoomsStore(
          mappedRooms.map((r) => ({
            id: String(r.id),
            name: r.name,
            participant: { id: 0, name: "Unknown" },
          })),
        );
      }
    } catch {}
  }, [mappedRooms, setRoomsStore]);

  // local state snapshot to provide via context
  const ctxValue: ChatRoomsContextValue = useMemo(
    () => ({
      rooms: storeRooms ?? mappedRooms,
      isLoading,
      error: error ?? null,
      page,
      pageSize,
      hasMore,
      refresh: () => {
        void execute();
      },
      loadMore: () => {
        if (hasMore && !isLoading) setPage((p) => p + 1);
      },
      markRoomRead: async (roomId: string) => {
        try {
          useUnreadStore.getState().markSeen(roomId);
        } catch {}
      },
      bumpRoomToTop: (roomId: string) => {
        const rooms = storeRooms ?? mappedRooms;
        if (!rooms?.length) return;
        const idx = rooms.findIndex((r) => String(r.id) === String(roomId));
        if (idx < 0) return;

        const next = [rooms[idx], ...rooms.filter((_, i) => i !== idx)];
        try {
          setRoomsStore(
            next.map((r) => ({
              id: String(r.id),
              name: r.name,
              participant: { id: 0, name: "Unknown" },
            })),
          );
        } catch {}
      },
      activeRoomId: storeActiveId,
      setActiveRoomId: (roomId: string | null) => {
        setActive(roomId);
        if (roomId) {
          try {
            const store = useUnreadStore.getState();
            if (store && typeof store.markSeen === 'function') {
              store.markSeen(roomId);
            } else {
              console.warn('[ChatRoomsProvider] unread store unavailable or markSeen missing');
            }
          } catch (err) {
            console.error('[ChatRoomsProvider] failed to mark room as read', err);
          }
        }
      },
    }),
    [
      storeRooms,
      mappedRooms,
      isLoading,
      error,
      page,
      pageSize,
      hasMore,
      execute,
      storeActiveId,
      setActive,
      setRoomsStore,
    ],
  );

  return <ChatRoomsContext.Provider value={ctxValue}>{children}</ChatRoomsContext.Provider>;
};