import {LocalUserId} from "./LocalUserId";
import {ChatRoomId} from "./ChatRoomId";

export type PeerRead = {
    localUserId: LocalUserId;
    roomId: ChatRoomId;
    lastReadMsgId: number;
    updatedAt?: string | null;
}