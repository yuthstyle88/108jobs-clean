"use client";

import {CategoriesImage} from "@/constants/images";
import {useClickOutside} from "@/hooks/ui/useClickOutside";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import Loading from "../Common/Loading/Loading";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import ErrorState from "@/components/ErrorState";

type Props = {
    name: string;
};

const PopularSubCat = ({name}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

    const {
        data: catalogData,
        isMutating: isLoading,
    } = useHttpGet("listCategories");

    const popularServices = catalogData?.categories.find(
        (catalog) => catalog.category.name.toLowerCase() === "popular services"
    );

    if (isLoading) return <Loading/>;

    if (!popularServices) return <ErrorState/>;

    return (
        <section
            className="col-start-2 col-end-3 grid grid-cols-2 sm:grid-cols-[280px_1fr] pt-12 sm:pt-8 pb-9 gap-6 text-[0.875rem]">
            <div className="relative pt-4" ref={dropdownRef}>
                <div className="sticky top-[110px] sm:top-[100px]">
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="flex items-center space-x-2 text-primary hover:text-blue-700 focus:outline-none"
                    >
                        <span className="text-lg">{popularServices?.category.name}</span>
                        <svg
                            className={`w-5 h-5 transform transition-transform ${
                                isOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {isOpen && (
                        <div
                            className="absolute left-0 mt-2 w-[250px] bg-white rounded-lg shadow-lg z-50 flex animate-fade-down">
                            <div className="w-64 py-4">
                                {catalogData?.categories.map((subcategory) => {
                                    const fallbackSlug = subcategory.category.name
                                        .toLowerCase()
                                        .replace(/\s+/g,
                                            "-");
                                    const catalogId = subcategory.category.id ?? fallbackSlug;

                                    return (
                                        <Link prefetch={false}
                                              key={subcategory.category.id}
                                              href={`/categories/${catalogId}`}
                                              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                                              onClick={() => setIsOpen(false)}
                                        >
                                            {subcategory.category.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {popularServices && (
                        <div className="pl-6 mt-4 grid gap-2 justify-start">
                            {popularServices.children?.map((cat) => (
                                <Link prefetch={false}
                                      key={cat.category.id}
                                      href={`/job/${cat.category.id}`}
                                      className="text-text-secondary hover:underline"
                                >
                                    {cat.category.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1">
                <h2 className="text-[24px] md:text-[32px] font-semibold text-text-primary pb-4">
                    {popularServices?.category.name}
                </h2>
                {popularServices && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {popularServices.children?.map((cat) => (
                            <Link prefetch={false}
                                  key={cat.category.id}
                                  href={`/job/${cat.category.id}`}
                                  className="group relative overflow-hidden rounded-lg"
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={cat.category.banner || CategoriesImage.webDevelopment}
                                        alt={cat.category.name}
                                        width={500}
                                        height={500}
                                        className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-200 bg-black/20"
                                        priority
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <h3 className="text-lg font-semibold">{cat.category.name}</h3>
                                        <p className="text-sm opacity-90">{cat.category.title}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularSubCat;
