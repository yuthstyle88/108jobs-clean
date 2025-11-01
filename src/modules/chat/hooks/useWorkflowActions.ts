import {useCallback} from 'react';
import {HttpService, REQUEST_STATE} from '@/services/HttpService';
import {useWorkflow} from '@/modules/chat/hooks/useWorkflow';
import {getLatestProposedQuoteSeq} from '@/modules/chat/utils/message';
import type {
    ApproveQuotationForm,
    ChatRoomData,
    ChatRoomView,
    CreateInvoiceForm,
    LocalUser,
    PostId
} from 'lemmy-js-client';
import type {WsMessageSender} from '@/modules/chat/types';
import type {StatusKey} from '@/modules/chat/components/FreelanceChatFlow';
import {sendStructuredMessage} from '@/modules/chat/utils/structured';
import {SendEventDeps} from "@/modules/chat/events";

// Helper to extract meaningful error messages from wrapped HttpService responses
function extractErr(res: any, fallback: string) {
    const msg = res?.err?.message
        || res?.data?.error?.message
        || res?.data?.message
        || res?.data?.error
        || (Array.isArray(res?.data?.errors) ? res?.data?.errors[0] : undefined)
        || res?.data?.detail
        || '';
    return typeof msg === 'string' && msg.trim().length > 0 ? String(msg) : fallback;
}

// Deps the hook requires. Keep it flexible and explicit.
export type UseWorkflowActionsDeps = {
    messages: any[];
    roomData: ChatRoomView;
    localUser: LocalUser;
    roomId: string;
    selectedFile: { fileUrl: string; fileType: string; fileName: string } | null;
    setError: (msg: string | null) => void;
    t: (key: string) => string | undefined;
    sendMessage: WsMessageSender;
    goToStatus: (target: StatusKey, prevStatus?: StatusKey) => void;
    sendRoomUpdate: (event: SendEventDeps, update: Record<string, any>) => void;
    setHasStarted: (v: boolean) => void;
    setShowQuotationModal: (v: boolean) => void;
    setSelectedFile: (v: any) => void;
    canSend: boolean;
    disabledReason?: string | null;
    createInvoice: (form: CreateInvoiceForm) => Promise<any>;
    startWorkflow: (form: { postId: number; seqNumber: number; roomId: string }) => Promise<any>;
    approveQuotationApi: (form: ApproveQuotationForm) => Promise<any>;
    submitStartWorkApi: (form: any) => Promise<any>;
    approveWorkApi: (form: any) => Promise<any>;
    postId?: PostId | null | undefined;
    walletId?: number | null;
    currentStatus: StatusKey;
};

