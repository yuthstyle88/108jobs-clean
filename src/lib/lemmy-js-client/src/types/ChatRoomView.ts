import type {ChatRoom} from "./ChatRoom";
import type {ChatParticipant} from "./ChatParticipant";
import type {Post} from "./Post";
import type {Comment} from "./Comment";

/**
 * A chat room view, including its participants.
 * Matches backend camelCase fields.
 */
export type ChatRoomView = {
  room: ChatRoom;
  // Not selectable by Diesel; assembled separately via additional query
  participants: ChatParticipant[];
  post?: Post;
  currentComment?: Comment;
};
