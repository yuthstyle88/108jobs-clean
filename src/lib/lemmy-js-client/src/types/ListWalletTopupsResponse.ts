import {WalletTopupView} from "./WalletTopupView";
import type {PaginationCursor} from "./PaginationCursor";

export type ListWalletTopupsResponse = {
    walletTopups: WalletTopupView[];
    nextPage?: PaginationCursor;
    prevPage?: PaginationCursor;
};