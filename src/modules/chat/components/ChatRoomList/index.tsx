"use client";
import React from "react";
import type {ChatRoom} from "@/modules/chat/types/chat";
import type {LocalUser} from "lemmy-js-client";
import Link from "next/link";
import {useChatRoomsContext} from "@/modules/chat/contexts/ChatRoomsContext";
import AvatarBadge from "@/components/AvatarBadge";
import {usePeerOnline} from "@/modules/chat/store/presenceStore";
import { useParams } from 'next/navigation';
import { useRoomsStore } from "@/modules/chat/store/roomsStore";

interface ChatRoomListProps {
    room: ChatRoom;
    currentLang: string;
    localUser?: Pick<LocalUser, "id"> | null;
}

function ChatRoomListComponent({room, currentLang, localUser}: ChatRoomListProps) {
    const { markRoomRead, activeRoomId } = useChatRoomsContext();
    const { roomId } = (useParams?.() ?? {}) as { roomId?: string };
    const setActiveRoomId = useRoomsStore((s) => s.setActiveRoomId);
    const isActive = String(room.id) === String(activeRoomId || roomId);

    const didSetRef = React.useRef(false);

    React.useEffect(() => {
        if (didSetRef.current) return; // prevent re-run
        if (!roomId) return;
        if (typeof setActiveRoomId === 'function') {
           //set active room id from url params
            setActiveRoomId(String(roomId));
            didSetRef.current = true;
        }
    }, [roomId, setActiveRoomId]);

    // Derive peer user id (the other participant, not me)
    const peerUserId = React.useMemo(() => {
        if (!room.participants || room.participants.length === 0) return 0;
        const peer = room.participants.find((p: any) => {
            const participantId = typeof p === 'object' ? p.id : p;
            return String(participantId) !== String(localUser?.id);
        });
        return peer ? (typeof peer === 'object' ? Number(peer.id) : Number(peer)) : 0;
    }, [room.participants, localUser?.id]);

    const online = usePeerOnline(peerUserId);
    const handleClick = () => {
        try {
            // fire-and-forget after click so Link navigation is never blocked
            setTimeout(() => { try { void markRoomRead(String(room.id)); } catch {} }, 0);
        } catch {}
    };

    // Parse room name to extract partner name and job ID
    const [partnerName = "Unknown", jobId = ""] = (room.name || "?").split(":Job ");

    return (
        <Link
            prefetch={false}
            key={room.id}
            href={`/${currentLang || "th"}/chat/message/${room.id}`}
            className="block mx-2 my-1 transition-colors duration-200 focus:outline-none focus:bg-gray-100"
            aria-label={`Open chat with ${partnerName} about Job ${jobId}`}
            onClick={handleClick}
        >
            <div
                className={`flex items-center gap-3 p-3 rounded-lg border-b border-blue-950 border-l-4 ${
                    isActive ? "bg-blue-50 border-blue-500" : "bg-white hover:bg-gray-50 border-transparent"
                }`}
            >
                <AvatarBadge
                    avatarUrl={room.partnerAvatar}
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
                                {(jobId || "").length > 30 ? (jobId || "").slice(0, 30) + ".." : jobId}
                            </p>
                        )}
                    </div>
                </div>
                {/* Unread Badge: Do not show for the active room */}
                {room.unreadCount > 0 && !isActive && (
                    <span
                        className="ml-auto text-xs bg-blue-500 text-white rounded-full px-2 py-0.5 pointer-events-none"
                    >
                        {room.unreadCount}
                    </span>
                )}
            </div>
        </Link>
    );
}

ChatRoomListComponent.displayName = "ChatListItem";

const ChatRoomList = React.memo(ChatRoomListComponent);

export default ChatRoomList;