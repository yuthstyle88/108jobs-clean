import {useEffect} from "react";
import {HttpService, REQUEST_STATE} from "@/services/HttpService";
import {ChatRoomId, LocalUserId} from "lemmy-js-client";
import {useReadLastIdStore} from "@/modules/chat/store/readStore";

export function useLoadLastRead(roomId: ChatRoomId, peerId: LocalUserId) {
    useEffect(() => {
        if (!roomId || !peerId) return;

        let active = true;

        HttpService.client.getLastRead({roomId, peerId}).then((res) => {
            if (!active || !res || res.state !== REQUEST_STATE.SUCCESS || !res.data?.lastRead) return;
            const lastRead = res.data.lastRead ?? new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
            const {setPeerLastReadAt} = useReadLastIdStore.getState();
            setPeerLastReadAt(roomId, lastRead.localUserId, lastRead.updatedAt);
        });

        return () => {
            active = false;
        };
    }, [roomId, peerId]);
}
