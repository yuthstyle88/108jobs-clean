import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {PortfolioPic} from "lemmy-js-client";
import dynamic from "next/dynamic";
import {NextArrow, PrevArrow} from "@/components/Common/Button/SliderArrows";
const SlickSlider = dynamic(() => import('react-slick'), { ssr: false });

interface PortfolioSliderProps {
    portfolioItems: PortfolioPic[];
    isOwnProfile: boolean;
    onImageClick: (imageUrl: string) => void;
}

const PortfolioSlider: React.FC<PortfolioSliderProps> = ({ portfolioItems, isOwnProfile, onImageClick }) => {
    const { t } = useTranslation();
    const imagesPerPage = 3;

    const portfolioSettings = {
        dots: true,
        infinite: portfolioItems.length > imagesPerPage,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        swipeToSlide: true,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">{t("profile.portfolio")}</h2>
                {isOwnProfile && (
                    <Link
                        prefetch={false}
                        href="/account-setting/portfolio"
                        className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label={portfolioItems.length > 0 ? "Edit portfolio" : "Add portfolio"}
                    >
                        <FontAwesomeIcon icon={faEdit} className="text-gray-600" />
                    </Link>
                )}
            </div>
            {portfolioItems.length > 0 ? (
                <div className="relative bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <SlickSlider {...portfolioSettings}>
                        {portfolioItems.map((item) => (
                            <div key={item.id} className="p-2">
                                <div
                                    className="h-48 rounded-lg flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
                                    onClick={() => onImageClick(item.imageUrl)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && onImageClick(item.imageUrl)}
                                    aria-label={`View ${item.title} in modal`}
                                >
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title ?? ""}
                                        width={300}
                                        height={200}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        loading="lazy"
                                        className="w-full h-36 object-cover rounded-t-lg"
                                    />
                                    <p className="text-gray-700 text-sm font-medium text-center p-2">{item.title}</p>
                                </div>
                            </div>
                        ))}
                    </SlickSlider>
                </div>
            ) : (
                <p className="text-gray-600 text-sm">{t("profile.noPortfolio")}</p>
            )}
        </div>
    );
};

export default PortfolioSlider;