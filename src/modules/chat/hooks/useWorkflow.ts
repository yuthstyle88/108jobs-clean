// useWorkflow.ts (client hook)
import {useEffect, useState} from "react";

export function useWorkflow(
    roomId: string | undefined,
    roomData?: any,
    opts: { resetBillingOnRoomChange?: boolean } = {}
) {
    // options
    const { resetBillingOnRoomChange = true } = opts;
    const [workflowId, setWorkflowId] = useState<number | null>(null);
    // billingId is created after quotation; start as null and resolve later
    const [billingId, setBillingId] = useState<number | null>(null);

    // Hydrate workflowId from backend payload whenever roomId/roomData changes
    useEffect(() => {
        if (!roomId) return;
        const idFromRoom =
            (roomData?.room?.workflow?.id as number) ??
            (roomData?.workflow?.id as number) ??
            undefined;
        const parsed = idFromRoom == null ? null : Number(idFromRoom);
        setWorkflowId(!Number.isNaN(parsed as number) ? (parsed as number) : null);
    }, [roomId, roomData]);

    // Optionally reset billingId when switching rooms so new payload can hydrate it
    useEffect(() => {
        if (!resetBillingOnRoomChange) return;
        setBillingId(null);
    }, [roomId, resetBillingOnRoomChange]);

    // Hydrate billingId from backend payload when available (do not overwrite if already resolved)
    useEffect(() => {
        if (!roomId) return;
        // if already resolved (e.g., after createBilling API), don't overwrite
        if (billingId != null) return;

        const raw =
            (roomData as any)?.room?.workflow?.billingId ??
            (roomData as any)?.workflow?.billingId ??
            null;

        const parsedBilling = raw == null ? null : Number(raw);
        if (parsedBilling != null && !Number.isNaN(parsedBilling)) {
            setBillingId(parsedBilling);
        }
    }, [roomId, roomData, billingId]);

    // expose setter ไว้ใช้หลังเรียก API (startWorkflow/…)
    return { workflowId, setWorkflowId, billingId, setBillingId };
}