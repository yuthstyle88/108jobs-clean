import type {ChatRoom} from "./ChatRoom";
import type {Post} from "./Post";
import type {Comment} from "./Comment";
import type {ChatParticipantView} from "./ChatParticipantView";
import {ChatMessage} from "./ChatMessage";
import {Workflow} from "./Workflow";

/**
 * A chat room view, including its participants.
 * Matches backend camelCase fields.
 */
export type ChatRoomView = {
    room: ChatRoom;
    // Not selectable by Diesel; assembled separately via additional query
    participants: ChatParticipantView[];
    post?: Post;
    currentComment?: Comment;
    lastMessage?: ChatMessage;
    workflow?: Workflow;
};
