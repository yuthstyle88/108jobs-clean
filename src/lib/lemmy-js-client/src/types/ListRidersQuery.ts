import {PaginationCursor} from "./PaginationCursor";

export type ListRidersQuery = {
    pageCursor?: PaginationCursor | null;
    pageBack?: boolean | null;
    limit?: number | null;
    verified?: boolean | null;
};
