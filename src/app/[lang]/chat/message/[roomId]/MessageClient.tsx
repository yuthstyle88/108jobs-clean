"use client";

import ChatRoomView from "@/modules/chat/components/ChatRoomView";
import { UserService } from "@/services";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import { RoomNotFound } from "@/components/RoomNotFound";
import { useMyUser } from "@/hooks/api/profile/useMyUser";
import {useChatSession} from "@/modules/chat/hooks/useChatSession";
import {PhoenixChatBridgeProvider} from "@/modules/chat/providers/PhoenixChatBridgeProvider";

export default function MessageClient({ roomId }: { roomId: string }) {
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const { localUser } = useMyUser();
    const state = useChatSession(roomId, localUser?.id, isLoggedIn);

    if (state.loading || !state.currentRoom || !localUser || !state.partnerPersonId) {
        return <LoadingBlur text="" />;
    }

    if (state.notFound || !state.partnerId) {
        return <RoomNotFound />;
    }

    return (
        <PhoenixChatBridgeProvider isLoggedIn={isLoggedIn} roomId={roomId}>
            <ChatRoomView
                post={state.post}
                partnerName={state.partnerName}
                partnerAvatar={state.partnerAvatar}
                partnerId={state.partnerId}
                roomData={state.currentRoom}
                localUser={localUser}
                partnerPersonId={state.partnerPersonId}
            />
        </PhoenixChatBridgeProvider>
    );
}
