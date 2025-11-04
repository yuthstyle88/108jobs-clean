import {REQUEST_STATE} from "@/services/HttpService";
import {useCommunitiesStore} from "@/store/useCommunitiesStore";

export const useCommunities = () => {
    const communities = useCommunitiesStore((s) => s.communities);
    const state = REQUEST_STATE.SUCCESS;
    return {
        state,
        communities,
    };
};