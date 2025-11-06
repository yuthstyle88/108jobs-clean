import {Button} from "@/components/ui/Button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import React from "react";

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
    if (!hasPrevious && !hasNext) return null;

    return (
        <div className="flex justify-center gap-3 mt-8">
            {hasPrevious && (
                <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={isLoading}
                    className="py-2 px-4 rounded-lg font-medium bg-primary text-white hover:bg-[#063a68] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4 mr-1.5"/>
                    Previous
                </Button>
            )}
            {hasNext && (
                <Button
                    onClick={onNext}
                    disabled={isLoading}
                    className="py-2 px-4 rounded-lg font-medium bg-primary text-white hover:bg-[#063a68] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1.5"/>
                </Button>
            )}
        </div>
    );
};