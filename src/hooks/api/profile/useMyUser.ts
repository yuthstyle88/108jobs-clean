import {REQUEST_STATE} from "@/services/HttpService";
import {useUserStore} from "@/store/useUserStore";

/**
 * Custom Hook สำหรับดึง MyUserInfo จาก store (แทนที่ getIsoData)
 * รองรับ SSR โดย store จะถูก seed ใน UserServiceProvider เมื่อ mount แล้ว
 */
export const useMyUser = () => {
    const user = useUserStore((s) => s.userInfo);

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