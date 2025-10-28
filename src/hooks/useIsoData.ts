import {IsoData} from "@/utils/types";
import {isBrowser} from "@/utils/browser";

/**
 * ดึง IsoData จาก window (เฉพาะฝั่งเบราว์เซอร์เท่านั้น)
 * หากรันบน SSR ให้คืนค่า null
 */
export function getIsoData(): IsoData | null {
    if (isBrowser() && "isoData" in window) {
        return (window as { isoData: IsoData }).isoData;
    }
    return null;
}