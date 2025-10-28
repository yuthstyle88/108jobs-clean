import {useTranslation} from 'react-i18next';
import React from "react";

interface JobFlowContentProps {
    setIsFlowOpen: (open: boolean) => void;
    renderFlowContent: () => React.ReactNode;
    setShowJobDetailModal: (show: boolean) => void;
    currentRoom: any;
}

export const JobFlowContent: React.FC<JobFlowContentProps> = ({
                                                                  setIsFlowOpen,
                                                                  renderFlowContent,
                                                                  setShowJobDetailModal,
                                                                  currentRoom,
                                                              }) => {
    const {t} = useTranslation();

    return (
        <>
            <div className="p-3 sm:p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-primary">
                    {t("profileChat.jobFlow") || "Job Flow"}
                </h2>
                <button
                    className="md:hidden p-2 bg-primary text-white rounded-full hover:bg-[#063a68] transition-all duration-200"
                    onClick={() => setIsFlowOpen(false)}
                    aria-label="Close job flow drawer"
                >
                    <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto border-b border-gray-200">
                {renderFlowContent()}
            </div>
            <div className="p-3 sm:p-4 md:p-6 bg-white border-t border-gray-200">
                <div
                    className="flex items-center bg-white rounded-lg shadow-sm p-2 sm:p-3 hover:shadow-md transition-all duration-200 hover:transform hover:scale-105 cursor-pointer"
                    aria-label="Job details"
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowJobDetailModal(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShowJobDetailModal(true);
                        }
                    }}
                >
                    <div className="flex-1">
                        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-1">
                            {currentRoom?.post?.name
                                ? currentRoom.post.name.length > 40
                                    ? `${currentRoom.post.name.slice(0, 40)}...`
                                    : currentRoom.post.name
                                : "No Job Title"}
                        </h3>
                        <p className="text-[0.65rem] sm:text-xs md:text-sm text-gray-600 line-clamp-2">
                            {currentRoom?.post?.body
                                ? currentRoom.post.body.length > 40
                                    ? `${currentRoom.post.body.slice(0, 40)}...`
                                    : currentRoom.post.body
                                : "No description available"}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};