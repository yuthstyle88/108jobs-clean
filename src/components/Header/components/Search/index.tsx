"use client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
    showSearch?: boolean;
    className?: string;
};

type SearchForm = {
    query: string;
};

const Search = ({ showSearch = false, className = "" }: Props) => {
    const router = useRouter();
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const titleSearch = searchParams.get("titleSearch") || "";
    const [isSearchOpen, setIsSearchOpen] = useState(showSearch);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const { register, handleSubmit, setValue } = useForm<SearchForm>({
        defaultValues: { query: "" },
    });

    useEffect(() => {
        if (titleSearch) {
            setValue("query", titleSearch);
            setIsSearchOpen(true);
        }
    }, [titleSearch, setValue]);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsSearchOpen(false);
            }
        };
        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSearchOpen]);

    const onSubmit = (data: SearchForm) => {
        const trimmed = data.query.trim();
        if (trimmed) {
            router.push(`/job-board?q=${trimmed}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <div className={`relative flex items-center ${className}`} ref={dropdownRef}>
            {/* Mobile search toggle */}
            <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-primary hover:bg-white transition-all duration-200 shadow-sm"
                aria-label="Toggle search"
            >
                <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
            </button>

            {/* Desktop search bar */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`hidden lg:flex items-center bg-white rounded-full border border-gray-300 h-[40px] w-[220px] pl-4 pr-10 text-sm shadow-sm transition-all duration-300 ${
                    showSearch ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                <input
                    type="text"
                    placeholder={
                        titleSearch || t("global.hintTextHeaderSearch") || "Search..."
                    }
                    className="w-full focus:outline-none text-gray-800"
                    {...register("query")}
                />
                <button type="submit" className="absolute right-4">
                    <FontAwesomeIcon icon={faSearch} className="w-[14px] h-[14px] text-primary" />
                </button>
            </form>

            {/* Mobile dropdown search */}
            <div
                className={`lg:hidden absolute top-[3rem] right-0 w-[220px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 transform ${
                    isSearchOpen
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="relative p-2">
                    <input
                        type="text"
                        placeholder={
                            titleSearch || t("global.hintTextHeaderSearch") || "Search..."
                        }
                        className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        {...register("query")}
                    />
                    <button
                        type="submit"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                    >
                        <FontAwesomeIcon icon={faSearch} className="w-[14px] h-[14px]" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Search;
