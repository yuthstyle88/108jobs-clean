import {BankAccountId} from "./BankAccountId";
import {BankId} from "./BankId";

export type UpdateBankAccount = {
    bankAccountId: BankAccountId;
    bankId?: BankId;
    accountNumber?: string;
    accountName?: string;
    isDefault?: boolean;
};