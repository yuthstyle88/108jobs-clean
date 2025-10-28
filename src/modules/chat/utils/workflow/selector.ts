import {WORKFLOW_TRANSITIONS, WorkFlowStatus} from "@/modules/chat/types/workflow";

export const can = <E extends keyof (typeof WORKFLOW_TRANSITIONS)[WorkFlowStatus]>(ev: E) =>
  (s: WorkFlowStatus): boolean =>
    Boolean((WORKFLOW_TRANSITIONS as Record<WorkFlowStatus, any>)[s]?.[ev]);

export const nextOf = (s: WorkFlowStatus) =>
  (WORKFLOW_TRANSITIONS as Record<WorkFlowStatus, any>)[s] ?? {};