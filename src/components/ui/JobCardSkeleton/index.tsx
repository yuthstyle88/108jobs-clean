import React from "react";

const JobCardSkeleton = () => {
  return (
    <div className="flex items-stretch w-full">
      <div
        className="relative grid grid-cols-2 [grid-template-areas:'cover_cover''content_content''footer-left_footer-right'] overflow-hidden w-full border  border-neutral-200 rounded-md bg-white">
        <div className="relative [grid-area:cover] w-full bg-skeleton aspect-[3/2] object-cover">
          <div className="skeleton-job-card"/>
        </div>
        <div className="flex flex-col [grid-area:content] gap-[0.5em] h-[100px] p-[0.5em]">
          <div className="w-full h-[10px] rounded-full bg-skeleton relative overflow-hidden ">
            <div className="skeleton-job-card"/>
          </div>
          <div className="w-1/2 h-[10px] rounded-full bg-skeleton relative overflow-hidden ">
            <div className="skeleton-job-card"/>
          </div>
        </div>
        <div className="flex items-end [grid-area:footer-left] h-[44px] p-[0.5em]">
          <div className="w-[70%] h-[10px] rounded-full bg-skeleton relative overflow-hidden ">
            <div className="skeleton-job-card"/>
          </div>
        </div>
        <div className="flex flex-col items-end [grid-area:footer-right] h-[44px] p-[0.5em] gap-[0.5em]">
          <div className="w-[20%] h-[10px] rounded-full bg-skeleton relative overflow-hidden ">
            <div className="skeleton-job-card"/>
          </div>
          <div className="w-[50%] h-[10px] rounded-full bg-skeleton relative overflow-hidden ">
            <div className="skeleton-job-card"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardSkeleton;
