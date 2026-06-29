import type {WorkflowId} from "./WorkflowId";
import type {WorkflowStatus} from "./WorkflowStatus";

// Matches backend WorkFlowOperationResponse with camelCase fields
export type WorkFlowOperationResponse = {
  workflowId: WorkflowId;
  status: WorkflowStatus;
  success: boolean;
};
