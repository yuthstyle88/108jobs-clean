import type {WorkflowId} from "./WorkflowId";
import {ChatRoomId} from "./ChatRoomId";
import {BillingId} from "./BillingId";

// Matches backend ApproveWorkForm with camelCase fields
export type ApproveWorkForm = {
  seqNumber: number;
  workflowId: WorkflowId;
  roomId: ChatRoomId;
  billingId: BillingId
};
