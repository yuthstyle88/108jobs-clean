import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

interface PaginationProps {
  prevPage: string | null | undefined; // ใช้ cursor จาก API
  nextPage: string | null | undefined; // ใช้ cursor จาก API
  onPageChange: (pageCursor: string | null) => void; // ส่ง cursor กลับไป
}

export const Pagination = ({
  prevPage,
  nextPage,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <button
        onClick={() => onPageChange(prevPage || null)} // ใช้ prevPage
        disabled={!prevPage} // ปิดการใช้งานถ้าไม่มี prevPage
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          !prevPage
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
      </button>

      <button
        onClick={() => onPageChange(nextPage || null)} // ใช้ nextPage
        disabled={!nextPage} // ปิดการใช้งานถ้าไม่มี nextPage
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          !nextPage
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
      </button>
    </div>
  );
};