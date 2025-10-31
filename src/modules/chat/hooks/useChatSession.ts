import {useEffect, useMemo} from "react";
import {isSuccess} from "@/services/HttpService";
import {useStateMachineStore} from "@/modules/chat/store/stateMachineStore";
import {ChatRoomData, LocalUserId, PersonId, Post} from "@/lib/lemmy-js-client";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";

export interface ChatSessionState {
    partnerName: string;
    partnerId?: LocalUserId;
    partnerAvatar?: string;
    partnerPersonId?: PersonId;
    currentRoom?: ChatRoomData;
    post?: Post;
    notFound: boolean;
    loading: boolean;
}

export function useChatSession(roomId?: string, localUserId?: number, isLoggedIn?: boolean) {
    const reset = useStateMachineStore((s) => s.reset);

    const {state: chatState} = useHttpGet(
        "getChatRoom",
        [roomId!]
    );

    // Reset external state when switching rooms
    useEffect(() => {
        if (roomId) reset();
    }, [roomId, reset]);

    const derived = useMemo<ChatSessionState>(() => {
        // While fetching or not successful yet → loading
        if (!isSuccess(chatState)) {
            return { partnerName: "Unknown", notFound: false, loading: true };
        }

        const room = chatState.data;
        if (!room) {
            return { partnerName: "Unknown", notFound: true, loading: false };
        }

        const participants = Array.isArray(room?.room?.participants)
          ? (room.room.participants.filter(Boolean) as any[])
          : [];

        // Prefer a participant that is not the current user; otherwise pick the first valid participant
        const other =
          participants.find(p =>
            p?.participant?.memberId != null &&
            (localUserId == null || p.participant.memberId !== localUserId)
          ) ??
          participants.find(p => p?.participant?.memberId != null) ??
          null;

        if (!other) {
            return {
                partnerName: "Unknown",
                currentRoom: room,
                loading: false,
                notFound: false,
            };
        }

        return {
            currentRoom: room,
            post: room?.room?.post,
            partnerName: other.memberPerson.name ?? "Unknown",
            partnerId: other.participant.memberId,
            partnerPersonId: other.memberPerson.id,
            partnerAvatar: other.memberPerson.avatar,
            notFound: false,
            loading: false,
        };
    }, [chatState, localUserId]);

    return derived;
}
