import {ChatRoomId} from "./ChatRoomId";
import type {PostId} from "./PostId";
import {CommentId} from "./CommentId";

export type ChatRoom = {
    id: ChatRoomId;
    roomName: string;
    createdAt: string;
    updatedAt?: string;
    postId?: PostId;
    currentCommentId?: CommentId
}