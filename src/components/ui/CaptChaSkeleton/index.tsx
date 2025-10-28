import React from "react";

const CaptChaSkeleton = () => {
  return (
    <div className="flex items-stretch w-full">
      <div className="relative grid grid-cols-2 [grid-template-areas:'coverCover''contentContent''footer-leftFooter-right'] overflow-hidden w-full">
        <div className="flex flex-col [grid-area:content] gap-[0.5em] h-28 w-40">
          <div className="w-full h-28 bg-gray-200 relative overflow-hidden ">
            <div className="skeleton-job-card"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptChaSkeleton;
