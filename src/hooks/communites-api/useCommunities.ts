import {getIsoData} from "@/hooks/useIsoData";
import {REQUEST_STATE} from "@/services/HttpService";

export const useCommunities = () => {
    const isoData = getIsoData();
    const communities = isoData?.communities;
    const state = REQUEST_STATE.SUCCESS;
    return {
        state,
        communities,
    };
};