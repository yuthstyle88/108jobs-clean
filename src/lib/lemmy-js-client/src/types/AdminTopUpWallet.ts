import {LocalUserId} from "./LocalUserId";
import {Coin} from "./Coin";

export type AdminTopUpWallet = {
    targetUserId: LocalUserId;
    qrId: string;
    amount: Coin;
    reason: string;
};