export const useWorkflowActions = (deps: UseWorkflowActionsDeps) => {
    const {
        messages,
        roomData,
        localUser,
        roomId,
        selectedFile,
        setError,
        t,
        sendMessage,
        goToStatus,
        sendRoomUpdate,
        setHasStarted,
        setShowQuotationModal,
        setSelectedFile,
        canSend,
        disabledReason,
        createInvoice,
        startWorkflow,
        approveQuotationApi,
        submitStartWorkApi,
        approveWorkApi,
        postId,
        walletId,
        currentStatus,
    } = deps;

    const goToStatusAndBroadcast = useCallback(
        (target: StatusKey, prevStatus?: StatusKey) => {
            // local UI transition
            goToStatus?.(target, prevStatus);

            // broadcast to partner
            sendRoomUpdate({roomId: roomId, senderId: localUser.id}, {
                senderId: localUser.id,
                updateType: 'status-change',
                statusTarget: target,
                prevStatus: prevStatus,
            });
        },
        [goToStatus, sendRoomUpdate, roomId]
    );

    // Use the new workflow id hook which hydrates from room payload
    const {
        workflowId,
        setWorkflowId,
        billingId,
        setBillingId
    } = useWorkflow(roomId, roomData, {resetBillingOnRoomChange: true});

    // Helper function to validate workflow ID
    const validateWorkflowId = useCallback((caller?: string): number | null => {
        if (!workflowId) {
            setError(
                ((t('profileChat.missingWorkflow') || 'Missing workflow. Start workflow before proceeding.')
                    + ` (workflowId: ${String(workflowId)})`
                    + (caller ? ` Called from: ${caller}` : ''))
            );
            return null;
        }
        return workflowId;
    }, [workflowId, setError, t]);


    const startWorkflowAction = useCallback(async () => {
        setError(null);
        try {
            const pid = postId;
            if (!pid) {
                setError(t('profileChat.missingPostIdForQuotation') || 'This chat is not linked to a post. You cannot create a quotation.');
                return false;
            }
            const seqNumber = 1;
            const res = await startWorkflow({postId: pid, seqNumber, roomId});
            if (res?.state === REQUEST_STATE.SUCCESS && res?.data?.success) {
                setHasStarted(true);
                const wfId = Number(res?.data?.workflowId);
                if (wfId) {
                    setWorkflowId(wfId);
                    try {
                        console.debug('[WF][start] server workflowId:', wfId);
                    } catch {
                    }
                }
                const payload = {type: 'employer-started'} as any;
                const readable = t('profileChat.startHiring') || 'Employer started hiring.';
                await sendStructuredMessage(sendMessage, roomId, payload, localUser.id, {
                    previewText: readable
                });
                goToStatusAndBroadcast('WaitForFreelancerQuotation');
                return true;
            } else {
                setError(t('profileChat.startWorkflowFailed') || extractErr(res, 'Failed to start workflow. Please try again.'));
                return false;
            }
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(t('profileChat.startWorkflowFailed') || `Failed to start workflow: ${msg}`);
            return false;
        }
    }, [postId, roomData, startWorkflow, roomId, setHasStarted, goToStatusAndBroadcast, t, sendMessage, localUser.id, roomData]);

    const quotationSubmit = useCallback(async (data: any) => {
        if (!canSend) {
            setError(disabledReason || null);
            setShowQuotationModal(false);
            return false;
        }
        setError(null);
        try {
            const form: CreateInvoiceForm = {
                employerId: data.partnerId,
                postId: data.postId,
                commentId: data.commentId,
                seqNumber: 1,
                amount: data.amount,
                proposal: data.proposal,
                projectName: data.projectName,
                status: 'QuotePendingReview',
                projectDetails: data.projectDetails,
                workingDays: data.workingDays,
                deliverables: data.deliverables,
                note: data.note ?? undefined,
                startingDay: data.startingDay,
                deliveryDay: data.deliveryDay,
                roomId: roomId,
                workflowId: workflowId
            } as any;

            const res = await createInvoice(form as any);
            if (res?.state !== REQUEST_STATE.SUCCESS) {
                setError(t('profileChat.quotationError') || 'Failed to create invoice. Please try again.');
                return false;
            }

            const createdBillingId = res?.data?.billingId;
            setBillingId(createdBillingId);

            const readable = t('profileChat.proposeQuoteMsg') || `Proposed quotation: ${data.projectName} - $${Number(data.amount).toFixed(2)}`;
            const payload = {type: 'proposed-quote', quote: data, billingId: createdBillingId} as any;
            await sendStructuredMessage(sendMessage, roomId, payload, localUser.id, {
                previewText: readable
            });
            goToStatusAndBroadcast('QuotationPendingReview');
            setShowQuotationModal(false);
            return true;
        } catch (err) {
            setError(t('profileChat.quotationError') || 'Failed to send quotation. Please try again.');
            return false;
        }
    }, [canSend, disabledReason, createInvoice, goToStatusAndBroadcast, localUser.id, roomId, setShowQuotationModal, t, sendMessage, roomData]);

    const approveQuotation = useCallback(async () => {
        try {
            setError(null);
            // Use billingId from local state only
            const bid = (billingId && !Number.isNaN(billingId)) ? billingId : null;
            if (!bid) {
                setError(t('profileChat.missingBillingId') || 'Missing billing id. Create/approve a quotation first.');
                return false;
            }

            const workflowId = validateWorkflowId('approveQuotation');
            if (!workflowId) return false;

            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const form: ApproveQuotationForm = {
                seqNumber,
                billingId: bid,
                walletId: walletId,
                workflowId
            } as any;
            const res = await approveQuotationApi(form as any);
            if (res?.state === REQUEST_STATE.FAILED) {
                if ((res as any)?.err?.name === 'insufficientBalanceForTransfer') {
                    setError((res as any)?.err?.message);
                }
            }
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to approve quotation.'));
                return false;
            }

            const payload = {type: 'employer-assigned'} as any;
            const readable = t('profileChat.approveQuotation') || 'Approve quotation';
            await sendStructuredMessage(sendMessage, roomId, payload, localUser.id, {
                previewText: readable
            });
            goToStatusAndBroadcast('OrderApproved');
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [approveQuotationApi, localUser.id, roomId, t, sendMessage, walletId, validateWorkflowId, goToStatusAndBroadcast, billingId, messages, roomData]);

    const startWork = useCallback(async () => {
        try {
            setError(null);
            const workflowId = validateWorkflowId('startWork');
            if (!workflowId) return false;

            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const form: any = {
                seqNumber,
                workflowId,
                workDescription: t('profileChat.startWorkMsg') || 'Freelancer started work.'
            };
            const res = await submitStartWorkApi(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to start work.'));
                return false;
            }
            const payload = {type: 'start-work'} as any;
            const readable = t('profileChat.startWork') || 'Start work';
            await sendStructuredMessage(sendMessage, roomId, payload, localUser.id, {
                previewText: readable,
            });
            goToStatusAndBroadcast('InProgress');
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [messages, submitStartWorkApi, t, roomId, localUser.id, sendMessage, goToStatusAndBroadcast, validateWorkflowId, roomData]);

    const submitDelivery = useCallback(async () => {
        try {
            setError(null);
            if (!canSend) {
                setError(disabledReason || null);
                return false;
            }
            if (!selectedFile || !selectedFile.fileUrl) {
                setError(t('profileChat.attachFileFirst') || 'Please attach a file before submitting delivery.');
                return false;
            }
            const workflowId = validateWorkflowId('submitDelivery');
            if (!workflowId) return false;

            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const form: any = {
                seqNumber,
                workflowId,
                workDescription: t('profileChat.submitDeliveryMsg') || 'Freelancer submitted a delivery.',
                deliverableUrl: selectedFile.fileUrl,
            };
            const res = await HttpService.client.submitWork(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to submit delivery.'));
                return false;
            }

            const payload: any = {
                type: 'submit-delivery',
                url: selectedFile.fileUrl,
                name: selectedFile.fileName,
                mime: selectedFile.fileType
            };
            const preview = `[Delivery] ${selectedFile.fileName}`;
            await sendStructuredMessage(sendMessage, roomId, payload, localUser.id, {
                previewText: preview,
            });
            setSelectedFile(null);
            goToStatusAndBroadcast('PendingEmployerReview');
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [canSend, disabledReason, messages, selectedFile, localUser?.id, roomId, t, setSelectedFile, sendMessage, goToStatusAndBroadcast, validateWorkflowId, roomData]);

    const requestRevision = useCallback(async () => {
        try {
            setError(null);
            if (!canSend) {
                setError(disabledReason || t('profileChat.cannotPerformAction') || 'You cannot perform this action right now.');
                return false;
            }
            const workflowId = validateWorkflowId('requestRevision');
            if (!workflowId) return false;

            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const reason = t('profileChat.requestRevisionMsg') || 'Please revise and resubmit.';
            const form: any = {seqNumber, workflowId, reason};
            const res = await HttpService.client.requestRevision(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to request revision.'));
                return false;
            }
            const payload: any = {type: 'request-revision', reason};
            await sendStructuredMessage(sendMessage, roomId, payload, localUser.id, {
                previewText: reason,
            });
            goToStatusAndBroadcast('InProgress');
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [canSend, disabledReason, messages, t, roomId, localUser?.id, sendMessage, goToStatusAndBroadcast, validateWorkflowId, roomData]);

    const approveWork = useCallback(async () => {
        try {
            setError(null);
            if (!canSend) {
                setError(disabledReason || t('profileChat.cannotPerformAction') || 'You cannot perform this action right now.');
                return false;
            }
            const workflowId = validateWorkflowId('approveWork');
            if (!workflowId) return false;

            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const bid = (billingId && !Number.isNaN(billingId)) ? billingId : null;
            if (!bid) {
                setError(t('profileChat.missingBillingId') || 'Missing billing id. Create/approve a quotation first.');
                return false;
            }
            const form: any = {seqNumber, workflowId, roomId, billingId: bid};
            const res = await approveWorkApi(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to approve work.'));
                return false;
            }
            const payload = {type: 'delivery-accepted'} as any;
            const content = t('profileChat.deliveryAccepted') || 'Delivery accepted. Proceed to payment.';
            await sendStructuredMessage(sendMessage, roomId, payload, localUser.id, {
                previewText: content,
            });
            goToStatusAndBroadcast('Completed');
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [canSend, disabledReason, messages, approveWorkApi, t, roomId, localUser?.id, sendMessage, goToStatusAndBroadcast, validateWorkflowId, billingId, roomData]);

    const cancelJob = useCallback(async () => {
        try {
            if (!canSend) {
                setError(disabledReason || t('profileChat.cannotPerformAction') || 'You cannot perform this action right now.');
                return false;
            }
            const workflowId = validateWorkflowId('cancelJob');
            if (!workflowId) return false;

            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const form: any = {seqNumber, workflowId: roomData.workflow?.id, currentStatus};
            const res = await HttpService.client.cancelJob(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to cancel job.'));
                return false;
            }
            const content = t('profileChat.cancelledJobMsg') || 'The job has been cancelled.';
            await sendStructuredMessage(sendMessage, roomId, {type: 'cancel-job'}, localUser.id, {
                previewText: content,
            });
            goToStatusAndBroadcast('Cancelled', currentStatus);
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [canSend, disabledReason, messages, roomId, localUser?.id, t, sendMessage, goToStatusAndBroadcast, validateWorkflowId, currentStatus, roomData]);

    return {
        startWorkflowAction,
        quotationSubmit,
        approveQuotation,
        startWork,
        submitDelivery,
        requestRevision,
        approveWork,
        cancelJob,
    } as const;
};