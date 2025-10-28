"use client";
import Image from "next/image";

import {Swiper, SwiperSlide, useSwiper} from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../app/styles.css";

import {Autoplay, Keyboard, Mousewheel, Navigation, Pagination,} from "swiper/modules";

import {LandingImage} from "@/constants/images";

const slides = [
  LandingImage.slider2,
  LandingImage.slider1,
  LandingImage.slider3,
  LandingImage.slider4,
  LandingImage.slider5,
  LandingImage.slider6,
  LandingImage.slider7,
];

const CustomNavigation = () => {
  const swiper = useSwiper();
  return (
    <div>
      <button
        className="absolute top-1/2 -translate-y-1/2 left-0 bg-transparent pl-2 border-[none] text-[24px] rounded-tr-[10px] rounded-br-[10px] cursor-pointer z-50"
        onClick={() => swiper.slidePrev()}
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-0 bg-transparent pr-2 border-[none] text-[24px] rounded-tl-[10px] rounded-bl-[10px] cursor-pointer z-50"
        onClick={() => swiper.slideNext()}
      >
        ❯
      </button>
    </div>
  );
};

const SpAdsSlider = () => {
  return (
    <section className="pb-0 pt-12 md:mt-16 md:pb-16 grid grid-container-desktop-banner gap-y-12">
      <div className="col-span-1"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 lg:gap-y-0 lg:grid-cols-3 gap-x-5 w-full">
        <div className="col-span-1 lg:col-span-2">
          <Swiper
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={true}
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
            className="mySwiper"
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
          >
            <CustomNavigation/>
            {slides.map((img, i) => (
              <SwiperSlide key={i}>
                <Image
                  src={img}
                  alt={`Picture ${i + 1}`}
                  className="rounded-lg"
                  width={800}
                  height={400}
                  priority
                  style={{width: "100%", height: "auto"}}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="col-span-1 hidden sm:block">
          <div className="grid grid-cols-1 gap-y-6">
            <Image
              src={LandingImage.awardBg}
              alt="Picture 1"
              className="rounded-lg"
              width={400}
              height={200}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpAdsSlider;
