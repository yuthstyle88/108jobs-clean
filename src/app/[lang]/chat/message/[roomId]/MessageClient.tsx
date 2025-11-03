"use client";

import ChatRoomView from "@/modules/chat/components/ChatRoomView";
import {UserService} from "@/services";
import {RoomNotFound} from "@/components/RoomNotFound";
import {useMyUser} from "@/hooks/api/profile/useMyUser";
import {useRoomsStore} from "@/modules/chat/store/roomsStore";
import {PhoenixChatBridgeProvider} from "@/modules/chat/contexts/PhoenixChatBridgeProvider";

export default function MessageClient({roomId}: { roomId: string }) {
  const isLoggedIn = UserService.Instance.isLoggedIn;
  const {localUser} = useMyUser();
  const getRoom = useRoomsStore(s => s.getRoom);
  const findPartner = useRoomsStore(s => s.findPartner);

  const room = getRoom(roomId);
  const partner = findPartner(roomId, localUser?.id);
  if(!room || !partner) {
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
