import React from "react";

export const SkeletonRegister: React.FC = () => {
    return (
      <div className="animate-pulse space-y-4 p-4">
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-12 bg-gray-300 rounded w-1/2 mx-auto" />
        </div>
    );
};

export default SkeletonRegister;