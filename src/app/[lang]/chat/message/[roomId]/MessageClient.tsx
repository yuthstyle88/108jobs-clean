"use client";

import ChatRoomView from "@/modules/chat/components/ChatRoomView";
import {UserService} from "@/services";
import {RoomNotFound} from "@/components/RoomNotFound";
import {useMyUser} from "@/hooks/api/profile/useMyUser";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";
import {PhoenixChatBridgeProvider} from "@/modules/chat/contexts/PhoenixChatBridgeProvider";
import {getIsoData} from "@/hooks/data/useIsoData";
import {RoomView} from "@/modules/chat/types";

export default function MessageClient({roomId}: { roomId: string }) {
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const {localUser} = useMyUser();
    const {getRoom, findPartner} = useRoomsStore();
    const room = getRoom(roomId);
    const roomData = room ? room : getIsoData()?.chatRooms?.rooms.find( room => room.room.id = roomId) as RoomView;
    const partner = findPartner(roomId, localUser?.id);

    if (!room || !partner) {
        return <RoomNotFound/>;
    }

    return (
        <PhoenixChatBridgeProvider isLoggedIn={isLoggedIn} roomId={roomId}>
            <ChatRoomView
                post={room.post}
                partner={partner}
                roomData={roomData}
                localUser={localUser!}
            />
        </PhoenixChatBridgeProvider>
    );
}
