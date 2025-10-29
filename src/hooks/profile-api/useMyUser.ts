import {REQUEST_STATE} from "@/services/HttpService";
import {getIsoData} from "@/hooks/useIsoData";
import {useEffect, useState} from "react";

/**
 * Custom Hook สำหรับดึง MyUserInfo จาก isoData
 * แก้ปัญหา SSR: ระหว่าง SSR จะได้ค่า null จึงต้องอัปเดตหลัง mount เพื่อให้เกิด re-render
 */
export const useMyUser = () => {
    const [user, setUser] = useState(() => getIsoData()?.myUserInfo ?? null);

    useEffect(() => {
        // อัปเดตหลัง hydration; เลื่อน setState ออกจาก body ของ effect เพื่อลด cascading renders
        const next = getIsoData()?.myUserInfo ?? null;
        queueMicrotask(() => setUser(next));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const profileState = user ? REQUEST_STATE.SUCCESS : REQUEST_STATE.FAILED;
    return {
        profileState,
        person: user?.localUserView.person || null,
        localUser: user?.localUserView.localUser || null,
        contact: user?.profile?.contact || null,
        address: user?.profile?.address || null,
        card: user?.profile?.identityCard || null,
        wallet: user?.wallet || null,
    };
};