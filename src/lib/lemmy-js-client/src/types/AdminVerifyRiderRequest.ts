import {RiderId} from "./RiderId";

export type AdminVerifyRiderRequest = {
    riderId: RiderId;
    /** approve = true will mark rider as verified; false will reject */
    approve: boolean;
    /** Optional reason when rejecting */
    reason?: string | null;
};
