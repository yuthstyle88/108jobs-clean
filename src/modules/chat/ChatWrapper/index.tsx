"use client";

import {useLanguage} from "@/contexts/LanguageContext";
import React, {useCallback, useMemo, useState, useEffect} from "react";
import {useMyUser} from "@/hooks/api/profile/useMyUser";
import {debounce} from "lodash";
import ChatListItem from "@/modules/chat/components/ChatRoomList";
import {useTranslation} from "react-i18next";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";

const ChatWrapper = () => {
    const {t} = useTranslation();
    const {rooms} = useRoomsStore();
    const {lang: currentLang} = useLanguage();
    const {localUser} = useMyUser();
    const [searchQuery, setSearchQuery] = useState("");

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

    // Memoized filtered rooms to optimize search performance
    const filteredRooms = useMemo(() => {
        if (!rooms || rooms.length === 0) return [];
        // Filter out any transient undefined/null or malformed entries
        const validRooms = rooms.filter((r: any) => r && r.room && r.room.id);
        const q = searchQuery.trim().toLowerCase();
        return q
            ? validRooms.filter(
                (r: any) => (r.room.roomName ?? '').toLowerCase().includes(q)
            )
            : validRooms;
    }, [rooms, searchQuery]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetSearchQuery(e.target.value);
    };

    return (
        <>
            {/* Sidebar */}
            <div
                className="flex flex-col bg-white border-r border-gray-200 h-full w-full md:w-64 lg:w-80 xl:w-96 md:max-w-none md:flex-[0_0_20%] lg:flex-[0_0_25%] overflow-y-auto">
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
                    {filteredRooms.length === 0 && (
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
                    {filteredRooms.map((room) => (
                        <ChatListItem
                            key={room.room.id}
                            room={room}
                            currentLang={currentLang || "th"}
                            localUser={localUser}
                        />
                    ))}
                    {filteredRooms.length === 0 && (
                        <div className="p-6 text-center text-gray-500">
                            <div
                                className="mx-auto mb-3 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                                </svg>
                            </div>
                            <p className="text-sm">{t("profileChat.noChatsFound")}</p>
                            <p className="text-xs mt-1">{t("profileChat.startConversation")}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default React.memo(ChatWrapper);