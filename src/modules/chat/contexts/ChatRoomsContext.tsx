"use client";

import {createContext, useContext} from "react";

export type ChatRoomsContextValue = {
    rooms: any[];
    isLoading: boolean;
    error: unknown;
    page: number;
    pageSize: number;
    hasMore: boolean;
    refresh: () => void;
    loadMore: () => void;
    markRoomRead: (roomId: string) => Promise<void>;
    bumpRoomToTop: (roomId: string, updatedAt?: string) => void;
    activeRoomId: string | null;
    setActiveRoomId: (roomId: string | null) => void;
};

export const ChatRoomsContext = createContext<ChatRoomsContextValue | undefined>(undefined);

export const useOptionalChatRooms = (): ChatRoomsContextValue | undefined => {
    return useContext(ChatRoomsContext);
};