import type {WorkflowId} from "./WorkflowId";
import type {PostId} from "./PostId";
import type {WorkflowStatus} from "./WorkflowStatus";
import type {ChatRoomId} from "./ChatRoomId";
import type {BillingId} from "./BillingId";

// Matches backend Workflow with camelCase fields
export type Workflow = {
  id: WorkflowId;
  postId: PostId;
  seqNumber: number; // i16 backend
  status: WorkflowStatus;
  revisionRequired: boolean;
  revisionCount: number; // i16 backend
  revisionReason?: string;
  deliverableVersion: number; // i16 backend
  deliverableSubmittedAt?: string; // ISO datetime
  deliverableAccepted: boolean;
  acceptedAt?: string; // ISO datetime
  createdAt: string; // ISO datetime
  updatedAt?: string; // ISO datetime
  roomId: ChatRoomId;
  deliverableUrl?: string;
  active: boolean;
  statusBeforeCancel?: WorkflowStatus;
  billingId?: BillingId;
};
