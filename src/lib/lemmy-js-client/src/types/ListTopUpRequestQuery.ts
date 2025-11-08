import {TopUpStatus} from "./TopUpStatus";
import {PaginationCursor} from "./PaginationCursor";

export type ListTopUpRequestQuery = {
    amountMin?: number;
    amountMax?: number;
    /** Optional filter by status (Pending, Success) */
    status?: TopUpStatus;
    /** Optional filter by year of createdAt */
    year?: number;
    /** Optional filter by month of createdAt */
    month?: number;
    /** Optional filter by day of createdAt */
    day?: number;
    /** Pagination cursor for forward/backward navigation */
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    /** Limit results (default 20) */
    limit?: number;
};