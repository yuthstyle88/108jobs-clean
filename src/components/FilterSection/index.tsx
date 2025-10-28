"use client";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import FilterSidebar from "./FilterSidebar";
import {X} from "lucide-react";
import {useTranslation} from "react-i18next";

type Props = {
  onFilterChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    rating?: string;
  }) => void;
  currentFilters: {
    minPrice?: number;
    maxPrice?: number;
    rating: string;
  };
};

const FilterSection = ({onFilterChange, currentFilters}: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {t} = useTranslation();
  const countActiveFilters = () => {
    let count = 0;
    if (currentFilters.rating) count += 1;
    if (currentFilters.minPrice !== undefined) count += 1;
    if (currentFilters.maxPrice !== undefined) count += 1;
    return count;
  };

  const activeFilterCount = countActiveFilters();

  return (
    <>
      {activeFilterCount > 0 ? (
        <div
          className={`${activeFilterCount > 0 ? "bg-secondary text-third border-third hover:bg-[#dae5f7]" : "hover:bg-[#F6F7F8] border-border-primary"} filter-button px-4 py-2 rounded-md flex items-center gap-2 text-text-primary cursor-pointer hover:bg-gray-100 transition`}
          onClick={() => setIsFilterOpen(true)}
        >
          <span className="bg-third text-white flex items-center justify-center rounded-full w-4 h-4 text-sm font-bold ">
            {activeFilterCount}
          </span>
          {t("language.filter")}
          <X
            onClick={(e) => {
              e.stopPropagation();
              onFilterChange({
                rating: "",
                minPrice: undefined,
                maxPrice: undefined,
              });
            }}
            className="w-4 h-4 text-gray-500 hover:text-third cursor-pointer"
          />

        </div>
      ) : (
        <div
          onClick={() => setIsFilterOpen(true)}
          className="filter-button border border-border-primary px-4 py-2 rounded-md flex items-center gap-2 text-text-primary cursor-pointer hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faFilter} className="text-third"/>
          {t("language.filter")}
        </div>
      )}

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={onFilterChange}
        currentFilters={currentFilters}
      />
    </>
  );
};

export default FilterSection;
