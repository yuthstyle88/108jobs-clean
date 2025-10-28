import type {BillingId} from "./BillingId";
import type {BillingStatus} from "./BillingStatus";

// Response for billing operations like approve quotation
export type BillingOperationResponse = {
  billingId: BillingId;
  status: BillingStatus;
  success: boolean;
};
