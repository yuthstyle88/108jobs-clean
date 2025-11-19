import React from "react";
import { useTranslation } from "react-i18next";
import ReviewCard from "@/components/Profile/Reviews/ReviewCard";
import { PersonId } from "lemmy-js-client";
import { usePaginatedReviews } from "@/hooks/data/usePaginatedReviews";

const ITEMS_PER_PAGE = 1;

interface ReviewsProps {
    profileId: PersonId;
}

const Reviews: React.FC<ReviewsProps> = ({ profileId }) => {
    const { t } = useTranslation();
    const {
        reviewViews,
        isLoading,
        error,
        hasPreviousPage,
        hasNextPage,
        loadNextReviews,
        loadPreviousReviews,
    } = usePaginatedReviews({ profileId, limit: ITEMS_PER_PAGE });

    return (
        <div className="mt-8">
            <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-6 overflow-x-auto pb-2">
                    <span className="flex-shrink-0 pb-2 text-sm font-medium text-primary border-b-2 border-primary">
                        {t("profile.reviewTab")}
                    </span>
                </div>
            </div>
            {error && (
                <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100 text-center mb-6">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}
            <div className="space-y-6">
                {reviewViews.length > 0 ? (
                    reviewViews.map((reviewView) => <ReviewCard key={reviewView.review.id} reviewView={reviewView} />)
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100 text-center">
                        <p className="text-gray-600 text-sm">{t("profile.noReviews") || "No reviews available yet."}</p>
                    </div>
                )}
                {isLoading && (
                    <div className="text-center text-gray-600 text-sm">{t("profile.loading") || "Loading..."}</div>
                )}
                {(hasPreviousPage || hasNextPage) && (
                    <div className="mt-4 flex justify-center items-center gap-3">
                        <button
                            onClick={loadPreviousReviews}
                            disabled={!hasPreviousPage || isLoading}
                            className={`flex justify-center items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                !hasPreviousPage || isLoading
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-primary text-white hover:bg-blue-700"
                            }`}
                        >
                            {t("profileJob.previousButton") || "Previous"}
                        </button>
                        <button
                            onClick={loadNextReviews}
                            disabled={!hasNextPage || isLoading}
                            className={`flex justify-center items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                !hasNextPage || isLoading
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-primary text-white hover:bg-blue-700"
                            }`}
                        >
                            {t("profileJob.nextButton") || "Next"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;