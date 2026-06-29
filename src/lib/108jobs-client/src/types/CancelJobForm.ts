import type {WorkflowId} from "./WorkflowId";
import {WorkflowStatus} from "./WorkflowStatus";

export type CancelJobForm = {
    seqNumber: number; // i16 backend
    workflowId: WorkflowId;
    reason?: string;
    currentStatus: WorkflowStatus;
};
