import {useEffect, useState} from "react";
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
    const [state, setState] = useState<ChatSessionState>({
        partnerName: "Unknown",
        notFound: false,
        loading: true,
    });

    const {state: chatState} = useHttpGet(
        "getChatRoom",
        [roomId!]
    );

    useEffect(() => {
        if (roomId) reset();
    }, [roomId, reset]);

    useEffect(() => {
        if (!isSuccess(chatState)) return;

        const room = chatState.data;
        if (!room) {
            setState({partnerName: "Unknown", notFound: true, loading: false});
            return;
        }

        const participants = room?.room?.participants ?? [];
        const other = participants.find(
            (p) => p.participant.memberId !== localUserId
        );

        if (!other) {
            setState({
                partnerName: "Unknown",
                currentRoom: room,
                loading: false,
                notFound: false,
            });
            return;
        }

        setState({
            currentRoom: room,
            post: room?.room?.post,
            partnerName: other.memberPerson.name ?? "Unknown",
            partnerId: other.participant.memberId,
            partnerPersonId: other.memberPerson.id,
            partnerAvatar: other.memberPerson.avatar,
            notFound: false,
            loading: false,
        });
    }, [chatState, localUserId]);

    return state;
}
