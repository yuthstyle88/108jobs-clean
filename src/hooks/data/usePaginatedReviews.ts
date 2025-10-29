import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHttpGet } from "@/hooks/api/http/useHttpGet";
import { REQUEST_STATE } from "@/services/HttpService";
import { PaginationCursor, PersonId } from "@/lib/lemmy-js-client/src";

interface UsePaginatedReviewsProps {
    profileId: PersonId;
    limit?: number;
}

export const usePaginatedReviews = ({ profileId, limit = 10 }: UsePaginatedReviewsProps) => {
    const { t } = useTranslation();
    const [currentCursor, setCurrentCursor] = useState<PaginationCursor | undefined>(undefined);
    const [cursorHistory, setCursorHistory] = useState<PaginationCursor[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        state: searchState,
        data: reviewsPagination,
        isMutating: isReviewsLoading,
    } = useHttpGet("listUserReviews", {
        profileId,
        pageCursor: currentCursor,
        limit,
    });

    const reviewViews = useMemo(() => reviewsPagination?.reviews || [], [reviewsPagination?.reviews]);
    const hasPreviousPage = useMemo(() => cursorHistory.length > 0, [cursorHistory]);
    const hasNextPage = useMemo(() => !!reviewsPagination?.nextPage, [reviewsPagination?.nextPage]);
    const error = useMemo(() => {
        if (searchState.state === REQUEST_STATE.FAILED) {
            return t("profile.errorFetchingReviews") || "Failed to fetch reviews.";
        }
        return null;
    }, [searchState.state, t]);

    const handleNextPage = useCallback(() => {
        if (reviewsPagination?.nextPage) {
            setCursorHistory((prev) => [...prev, currentCursor || ""]);
            setCurrentCursor(reviewsPagination.nextPage);
        }
    }, [reviewsPagination?.nextPage, currentCursor]);

    const handlePrevPage = useCallback(() => {
        if (cursorHistory.length > 0) {
            const prevCursor = cursorHistory[cursorHistory.length - 1];
            setCursorHistory((prev) => prev.slice(0, -1));
            setCurrentCursor(prevCursor || undefined);
        }
    }, [cursorHistory]);

    useEffect(() => {
        setIsLoading(isReviewsLoading);
    }, [isReviewsLoading]);

    return {
        reviewViews,
        isLoading,
        error,
        hasPreviousPage,
        hasNextPage,
        loadNextReviews: handleNextPage,
        loadPreviousReviews: handlePrevPage,
    };
};