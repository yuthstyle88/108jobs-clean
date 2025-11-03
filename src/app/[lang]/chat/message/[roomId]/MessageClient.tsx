"use client";

import ChatRoomView from "@/modules/chat/components/ChatRoomView";
import {UserService} from "@/services";
import {RoomNotFound} from "@/components/RoomNotFound";
import {useMyUser} from "@/hooks/api/profile/useMyUser";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";
import {PhoenixChatBridgeProvider} from "@/modules/chat/contexts/PhoenixChatBridgeProvider";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";

export default function MessageClient({roomId}: { roomId: string }) {
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const {localUser} = useMyUser();
    const { room, partner, ready } = useRoomsStore((s) => {
      const room = s.rooms.find((rv) => String(rv.room.id) === String(roomId));
      const ready = s.activeRoomId != null || s.rooms.length > 0;
      const partner = s.findPartner(roomId, localUser?.id);
      return { room, partner, ready };
    });

    if (!ready) {
      return <LoadingBlur text="Preparing chat..." />;
    }

    if (!room || !partner) {
        return <RoomNotFound/>;
    }

    return (
        <PhoenixChatBridgeProvider isLoggedIn={isLoggedIn} roomId={roomId}>
            <ChatRoomView
                post={room.post}
                partner={partner}
                roomData={room}
                localUser={localUser!}
            />
        </PhoenixChatBridgeProvider>
    );
}
