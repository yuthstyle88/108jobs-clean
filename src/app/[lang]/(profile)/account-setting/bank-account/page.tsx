"use client";

import {useHttpDelete} from "@/hooks/api/http/useHttpDelete";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import {useHttpPost} from "@/hooks/api/http/useHttpPost";
import {useHttpPut} from "@/hooks/api/http/useHttpPut";
import {Pencil, Plus, Star, Trash2} from "lucide-react";
import {useState} from "react";
import BankAccountModal, {BankAccountFormValues} from "@/components/Common/Modal/AddBankAccountModal";
import ConfirmDeleteModal from "@/components/Common/Modal/DeleteBankModal";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import {useTranslation} from "react-i18next";


const BankAccount = () => {
    const {t} = useTranslation();
    const {
        data: bankListRes,
        isMutating: isBankListLoading,
    } = useHttpGet("listBanks");

    const {
        data: bankAccountsRes,
        isMutating: isBankAccountsLoading,
        execute: reloadBankAccounts,
    } = useHttpGet("listUserBankAccounts");

    const {execute: createBankAccount} = useHttpPost("createBankAccount");
    const {execute: setDefaultBankAccount} = useHttpPut("setDefaultBankAccount");
    const {execute: deleteBankAccount, isMutating: isDeleting} =
        useHttpDelete("deleteBankAccount");

    const bankList = bankListRes?.banks || [];
    const bankAccounts = (bankAccountsRes?.bankAccounts ?? []) as any[];
    // Normalize API response keys to support both snake_case and camelCase from backend
    const normalizedAccounts = bankAccounts
        .map((acc: any) => {
            const userBank = acc?.user_bank_account ?? acc?.userBankAccount;
            const bank = acc?.bank ?? acc?.Bank ?? undefined;
            if (!userBank) return null;
            return {user_bank_account: userBank, bank};
        })
        .filter(Boolean) as any[];

    const [modalOpen, setModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccountFormValues | null>(null);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deletingAccountId, setDeletingAccountId] = useState<number | null>(null);

    const handleAdd = () => {
        setEditingAccount(null);
        setModalOpen(true);
    };

    const handleEdit = (account: any) => {
        setEditingAccount({
            bankId: String(account.user_bank_account.bankId),
            accountNumber: account.user_bank_account.accountNumber,
            accountName: account.user_bank_account.accountName,
        });
        setModalOpen(true);
    };

    const handleSubmit = async (data: BankAccountFormValues & { id?: string }) => {
        const bank = bankList.find((b: any) => String(b.id) === data.bankId);
        if (!bank) {
            return;
        }
        await createBankAccount({
            bankId: Number(data.bankId),
            accountNumber: data.accountNumber,
            accountName: data.accountName,
            countryId: bank.countryId,
        });
        await reloadBankAccounts();
    };

    const handleSetDefault = async (id: number) => {
        await setDefaultBankAccount({bankAccountId: id});
        await reloadBankAccounts();
    };

    const handleConfirmDelete = (id: number) => {
        setDeletingAccountId(id);
        setConfirmDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (deletingAccountId == null) return;
        await deleteBankAccount({bankAccountId: deletingAccountId});
        await reloadBankAccounts();
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
                {isBankAccountsLoading && <p>Loading accounts...</p>}
                {(isBankListLoading || isBankAccountsLoading) && <LoadingBlur text=""/>}
                {!isBankAccountsLoading && normalizedAccounts.length === 0 && (
                    <p className="text-text-primary">{t("sellerBankAccount.noBankFound")}</p>
                )}
                {normalizedAccounts.map((acc) => (
                    <div
                        key={acc.user_bank_account.id}
                        className={`border rounded-md p-4 flex justify-between items-center ${
                            acc.user_bank_account.isDefault ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                    >
                        <div>
                            <p className="font-medium text-gray-800">{acc.bank?.name ?? "Unknown Bank"}</p>
                            <p className="text-gray-500">
                                {acc.user_bank_account.accountNumber} — {acc.user_bank_account.accountName}
                            </p>
                            {acc.user_bank_account.isDefault && (
                                <span className="text-xs text-primary font-medium">✅ Default</span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {!acc.user_bank_account.isDefault && (
                                <button
                                    onClick={() => handleSetDefault(acc.user_bank_account.id)}
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
                            {!acc.user_bank_account.isDefault && (
                                <button
                                    onClick={() => handleConfirmDelete(acc.user_bank_account.id)}
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
                onClose={() => setModalOpen(false)}
                initialData={editingAccount}
                onSubmit={handleSubmit}
                bankList={bankList}
            />

            <ConfirmDeleteModal
                isOpen={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title="Delete Bank Account"
                description="Are you sure you want to delete this bank account? This action cannot be undone."
            />
        </div>
    );
};

export default BankAccount;
