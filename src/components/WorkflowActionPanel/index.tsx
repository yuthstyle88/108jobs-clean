// WorkflowActionPanel.tsx
import React from "react";
import {ActionButton} from "@/modules/chat/components/ActionButton";
import {WorkFlowAction} from "@/modules/chat/types/workflow";
import {useTranslation} from "react-i18next";
import Link from "next/link";

interface WorkflowActionPanelProps {
    actions: WorkFlowAction[];
    loading?: string | boolean;
    onAction: (action: WorkFlowAction, payload?: any) => void;
    /** Available wallet balance (THB) */
    availableBalance: number;
    /** Required amount to approve (THB) */
    requiredAmount: number;
}

// Label map (สามารถต่อกับ i18n ได้)
const ACTION_LABELS: Record<WorkFlowAction, string> = {
    submitQuotation: "Submit Quotation",
    approveOrder: "Approve Order",
    startWork: "Start Work",
    submitDelivery: "Submit Delivery",
    requestRevision: "Request Revision",
    releasePayment: "Release Payment",
    cancel: "Cancel Job",
    restart: "Restart",
};

export const WorkflowActionPanel: React.FC<WorkflowActionPanelProps> = ({
                                                                            actions,
                                                                            loading,
                                                                            onAction,
                                                                            availableBalance,
                                                                            requiredAmount,
                                                                        }) => {
    const {t} = useTranslation();
    const canApprove =
        availableBalance >= requiredAmount; // default allow when numbers are not provided

    const hadApproveAction = actions?.includes('approveOrder');
    const approveHidden = hadApproveAction && !canApprove;

    const handleClick = (action: WorkFlowAction) => {
        if (action === 'approveOrder' && approveHidden) {
            alert('Insufficient balance to approve this order.');
            return;
        }
        onAction(action);
    };

    const displayActions = actions.filter((a) => a !== 'approveOrder' || canApprove);

    return (
        <div
            className="w-full p-3 bg-white/90 backdrop-blur rounded-xl shadow-md border border-gray-200 flex flex-col gap-3">
            {displayActions.length === 0 ? null : (
                <>
                    {approveHidden && (
                        <div
                            className="mb-1 p-2 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm"
                        >
                            <div className="font-medium">{t("profileChat.insufficientBalanceTitle")}</div>
                            <div className="mt-1">
                                {t("profileChat.insufficientBalanceWarning")}{" "}
                                <Link href="/coin" className="underline font-medium">
                                    {t("profileChat.topUpNow")}
                                </Link>
                            </div>
                        </div>
                    )}
                    {displayActions.map((a) => (
                        <div key={a} className="w-full transition-transform hover:translate-y-[-1px]">
                            <ActionButton
                                action={a}
                                label={ACTION_LABELS[a] || a}
                                loading={loading === true || loading === a}
                                variant={a === 'cancel' ? 'destructive' : 'default'}
                                className={
                                    a === 'cancel'
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-100 disabled:brightness-110 disabled:saturate-125'
                                        : undefined
                                }
                                onClick={() => handleClick(a)}
                            />
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default WorkflowActionPanel;