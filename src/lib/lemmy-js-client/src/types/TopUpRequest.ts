import {LocalUserId} from "./LocalUserId";
import {TopUpRequestId} from "./TopUpRequestId";
import {TopUpStatus} from "./TopUpStatus";
import {CurrencyId} from "./CurrencyId";
import {Coin} from "./Coin";

export type TopUpRequest = {
    id: TopUpRequestId;
    localUserId: LocalUserId;
    amount: number;
    currencyId: CurrencyId;
    amountCoin: Coin;
    conversionRateUsed: number;
    qrId: string;
    csExtExpiryTime: string; // ISO 8601 datetime string
    status: TopUpStatus;
    transferred: boolean;
    createdAt: string; // ISO 8601 datetime string
    updatedAt: string; // ISO 8601 datetime string
    paidAt?: string | null; // Optional ISO datetime
};
