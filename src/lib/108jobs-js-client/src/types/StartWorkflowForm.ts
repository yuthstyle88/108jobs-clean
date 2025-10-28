import type {ChatRoomId} from "./ChatRoomId";

// Matches backend StartWorkflow with camelCase fields
export type StartWorkflowForm = {
  // Allow number | string to match caller usage and backend flexibility
  postId: number | string;
  seqNumber: number; // i16 backend
  roomId: ChatRoomId;
};
