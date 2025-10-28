"use client";
import {ArrowLeftIcon} from "lucide-react";

export const AuthFormContainer = ({
  children,
  title,
  onBack,
}: {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
}) => (
  <div className="bg-white rounded-3xl shadow-xl p-16 gap-y-6 w-full relative min-h-[500px] h-fit">
    <div className="flex items-center gap-4">
      {onBack && (
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition-colors p-2 -ml-2 absolute top-4 left-6"
        >
          <ArrowLeftIcon className="h-6 w-6"/>
        </button>
      )}
    </div>
    <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">
      {title}
    </h3>
    {children}
  </div>
);