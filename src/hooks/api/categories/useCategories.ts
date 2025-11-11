import {REQUEST_STATE} from "@/services/HttpService";
import {useCategoriesStore} from "@/store/useCategoriesStore";

export const useCategories = () => {
    const categories = useCategoriesStore((s) => s.categories);
    const state = REQUEST_STATE.SUCCESS;
    return {
        state,
        categories,
    };
};