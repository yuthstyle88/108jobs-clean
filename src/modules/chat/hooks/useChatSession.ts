import { useEffect, useState, useCallback } from "react";
import { HttpService } from "@/services";
import { REQUEST_STATE } from "@/services/HttpService";
import { useStateMachineStore } from "@/modules/chat/store/stateMachineStore";
import {ChatRoomData, LocalUserId, PersonId, Post} from "@/lib/lemmy-js-client";

export interface ChatSessionState {
    partnerName: string;
    partnerId?: LocalUserId;
    partnerAvatar?: string;
    partnerPersonId?: PersonId;
    currentRoom?: ChatRoomData;
    post?: Post;
    notFound: boolean;
    loading: boolean;
    partnerAvailable?: boolean;
}

export function useChatSession(roomId?: string, localUserId?: number, isLoggedIn?: boolean) {
    const reset = useStateMachineStore((s) => s.reset);
    const [state, setState] = useState<ChatSessionState>({
        partnerName: "Unknown",
        notFound: false,
        loading: true,
    });

    useEffect(() => {
        if (roomId) reset();
    }, [roomId, reset]);

    const fetchData = useCallback(async () => {
        if (!isLoggedIn || !roomId || !localUserId) {
            setState((prev) => ({ ...prev, loading: false }));
            return;
        }

        try {
            const chatRoomRes = await HttpService.client.getChatRoom(roomId);

            if (chatRoomRes.state === REQUEST_STATE.FAILED) {
                setState((prev) => ({ ...prev, notFound: true, loading: false }));
                return;
            }

            if (chatRoomRes.state !== REQUEST_STATE.SUCCESS) {
                setState((prev) => ({ ...prev, loading: false }));
                return;
            }

            const room = chatRoomRes.data;
            const isNotFound = String(room || "").toLowerCase().includes("notfound");
            if (!room || isNotFound) {
                setState({ partnerName: "Unknown", notFound: true, loading: false });
                return;
            }

            const participants = room?.room?.participants ?? [];
            const other = participants.find(
                (p) => String(p.memberId) !== String(localUserId)
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

            const profileRes = await HttpService.client.visitProfile(
                String(other.memberId)
            );

            const profileSuccess = profileRes.state === REQUEST_STATE.SUCCESS;
            const profile = profileSuccess ? profileRes.data.profile : null;

            setState({
                currentRoom: room,
                post: room?.room?.post ?? chatRoomRes.data?.room?.post,
                partnerName: profile?.name ?? "Unknown",
                partnerId: Number(other.memberId),
                partnerPersonId: profile?.id,
                partnerAvatar: profile?.avatar,
                partnerAvailable: profile?.available,
                notFound: false,
                loading: false,
            });
        } catch (error) {
            console.error("Error fetching chat session:", error);
            setState((prev) => ({ ...prev, notFound: true, loading: false }));
        }
    }, [isLoggedIn, roomId, localUserId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return state;
}
