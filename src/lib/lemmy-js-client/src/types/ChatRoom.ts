import {ChatRoomId} from "./ChatRoomId";
import type {PostId} from "./PostId";

export type ChatRoom = {
    id: ChatRoomId;
    roomName: string;
    createdAt: string;
    updatedAt?: string;
    postId?: PostId;
}