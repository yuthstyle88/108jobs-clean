import {IsoData} from "@/utils/types";
import {isBrowser} from "@/utils/browser";
import {assertExists} from "@/utils/helpers";

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

/**
 * Custom Hook สำหรับดึง MyUserInfo จาก isoData
 */
export const useIsoData = () => {
    const isoData = getIsoData();
    const site = assertExists(isoData?.siteRes, "Missing Site data");
    return {
        site: assertExists(site.siteView, "Missing siteView"),
        admin: assertExists(site.admins, "Missing admins"),
        oauthProviders: assertExists(site.oauthProviders, "Missing oauthProviders"),
    };
};