"use client";

import {useEffect} from "react";
import ChatRoomView from "@/modules/chat/components/ChatRoomView";
import {UserService} from "@/services";
import {RoomNotFound} from "@/components/RoomNotFound";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";
import {PhoenixChatBridgeProvider} from "@/modules/chat/contexts/PhoenixChatBridgeProvider";
import {useUserStore} from "@/store/useUserStore";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import {RoomView} from "@/modules/chat/types";

export default function MessageClient({roomId: rawRoomId}: { roomId: string }) {
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const {user} = useUserStore();
    const rooms = useRoomsStore(s => s.rooms);
    const findPartner = useRoomsStore(s => s.findPartner);
    const upsertRoom = useRoomsStore(s => s.upsertRoom);

    // Next.js does not decode dynamic route segments, and room ids contain
    // colons (e.g. "dm:4233:4238"), which the browser percent-encodes on
    // navigation (both a <Link> click and a hard refresh/direct URL). Every
    // room id elsewhere (the rooms store, API responses) is the decoded
    // form, so comparing against the raw param here always failed to match.
    const roomId = decodeURIComponent(rawRoomId);
    const room = rooms.find(r => r.room.id === roomId);

    // Zustand's rooms store resets on hard refresh / direct navigation, so when
    // the room isn't already in the store, fetch it directly instead of
    // assuming it doesn't exist.
    const {data, isLoading} = useHttpGet("getChatRoom", [roomId]);

    useEffect(() => {
        if (data?.room) {
            upsertRoom({...data.room, isActive: false} as RoomView, false);
        }
    }, [data, upsertRoom]);

    if (!room) {
        if (isLoading) {
            return <LoadingBlur text=""/>;
        }
        return <RoomNotFound/>;
    }

    const partner = findPartner(roomId, user?.id);
    if (!partner) {
        return <RoomNotFound/>;
    }

    return (
        <PhoenixChatBridgeProvider isLoggedIn={isLoggedIn} roomId={roomId}>
            <ChatRoomView
                post={room.post}
                partner={partner}
                roomId={roomId}
                localUser={user!}
            />
        </PhoenixChatBridgeProvider>
    );
}
