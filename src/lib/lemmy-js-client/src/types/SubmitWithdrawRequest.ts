import {WalletId} from "./WalletId";
import {BankAccountId} from "./BankAccountId";
import {Coin} from "./Coin";

/**
 * Client submits a withdrawal request.
 */
export type SubmitWithdrawRequest = {
    /** The ID of the wallet from which funds will be withdrawn */
    walletId: WalletId;

    /** The ID of the user's bank account to receive the withdrawal */
    bankAccountId: BankAccountId;

    /** The amount of coins to withdraw */
    amount: Coin;

    /** Reason for the withdrawal, max 500 characters */
    reason: string;
};
