"use client";

import { faCoins, faUniversity, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BankAccountId, BankAccountView } from "lemmy-js-client";
import { useRouter } from "next/navigation";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    balance: number;
    banks: BankAccountView[];
    withdrawAmount: string;
    setWithdrawAmount: Dispatch<SetStateAction<string>>;
    withdrawReason: string;
    setWithdrawReason: Dispatch<SetStateAction<string>>;
    onSubmit: () => void;
};

const WithdrawalModal = ({
                             isOpen,
                             onClose,
                             balance,
                             banks,
                             withdrawAmount,
                             setWithdrawAmount,
                             withdrawReason,
                             setWithdrawReason,
                             onSubmit,
                         }: Props) => {
    const { t } = useTranslation();
    const router = useRouter();

    const [bankId, setBankId] = useState<BankAccountId>(
        banks[0]?.userBankAccount.id ?? 0
    );

    // keep default bank in sync when banks change
    useEffect(() => {
        if (banks.length && !bankId) setBankId(banks[0].userBankAccount.id);
    }, [banks, bankId]);

    // ---- validation --------------------------------------------------
    const amountNum = parseFloat(withdrawAmount) || 0;
    const isValid =
        amountNum > 0 &&
        amountNum <= balance &&
        !!bankId &&
        withdrawReason.trim().length > 0;

    // ---- handlers ----------------------------------------------------
    const handleConfirm = () => {
        if (!isValid) return;
        onSubmit();
        // reset & close
        setWithdrawAmount("");
        setWithdrawReason("");
        onClose();
    };

    const handleCancel = () => {
        setWithdrawAmount("");
        setWithdrawReason("");
        onClose();
    };

    const handleAddBank = () => {
        router.push("/account-setting/bank-account");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    {t("profileCoins.withdrawRequest") || "Withdrawal Request"}
                </h2>

                {/* ---------- Amount ---------- */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("profileCoins.amount") || "Amount (Coins)"}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={withdrawAmount}
                            onChange={(e) =>
                                setWithdrawAmount(e.target.value.replace(/[^0-9]/g, ""))
                            }
                            placeholder="100"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-800"
                        />
                        <FontAwesomeIcon
                            icon={faCoins}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-600"
                        />
                    </div>
                    {withdrawAmount && amountNum > balance && (
                        <p className="text-xs text-red-500 mt-1">
                            {t("profileCoins.available") || "Available"}: {balance.toLocaleString()}{" "}
                            coins
                        </p>
                    )}
                </div>

                {/* ---------- Bank ---------- */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("profileCoins.selectBank") || "Select Bank Account"}
                    </label>

                    {banks.length > 0 ? (
                        <div className="relative">
                            <select
                                value={bankId}
                                onChange={(e) => setBankId(Number(e.target.value))}
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-800 appearance-none"
                            >
                                {banks.map((b) => (
                                    <option key={b.userBankAccount.id} value={b.userBankAccount.id}>
                                        {b.bank.name} - {b.userBankAccount.accountNumber} (
                                        {b.userBankAccount.accountName})
                                    </option>
                                ))}
                            </select>
                            <FontAwesomeIcon
                                icon={faUniversity}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                {t("profileCoins.noBank") || "No bank account added"}
                            </p>
                            <button
                                onClick={handleAddBank}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                {t("sellerBankAccount.buttonAddBank") || "Add Bank"}
                            </button>
                        </div>
                    )}
                </div>

                {/* ---------- Reason ---------- */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("profileCoins.reason") || "Reason for Withdrawal"}
                    </label>
                    <textarea
                        value={withdrawReason}
                        onChange={(e) => setWithdrawReason(e.target.value)}
                        placeholder="e.g., Monthly payout, project completion..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-800 resize-none"
                    />
                </div>

                {/* ---------- Buttons ---------- */}
                <div className="flex space-x-3">
                    <button
                        onClick={handleConfirm}
                        disabled={!isValid}
                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                            isValid
                                ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {t("global.buttonConfirm") || "Confirm"}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
                    >
                        {t("global.buttonCancel") || "Cancel"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalModal;