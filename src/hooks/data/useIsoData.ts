import {assertExists} from "@/utils/helpers";
import {useSiteStore} from "@/store/useSiteStore";

/**
 * Custom Hook สำหรับดึงข้อมูล Site จาก store (แทนที่ getIsoData)
 */
export const useIsoData = () => {
    const siteRes = useSiteStore((s) => s.siteRes);
    const site = assertExists(siteRes, "Missing Site data");
    return {
        site: assertExists((site as any).siteView ?? (site as any).data?.siteView ?? site, "Missing siteView"),
        admin: assertExists((site as any).admins ?? (site as any).data?.admins, "Missing admins"),
        oauthProviders: assertExists((site as any).oauthProviders ?? (site as any).data?.oauthProviders, "Missing oauthProviders"),
    };
};