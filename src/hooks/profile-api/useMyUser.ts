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
        // อัปเดตค่าเมื่อรันบนเบราว์เซอร์หลัง hydration เพื่อกระตุ้นให้เกิด re-render ในโหมด production
        const next = getIsoData()?.myUserInfo ?? null;
        setUser(next);
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