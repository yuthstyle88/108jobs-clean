import {WorkFlowAction} from "@/modules/chat/types/workflow";

/**
 * Filter workflow actions based on user role (employer or freelancer).
 * The function returns only the actions permitted for the current role.
 */
export function filterByRole(
  actions: WorkFlowAction[],
  isEmployer: boolean,
  isFreelancer: boolean
): WorkFlowAction[] {
  // Define allowed actions per role
  const employerActions: WorkFlowAction[] = [
    "approveOrder",
    "requestRevision",
    "releasePayment",
    "cancel",
    "restart",
  ];

  const freelancerActions: WorkFlowAction[] = [
    "submitQuotation",
    "startWork",
    "submitDelivery",
    "cancel",
    "restart",
  ];

  // Filter the actions by matching with the user's role
  return actions.filter((a) => {
    if (isEmployer && employerActions.includes(a)) return true;
    if (isFreelancer && freelancerActions.includes(a)) return true;
    return false;
  });
}