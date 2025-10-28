"use client";

import {useLanguage} from "@/contexts/LanguageContext";
import {useParams} from "next/navigation";
import React, {useCallback, useMemo, useState, useEffect} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {useChatRoomsContext} from "@/modules/chat/contexts/ChatRoomsContext";
import type {ChatRoom} from "@/modules/chat/types/chat";
import {debounce} from "lodash";
import ChatListItem from "@/modules/chat/components/ChatRoomList";
import {useTranslation} from "react-i18next";

const ChatWrapper = ({
                         isSidebarOpen,
                         onToggleSidebar,
                         setIsSidebarOpen,
                     }:
                     {
                         isSidebarOpen: boolean;
                         onToggleSidebar: () => void;
                         setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
                     }) => {
    const {t} = useTranslation();
    const params = useParams();
    const activeRoomId = params?.roomId as string | undefined;
    const {lang: currentLang} = useLanguage();
    const {localUser} = useMyUser();
    const chatCtx = useChatRoomsContext();
    const {rooms, isLoading, error} = chatCtx || {} as any;
    const [searchQuery, setSearchQuery] = useState("");

    // Refs to prevent repeated connect/join on re-renders
    const connectedRef = React.useRef(false);
    const lastJoinedRoomRef = React.useRef<string | undefined>(undefined);

    // Debounce search input to prevent excessive re-renders
    const debouncedSetSearchQuery = useCallback(
        debounce((value: string) => setSearchQuery(value), 300),
        []
    );
    useEffect(() => {
        return () => {
            debouncedSetSearchQuery.cancel();
        };
    }, [debouncedSetSearchQuery]);

    // Auto-connect once; join when roomId changes
    useEffect(() => {
        if (!chatCtx) return;
        try {
            if (!connectedRef.current) {
                (chatCtx as any)?.connect?.();
                connectedRef.current = true;
            }

            if (!activeRoomId) return;
            const roomKey = activeRoomId;

            // Skip if we already joined this room (prevents duplicate joins on re-render)
            if (lastJoinedRoomRef.current !== roomKey) {
                const ensured = (chatCtx as any)?.ensureJoined?.(roomKey);
                if (!ensured) {
                    const joinFn = (chatCtx as any)?.joinRoom ?? (chatCtx as any)?.openRoom;
                    joinFn?.(roomKey);
                }
                lastJoinedRoomRef.current = roomKey;
            }

            (chatCtx as any)?.setActiveRoomId?.(roomKey);
        } catch (e) {
            console.warn('[ChatWrapper] auto-join failed', e);
        }

        if (isSidebarOpen) setIsSidebarOpen(false);

    }, [activeRoomId, chatCtx, isSidebarOpen, setIsSidebarOpen]);

    // Reset connection state when auth user changes (logout/login)
    useEffect(() => {
        if (!chatCtx) return;
        // reset guards so next login will connect/join fresh
        connectedRef.current = false;
        lastJoinedRoomRef.current = undefined;
        // on logout explicitly disconnect
        if (!localUser) {
            try { (chatCtx as any)?.disconnect?.(); } catch {}
        }
    }, [localUser?.id, chatCtx]);


    // Memoized filtered rooms to optimize search performance
    const filteredRooms = useMemo(() => {
        const list = rooms || [];
        const q = searchQuery.trim().toLowerCase();
        return q
            ? list.filter(
                (r) =>
                    (r.name ?? '').toLowerCase().includes(q)
            )
            : list;
    }, [rooms, searchQuery]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetSearchQuery(e.target.value);
    };


    return (
        <>
            {/* Sidebar */}
            <div className="flex flex-col bg-white border-r border-gray-200 h-full w-full md:w-64 lg:w-80 xl:w-96 md:max-w-none md:flex-[0_0_20%] lg:flex-[0_0_25%] overflow-y-auto">
                {/* Header with Search */}
                <div className="p-3 sm:p-4 border-b text-primary border-gray-200 bg-gray-50">
                    <input
                        type="text"
                        placeholder={t("profileChat.searchChat")}
                        defaultValue={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full mt-2 sm:mt-3 p-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white"
                        aria-label="Search chat rooms"
                    />
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading && filteredRooms.length === 0 && (
                        <div className="p-3 sm:p-4 space-y-3" aria-live="polite" aria-busy="true">
                            {Array.from({length: 6}).map((_, i) => (
                                <div key={i} className="mx-2 p-3 flex items-center gap-3 animate-pulse">
                                    <div className="w-9 h-9 rounded-full bg-gray-200"/>
                                    <div className="flex-1">
                                        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"/>
                                        <div className="h-3 bg-gray-100 rounded w-1/3"/>
                                    </div>
                                    <div className="w-8 h-5 bg-gray-200 rounded-full"/>
                                </div>
                            ))}
                        </div>
                    )}
                    {filteredRooms.map((room: ChatRoom) => (
                        <ChatListItem
                            key={room.id}
                            room={room}
                            currentLang={currentLang || "th"}
                            localUser={localUser}
                        />
                    ))}
                    {filteredRooms.length === 0 && !isLoading && !error && (
                        <div className="p-6 text-center text-gray-500">
                            <div
                                className="mx-auto mb-3 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                                </svg>
                            </div>
                            <p className="text-sm">No chats found</p>
                            <p className="text-xs mt-1">Start a conversation to see it here.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default React.memo(ChatWrapper);