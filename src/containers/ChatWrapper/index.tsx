"use client";

import {useLanguage} from "@/contexts/LanguageContext";
import React, {useMemo, useState, useEffect, useRef} from "react";
import {debounce} from "lodash";
import {useTranslation} from "react-i18next";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";
import ChatRoomItem from "@/modules/chat/components/ChatRoomItem";
import {useUserStore} from "@/store/useUserStore";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import {REQUEST_STATE} from "@/services/HttpService";
import {RoomView} from "@/modules/chat/types";

const ChatWrapper: React.FC = () => {
    const {t} = useTranslation();
    const rooms = useRoomsStore((s) => s.rooms);
    const nextPage = useRoomsStore((s) => s.nextPage);
    const appendRooms = useRoomsStore((s) => s.appendRooms);
    const setPagination = useRoomsStore((s) => s.setPagination);
    const {lang: currentLang} = useLanguage();
    const {user: localUser} = useUserStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Debounce search input to prevent excessive re-renders
    const debouncedSetSearchQuery = useMemo(
        () => debounce((value: string) => setSearchQuery(value), 300),
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

        const validRooms = rooms.filter((r: any) => r?.room?.id);

        const q = searchQuery.trim().toLowerCase();
        if (!q) return validRooms;

        return validRooms.filter((r: any) => {
            const postName = (r.post?.name ?? "").toLowerCase();

            const participantNames = (r.participants ?? [])
                .map((p: any): string => (p?.memberPerson?.name?.toLowerCase() ?? ""))
                .filter((name: string): boolean => !!name);

            return (
                postName.includes(q) ||
                participantNames.some((n: string) => n.includes(q))
            );
        });
    }, [rooms, searchQuery]);


    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetSearchQuery(e.target.value);
    };

    const {data: moreRoomsRes, state: moreRoomsState, execute: fetchMore} = useHttpGet("listChatRooms", [{
        pageCursor: nextPage || undefined,
        limit: 20
    }], {
        revalidateOnMount: false,
        revalidateOnFocus: false,
    });

    const handleLoadMore = async () => {
        if (isFetchingMore || !nextPage) return;
        setIsFetchingMore(true);
        fetchMore();
    };

    const lastProcessedCursorRef = useRef<string | null>(null);

    useEffect(() => {
        if (moreRoomsState.state === REQUEST_STATE.SUCCESS && moreRoomsRes) {
            const currentCursor = nextPage || "initial";
            if (lastProcessedCursorRef.current === currentCursor) return;
            lastProcessedCursorRef.current = currentCursor;

            const mappedRooms = (moreRoomsRes.rooms || []).map(r => ({...r, isActive: false}));
            appendRooms(mappedRooms as RoomView[]);
            setPagination(moreRoomsRes.nextPage || null);
            setIsFetchingMore(false);
        } else if (moreRoomsState.state === REQUEST_STATE.FAILED) {
            setIsFetchingMore(false);
        }
    }, [moreRoomsRes, moreRoomsState.state, appendRooms, setPagination, nextPage]);

    // Automatic load more on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextPage && !isFetchingMore) {
                    handleLoadMore();
                }
            },
            {threshold: 0.1}
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [nextPage, isFetchingMore]);

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
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full mt-2 sm:mt-3 p-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white"
                        aria-label="Search chat rooms"
                    />
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredRooms.map((room) => (
                        <ChatRoomItem
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