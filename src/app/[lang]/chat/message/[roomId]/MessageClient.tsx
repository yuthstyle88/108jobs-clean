"use client";

import ChatRoomView from "@/modules/chat/components/ChatRoomView";
import {UserService} from "@/services";
import {RoomNotFound} from "@/components/RoomNotFound";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";
import {PhoenixChatBridgeProvider} from "@/modules/chat/contexts/PhoenixChatBridgeProvider";
import {useUserStore} from "@/store/useUserStore";

export default function MessageClient({roomId}: { roomId: string }) {
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const {user} = useUserStore();
    const getRoom = useRoomsStore(s => s.getRoom);
    const findPartner = useRoomsStore(s => s.findPartner);

    const room = getRoom(roomId);
    const partner = findPartner(roomId, user?.id);
    if (!room || !partner) {
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
