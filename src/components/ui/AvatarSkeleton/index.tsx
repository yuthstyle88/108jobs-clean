import React from "react";

const AvatarSkeleton = () => {
  return (
    <div className="flex items-stretch w-full">
      <div className="relative grid grid-cols-2 [grid-template-areas:'coverCover''contentContent''footer-leftFooter-right'] overflow-hidden w-full">
        <div className="flex flex-col [grid-area:content] gap-[0.5em] w-12 h-12">
          <div className="w-full h-12 rounded-full bg-gray-200 relative overflow-hidden ">
            <div className="skeleton-job-card"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSkeleton;
