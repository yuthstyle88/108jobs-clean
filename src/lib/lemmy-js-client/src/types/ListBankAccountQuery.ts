import {PaginationCursor} from "./PaginationCursor";

export type ListBankAccountQuery = {
    limit?: number;
    isVerified?: boolean;
    isDefault?: boolean;
    year?: number;
    month?: number;
    day?: number;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
};