import {LocalUserId} from "./LocalUserId";
import {WalletTopupId} from "./WalletTopupId";
import {TopupStatus} from "./TopupStatus";

export type WalletTopup = {
    id: WalletTopupId;
    localUserId: LocalUserId;
    amount: number;
    currencyName: string;
    qrId: string;
    csExtExpiryTime: string; // ISO 8601 datetime string
    status: TopupStatus;
    transferred: boolean;
    createdAt: string; // ISO 8601 datetime string
    updatedAt: string; // ISO 8601 datetime string
    paidAt?: string | null; // Optional ISO datetime
};
