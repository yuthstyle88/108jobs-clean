"use client";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {X} from "lucide-react";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useOptionalChatRooms} from "@/modules/chat/contexts/ChatRoomsContext";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    minPrice?: number;
    maxPrice?: number;
    rating?: string;
  }) => void;
  currentFilters: {
    minPrice?: number;
    maxPrice?: number;
    rating: string;
  };
}

const FilterSidebar = ({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}: FilterSidebarProps) => {
  const [min, setMin] = useState<number | undefined>(currentFilters.minPrice);
  const [max, setMax] = useState<number | undefined>(currentFilters.maxPrice);
  const [rating, setRating] = useState(currentFilters.rating || "");
  const {t} = useTranslation();
  useEffect(() => {
      if (isOpen) {
        setMin(currentFilters.minPrice);
        setMax(currentFilters.maxPrice);
        setRating(currentFilters.rating);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isOpen]);

  useEffect(() => {
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) onClose();
      };
      document.addEventListener("keydown",
        handleEscapeKey);
      return () => document.removeEventListener("keydown",
        handleEscapeKey);
    },
    [isOpen, onClose]);

  useEffect(() => {
      document.body.style.overflow = isOpen ? "hidden" : "auto";
      return () => {
        document.body.style.overflow = "auto";
      };
    },
    [isOpen]);

  const handleApply = () => {
    onApply({
      minPrice: min,
      maxPrice: max,
      rating,
    });
    onClose();
  };

  // Optional chat rooms context for showing unread indicators in the sidebar
  const chatRoomsCtx = useOptionalChatRooms();
  const roomsWithUnread = (chatRoomsCtx?.rooms || []).filter((r: any) => (r?.unreadCount || 0) > 0);

  const handleClear = () => {
    setMin(undefined);
    setMax(undefined);
    setRating("");
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "visible" : "invisible"}`}>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-150 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 left-0 w-full sm:w-[560px] bg-white shadow-xl transform transition-all duration-150 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col pt-[8rem] sm:pt-[5rem] relative">
          <div className="absolute top-[120px] sm:top-20 right-4 z-[199]">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-100 hover:scale-110 duration-150"
            >
              <X className="h-5 w-5 text-black"/>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-text-primary">
                {t("filter.priceRange")}
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="0"
                  value={min ?? ""}
                  onChange={(e) =>
                    setMin(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="text-text-primary w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder={t("filter.highestPrice")}
                  value={max ?? ""}
                  onChange={(e) =>
                    setMax(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="text-text-primary w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-text-primary">
                {t("filter.pointsReceived")}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-text-primary">
                {[5, 4, 3, 2, 1].map((n) => {
                  const value = n === 5 ? "5" : `${n}Plus`;
                  return (
                    <button
                      key={value}
                      className={`w-full p-2 border border-gray-300 rounded-md ${
                        rating === value
                          ? "bg-secondary text-third font-bold border-third"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        setRating((prev) => (prev === value ? "" : value))
                      }
                    >
                      {n}{" "}
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-[#e9b10c]"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chats with new messages */}
            {roomsWithUnread.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-text-primary">Chats</h3>
                <ul className="divide-y divide-gray-100">
                  {roomsWithUnread.map((r: any) => (
                    <li key={r.id} className="flex items-center justify-between py-2">
                      <span className="text-text-primary truncate max-w-[70%]" title={r.name}>{r.name}</span>
                      <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-[20px] px-2 text-xs text-white bg-red-500 rounded-full">
                        {r.unreadCount > 9 ? "9+" : r.unreadCount}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex justify-between">
            <button
              className="px-4 py-2 text-primary font-medium hover:bg-blue-50 rounded-md"
              onClick={handleClear}
            >
              {t("filter.cleanTheFilters")}
            </button>
            <button
              className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-[#063a68]"
              onClick={handleApply}
            >
              {t("filter.confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
