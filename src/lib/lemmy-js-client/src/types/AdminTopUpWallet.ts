import {LocalUserId} from "./LocalUserId";

/**
 * Admin top-up payload. The amount is no longer carried here — backend
 * re-reads it from the locked TopUpRequest row identified by qrId, so a
 * client-supplied amount would be ignored.
 */
export type AdminTopUpWallet = {
    targetUserId: LocalUserId;
    qrId: string;
    reason: string;
};