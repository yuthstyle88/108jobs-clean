import {Button} from "@/components/ui/Button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import React from "react";
import {useTranslation} from "react-i18next";
import {cn} from "@/lib/utils";

interface PaginationControlsProps {
    hasPrevious: boolean;
    hasNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
    isLoading?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
                                                                          hasPrevious,
                                                                          hasNext,
                                                                          onPrevious,
                                                                          onNext,
                                                                          isLoading = false,
                                                                      }) => {
    const {t} = useTranslation();

    return (
        <div className={cn("flex justify-center gap-3 mt-8", (!hasPrevious && !hasNext) && "hidden")}>
            {hasPrevious && (
                <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={isLoading}
                    className="py-2 px-4 rounded-lg font-medium bg-primary text-white hover:bg-[#063a68] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4 mr-1.5"/>
                    {t("profileCoins.previousButton")}
                </Button>
            )}
            {hasNext && (
                <Button
                    onClick={onNext}
                    disabled={isLoading}
                    className="py-2 px-4 rounded-lg font-medium bg-primary text-white hover:bg-[#063a68] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {t("profileCoins.nextButton")}
                    <ChevronRight className="w-4 h-4 ml-1.5"/>
                </Button>
            )}
        </div>
    );
};