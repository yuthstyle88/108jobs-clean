import type {BillingId} from "./BillingId";
import type {LocalUserId} from "./LocalUserId";
import type {PostId} from "./PostId";
import type {BillingStatus} from "./BillingStatus";

export type CreateInvoiceResponse = {
  billingId: BillingId;
  issuerId: LocalUserId;
  recipientId: LocalUserId;
  postId: PostId;
  amount: number; // align with UI numeric amount
  status: BillingStatus;
  deliveryTimeframeDays: number;
  createdAt: string;
  success: boolean;
};
