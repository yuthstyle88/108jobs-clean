import type {LocalUserId} from "./LocalUserId";
import type {PostId} from "./PostId";
import type {CommentId} from "./CommentId";
import type {BillingStatus} from "./BillingStatus";
import {ChatRoomId} from "./ChatRoomId";
import {WorkflowId} from "./WorkflowId";

// Matches backend form with camelCase via serde(rename_all = "camelCase")
export type CreateInvoiceForm = {
    employerId: LocalUserId;
    postId: PostId;
    commentId: CommentId;
    seqNumber: number; // i16 in backend
    amount: number; // using number for simplicity; backend may accept numeric
    proposal: string;
    projectName: string;
    status: BillingStatus;
    projectDetails?: string; // has serde(default) in backend
    workingDays: number;
    deliverables?: string[]; // has serde(default) in backend
    note?: string | null;
    startingDay: string; // ISO date string (YYYY-MM-DD)
    deliveryDay: string; // ISO date string (YYYY-MM-DD)
    roomId: ChatRoomId;
    workFlowId: WorkflowId
};
