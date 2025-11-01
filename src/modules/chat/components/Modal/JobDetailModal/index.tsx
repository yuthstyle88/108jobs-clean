import {useTranslation} from 'react-i18next';
import React from "react";
import {Post} from "lemmy-js-client";

interface JobDetailModalProps {
    showJobDetailModal: boolean;
    setShowJobDetailModal: (show: boolean) => void;
    post?: Post;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
                                                                  showJobDetailModal,
                                                                  setShowJobDetailModal,
                                                                  post,
                                                              }) => {
    const { t } = useTranslation();

    if (!showJobDetailModal) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            onClick={() => setShowJobDetailModal(false)}
        >
            <div
                className="bg-white rounded-lg p-4 sm:p-6 w-[95%] sm:w-[90%] max-w-2xl shadow-lg"
                role="dialog"
                aria-modal="true"
                aria-labelledby="job-details-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 id="job-details-title" className="text-base sm:text-lg font-semibold text-gray-900">
                        {t("profileChat.jobDetails") || "Job Details"}
                    </h3>
                    <button
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                        aria-label="Close job details"
                        onClick={() => setShowJobDetailModal(false)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-3">
                    <div>
                        <h4 className="text-sm sm:text-base font-medium text-gray-800">
                            {post?.name || t("profileChat.noJobTitle")}
                        </h4>
                    </div>
                    <div className="max-h-[60vh] overflow-auto">
                        <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                            {post?.body || t("profileChat.noJobDescription")}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        className="rounded-md bg-primary hover:bg-[#063a68] text-white px-4 py-2 text-sm transition-all duration-200"
                        onClick={() => setShowJobDetailModal(false)}
                    >
                        {t("profileChat.cancel") || "Close"}
                    </button>
                </div>
            </div>
        </div>
    );
};