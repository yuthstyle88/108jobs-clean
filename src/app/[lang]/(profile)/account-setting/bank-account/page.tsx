"use client";

import {useHttpDelete} from "@/hooks/api/http/useHttpDelete";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import {useHttpPost} from "@/hooks/api/http/useHttpPost";
import {useHttpPut} from "@/hooks/api/http/useHttpPut";
import {Pencil, Plus, Star, Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import BankAccountModal, {BankAccountFormValues} from "@/components/Common/Modal/AddBankAccountModal";
import ConfirmDeleteModal from "@/components/Common/Modal/DeleteBankModal";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import {useTranslation} from "react-i18next";
import {isSuccess} from "@/services/HttpService";
import {useBankAccountsStore} from "@/store/useBankAccountStore";


const BankAccount = () => {
    const {t} = useTranslation();
    const {
        bankAccounts,
        setDefaultBankAccount: setDefaultBankAccountStore,
        deleteBankAccount: deleteBankAccountStore,
        upsertBankAccount
    } = useBankAccountsStore();
    const [bankAccountList, setBankAccountList] = useState<Array<any>>([]);
    const [error, setError] = useState<string | null>(null);
    const {
        data: bankListRes,
        isMutating: isBankListLoading,
    } = useHttpGet("listBanks");

    const {execute: createBankAccount} = useHttpPost("createBankAccount");
    const {execute: updateBankAccount} = useHttpPut("updateBankAccount");
    const {execute: setDefaultBankAccount} = useHttpPut("setDefaultBankAccount");
    const {execute: deleteBankAccount, isMutating: isDeleting} =
        useHttpDelete("deleteBankAccount");
    useEffect(() => {
        setBankAccountList(bankAccounts ?? []);
    }, [bankAccounts]);

    const bankList = bankListRes?.banks || [];

    // Sort bank accounts with default account on top
    const normalizedAccounts = bankAccountList
        .map((acc: any) => {
            const userBank = acc?.userBankAccount ?? acc?.userBankAccount;
            const bank = acc?.bank ?? acc?.Bank ?? undefined;
            if (!userBank) return null;
            return {userBankAccount: userBank, bank};
        })
        .filter(Boolean)
        .sort((a: any, b: any) => {
            // Put default accounts first (true comes before false)
            if (a.userBankAccount.isDefault && !b.userBankAccount.isDefault) return -1;
            if (!a.userBankAccount.isDefault && b.userBankAccount.isDefault) return 1;

            // If both have same default status, sort by account name or keep original order
            return a.userBankAccount.accountName.localeCompare(b.userBankAccount.accountName);
        }) as any[];

    const [modalOpen, setModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<{ id?: number } & BankAccountFormValues | null>(null);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deletingAccountId, setDeletingAccountId] = useState<number | null>(null);

    const handleAdd = () => {
        setEditingAccount(null);
        setModalOpen(true);
    };

    const handleEdit = (account: any) => {
        setEditingAccount({
            id: account.userBankAccount.id, // Add the ID for editing
            bankId: String(account.userBankAccount.bankId),
            accountNumber: account.userBankAccount.accountNumber,
            accountName: account.userBankAccount.accountName,
        });
        setModalOpen(true);
    };

    const handleSubmit = async (data: BankAccountFormValues & { id?: number }) => {
        const bank = bankList.find((b: any) => String(b.id) === data.bankId);
        if (!bank) {
            return;
        }

        let res;

        // Check if has ID - then it's an update, otherwise it's a create
        if (data.id) {
            // Update existing bank account - match the UpdateBankAccount type
            res = await updateBankAccount({
                bankAccountId: data.id, // This matches bankAccountId in UpdateBankAccount type
                bankId: Number(data.bankId),
                accountNumber: data.accountNumber,
                accountName: data.accountName,
                // isDefault is optional, so we don't include it unless we're changing it
            });
        } else {
            // Create new bank account
            res = await createBankAccount({
                bankId: Number(data.bankId),
                accountNumber: data.accountNumber,
                accountName: data.accountName,
                countryId: bank.countryId,
            });
        }

        if (isSuccess(res)) {
            // Refresh the bank accounts list
            upsertBankAccount(res.data.bankAccount);
            setModalOpen(false);
        } else {
            setError(t("sellerBankAccount.bankAccountAlreadyExistsForThisBank"))
        }
    };

    const handleSetDefault = async (id: number) => {
        const res = await setDefaultBankAccount({bankAccountId: id});
        if (isSuccess(res)) {
            setDefaultBankAccountStore(id);
        }
    };

    const handleConfirmDelete = (id: number) => {
        setDeletingAccountId(id);
        setConfirmDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (deletingAccountId == null) return;
        const res = await deleteBankAccount({bankAccountId: deletingAccountId});
        if (isSuccess(res)) {
            deleteBankAccountStore(deletingAccountId);
        }
        setConfirmDeleteOpen(false);
        setDeletingAccountId(null);
    };

    return (
        <div className="border-1 border-border-primary bg-white rounded-md shadow-sm overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 p-6">
                <div>
                    <h2 className="text-[16px] font-medium mb-2 text-text-primary">
                        {t("sellerBankAccount.bankInfoTitle")}
                    </h2>
                    <p className="text-gray-600 mb-6 text-[14px] font-sans">
                        {t("sellerBankAccount.bankInfoDescription")}
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-[#063a68]"
                >
                    <Plus className="w-5 h-5"/>
                    {t("sellerBankAccount.buttonAddBank")}
                </button>
            </div>

            <div className="p-6 space-y-4">
                {isBankListLoading && <LoadingBlur text=""/>}
                {normalizedAccounts.length === 0 && (
                    <p className="text-text-primary">{t("sellerBankAccount.noBankFound")}</p>
                )}
                {normalizedAccounts.map((acc) => (
                    <div
                        key={acc.userBankAccount.id}
                        className={`border rounded-md p-4 flex justify-between items-center ${
                            acc.userBankAccount.isDefault ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {acc.userBankAccount.isDefault && (
                                <span className="text-xs text-primary font-medium bg-blue-100 px-2 py-1 rounded">
                                    ✅ {t("sellerBankAccount.default") || "Default"}
                                </span>
                            )}
                            <div>
                                <p className="font-medium text-gray-800">{acc.bank?.name ?? "Unknown Bank"}</p>
                                <p className="text-gray-500">
                                    {acc.userBankAccount.accountNumber} — {acc.userBankAccount.accountName}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {!acc.userBankAccount.isDefault && (
                                <button
                                    onClick={() => handleSetDefault(acc.userBankAccount.id)}
                                    className="text-sm text-primary border border-primary rounded-md px-3 py-1 hover:bg-blue-50"
                                >
                                    <Star className="w-4 h-4 inline mr-1"/>
                                    {t("sellerBankAccount.setAsDefault")}
                                </button>
                            )}
                            <button
                                onClick={() => handleEdit(acc)}
                                className="text-sm text-gray-600 border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50"
                            >
                                <Pencil className="w-4 h-4 inline mr-1"/>
                                {t("sellerBankAccount.edit")}
                            </button>
                            {!acc.userBankAccount.isDefault && (
                                <button
                                    onClick={() => handleConfirmDelete(acc.userBankAccount.id)}
                                    className="text-sm text-red-600 border border-red-600 rounded-md px-3 py-1 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4 inline mr-1"/>
                                    {t("sellerBankAccount.delete")}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <BankAccountModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setError("");
                }}
                initialData={editingAccount}
                onSubmit={handleSubmit}
                bankList={bankList}
                error={error}
            />

            <ConfirmDeleteModal
                isOpen={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title={t("sellerBankAccount.confirmDeleteTitle")}
                description={t("sellerBankAccount.confirmDeleteDescription")}
            />
        </div>
    );
};

export default BankAccount;