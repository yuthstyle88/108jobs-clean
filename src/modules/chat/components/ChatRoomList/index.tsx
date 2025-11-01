"use client";
import React from "react";
import type {LocalUser} from "lemmy-js-client";
import Link from "next/link";
import AvatarBadge from "@/components/AvatarBadge";
import {usePeerOnline} from "@/modules/chat/store/presenceStore";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import {RoomView} from "@/modules/chat/types";

interface ChatRoomListProps {
    room: RoomView;
    currentLang: string;
    localUser?: Pick<LocalUser, "id"> | null;
}

function ChatRoomListComponent({room, currentLang, localUser}: ChatRoomListProps) {
    const {findPartner, getUnread, markRoomRead, getActiveRoomId} = useRoomsStore();
    const activeRoomId = getActiveRoomId();
    const isActive = String(room.room.id) === String(activeRoomId || "");
    const partner = findPartner(room.room.id, localUser?.id);
    const jobId = room.post?.id;
    const unreadCount = getUnread(room.room.id);

    if (!partner) return <LoadingBlur text={""}/>;

    const partnerName = partner.memberPerson.name || "Unknown";
    const online = usePeerOnline(partner.participant.memberId);
    const handleClick = () => {
        try {
            // fire-and-forget after click so Link navigation is never blocked
            setTimeout(() => {
                try {
                    void markRoomRead(String(room.room.id));
                } catch {
                }
            }, 0);
        } catch {
        }
    };

    return (
        <Link
            prefetch={false}
            key={room.room.id}
            href={`/${currentLang || "th"}/chat/message/${room.room.id}`}
            className="block mx-2 my-1 transition-colors duration-200 focus:outline-none focus:bg-gray-100"
            aria-label={`Open chat with ${partner?.memberPerson.name} about Job ${jobId}`}
            onClick={handleClick}
        >
            <div
                className={`flex items-center gap-3 p-3 rounded-lg border-b border-blue-950 border-l-4 ${
                    isActive ? "bg-blue-50 border-blue-500" : "bg-white hover:bg-gray-50 border-transparent"
                }`}
            >
                <AvatarBadge
                    avatarUrl={partner.memberPerson.avatar}
                    name={partnerName}
                    online={online}
                    isActive
                    size={40}
                />
                {/* Room Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-0.5">
                        <h4
                            className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                            title={partnerName}
                        >
                            {partnerName}
                        </h4>
                        {jobId && (
                            <p
                                className="text-xs text-gray-500 truncate max-w-[200px]"
                                title={`Job ${jobId}`}
                            >
                                {(room.post?.name || "").length > 30 ? (room.post?.name || "").slice(0, 30) + ".." : jobId}
                            </p>
                        )}
                    </div>
                </div>
                {/* Unread Badge: Do not show for the active room */}
                {unreadCount > 0 && !isActive && (
                    <span
                        className="ml-auto text-xs bg-blue-500 text-white rounded-full px-2 py-0.5 pointer-events-none"
                    >
                        {unreadCount}
                    </span>
                )}
            </div>
        </Link>
    );
}

ChatRoomListComponent.displayName = "ChatListItem";

const ChatRoomList = React.memo(ChatRoomListComponent);

export default ChatRoomList;