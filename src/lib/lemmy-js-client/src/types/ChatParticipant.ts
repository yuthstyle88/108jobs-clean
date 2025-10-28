import {ChatRoomId} from "./ChatRoomId";
import {LocalUserId} from "./LocalUserId";

export type ChatParticipant = {
    roomId: ChatRoomId;
    memberId: LocalUserId;
    joinedAt: string;
};