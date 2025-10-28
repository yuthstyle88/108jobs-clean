"use client";

import {faQuoteLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import {Swiper, SwiperSlide, useSwiper} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../../app/styles.css";
import {Navigation} from "swiper/modules";
import {LandingImage, ProfileImage} from "@/constants/images";
import {useTranslation} from "react-i18next";
import {getAppName} from "@/utils/appConfig";

const CustomNavigation = () => {
  const swiper = useSwiper();
  return (
    <div>
      <button
        className="absolute top-1/2 -translate-y-1/2 left-0 bg-transparent pl-2 border-none text-[24px] rounded-tr-[10px] rounded-br-[10px] cursor-pointer z-50"
        onClick={() => swiper.slidePrev()}
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-0 bg-transparent pr-2 border-none text-[24px] rounded-tl-[10px] rounded-bl-[10px] cursor-pointer z-50"
        onClick={() => swiper.slideNext()}
      >
        ❯
      </button>
    </div>
  );
};

const RecommendAndReview = () => {
  const {t} = useTranslation();

  const featuredWorks = Array.from({length: 6},
    (_, index) => ({
      id: index,
      title: "Line sticker",
      author: "designdee",
      image: LandingImage.topWorks,
    }));

  const reviews = Array.from({length: 6},
    (_, index) => ({
      id: index,
      quote:
        getAppName()+" ทำให้ การทำงาน สะดวก และ ง่ายขึ้นมากครับ เราสามารถ เลือกฟรีแลนซ์ได้ตามสไตล์ที่เราต้องการ",
      company: "บริษัท อีสานพลาสแพ็ค 1999 จำกัด",
      description: "โรงงานอุตสาหกรรมพลาสติก",
      avatar: ProfileImage.avatar,
    }));

  return (
    <>
      {/* Featured Works */}
      <section className="bg-white pt-4 sm:pt-12 grid grid-container-desktop-banner">
        <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-medium text-[18px] sm:text-[2.25rem] leading-[41.4px]">
          {t("home.titleFeaturedWorks")}
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 xl:px-8 pb-16 pt-8">
        <Swiper
          modules={[Navigation]}
          breakpoints={{
            0: {slidesPerView: 1, spaceBetween: 20},
            640: {slidesPerView: 2, spaceBetween: 20},
            1024: {slidesPerView: 3, spaceBetween: 30},
          }}
          className="mySwiper"
        >
          <CustomNavigation/>
          {featuredWorks.map((work) => (
            <SwiperSlide key={work.id}>
              <div className="bg-white p-4 sm:p-6 pb-8">
                <Link
                  prefetch={false}
                  href="/"
                  className="block rounded-lg mx-auto w-[350px] shadow-top-work-shadow"
                >
                  <div className="h-[256px] relative">
                    <Image
                      src={work.image}
                      alt={work.title}
                      width={400}
                      height={200}
                      className="absolute h-full w-full inset-0 object-cover rounded-tr-lg rounded-tl-lg"
                    />
                  </div>
                  <div className="rounded-b-lg bg-white">
                    <div className="grid grid-cols-[2fr_10fr] p-4">
                      <Image
                        src={ProfileImage.avatar}
                        alt={work.author}
                        width={36}
                        height={36}
                        className="rounded-full object-cover w-9 h-9"
                      />
                      <div>
                        <p className="font-semibold text-text-primary">{work.title}</p>
                        <p className="text-sm text-text-secondary">by {work.author}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Reviews */}
      <section className="bg-white grid grid-container-desktop-banner">
        <div className="col-start-2 col-end-3 text-[rgb(8,67,155)] font-medium text-[18px] sm:text-[2.25rem] leading-[41.4px]">
          {t("home.labelReviewsCustomer")}
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 xl:px-8 pb-16 pt-4">
        <Swiper
          modules={[Navigation]}
          breakpoints={{
            0: {slidesPerView: 1, spaceBetween: 20},
            640: {slidesPerView: 2, spaceBetween: 20},
            1024: {slidesPerView: 3, spaceBetween: 30},
          }}
          className="mySwiper"
        >
          <CustomNavigation/>
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="w-full max-w-[350px] m-auto bg-white px-4 py-6">
                <div className="shadow-review-shadow rounded-lg p-4 sm:p-6">
                  <div className="mb-6 flex gap-4 sm:gap-8">
                    <FontAwesomeIcon
                      icon={faQuoteLeft}
                      className="text-[#E3EDFD] w-6 h-7 sm:w-7 sm:h-8"
                    />
                    <blockquote className="text-base leading-[1.65] text-[#728197] font-sans italic">
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src={review.avatar}
                      alt={review.company}
                      width={47}
                      height={47}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <span className="text-third font-medium text-sm">
                        {review.company}
                      </span>
                      <div className="text-gray-500 text-xs">{review.description}</div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default RecommendAndReview;
