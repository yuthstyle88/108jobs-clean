"use client";

import ChatRoomView from "@/modules/chat/components/ChatRoomView";
import {UserService} from "@/services";
import {RoomNotFound} from "@/components/RoomNotFound";
import {useMyUser} from "@/hooks/api/profile/useMyUser";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";
import {PhoenixChatBridgeProvider} from "@/modules/chat/contexts/PhoenixChatBridgeProvider";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import { useMemo } from "react";

export default function MessageClient({roomId}: { roomId: string }) {
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const {localUser} = useMyUser();

    const room = useRoomsStore((s) =>
      s.rooms.find((rv) => String(rv.room.id) === String(roomId))
    );
    // Use explicit hydration flag to avoid false positives while data is loading
    const ready = useRoomsStore((s) => s.isHydrated);

    const findPartnerFn = useRoomsStore((s) => s.findPartner);
    const partner = useMemo(
      () => findPartnerFn(roomId, localUser?.id),
      [findPartnerFn, roomId, localUser?.id]
    );

    if (!ready || !localUser) {
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
