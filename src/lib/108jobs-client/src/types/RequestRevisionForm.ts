import type {WorkflowId} from "./WorkflowId";

// Matches backend RequestRevisionForm with camelCase fields
// #[serde(rename_all = "camelCase")]
// pub struct RequestRevisionForm { seq_number: i16, workflow_id: WorkflowId, reason: Option<String> }
export type RequestRevisionForm = {
  seqNumber: number; // i16 backend
  workflowId: WorkflowId;
  reason?: string;
};
