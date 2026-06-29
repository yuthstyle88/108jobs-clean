import type {WorkflowId} from "./WorkflowId";

// Matches backend SubmitStartWorkForm with camelCase fields
export type SubmitStartWorkForm = {
  seqNumber: number; // i16 backend
  workflowId: WorkflowId;
  workDescription: string;
  deliverableUrl?: string;
};
