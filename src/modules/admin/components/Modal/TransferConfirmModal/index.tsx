import React from "react";

interface TransferConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    transfer: {
        userName?: string | undefined;
        reason: string;
        amount: number;
        paymentCode?: string | undefined;
        date: string;
    } | null;
}

export const TransferConfirmModal: React.FC<TransferConfirmModalProps> = ({
                                                                              isOpen,
                                                                              onClose,
                                                                              onConfirm,
                                                                              transfer,
                                                                          }) => {
    if (!isOpen || !transfer) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md shadow-lg">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
                    Confirm Coin Transfer
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 text-center">
                    Transfer coins from this top-up to the user's wallet.
                </p>

                <div className="space-y-3 py-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">User</span>
                        <span className="font-medium">{transfer.userName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Reason</span>
                        <span className="text-xs">{transfer.reason}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-gray-600 font-medium">Amount</span>
                        <span className="text-lg font-bold text-green-600">
                            +{transfer.amount.toLocaleString()} coins
                        </span>
                    </div>
                </div>

                <div className="flex justify-center gap-3 mt-6">
                    <button
                        className="rounded-md bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-sm transition-all duration-200"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm transition-all duration-200"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Confirm Transfer
                    </button>
                </div>
            </div>
        </div>
    );
};