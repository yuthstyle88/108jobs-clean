import {GroupIcon} from "@/constants/icons";
import {AssetsImage, LandingImage} from "@/constants/images";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";
import {useTranslation} from "react-i18next";

const HiringSection = () => {
  const {t} = useTranslation();
  const freelancerIntro = [
    {
      icon: AssetsImage.group,
      title: t("home.tittleFirstSlogan"),
      description: t("home.contentFreelancerVerification"),
    },
    {
      icon: AssetsImage.shield,
      title: t("home.tittleSecondSlogan"),
      description: t("home.contentPaymentProtection"),
    },
    {
      icon: AssetsImage.paper,
      title: t("home.tittleThirdSlogan"),
      description: t("home.contentQualityFreelancers"),
    },
  ];
  return (
    <>
      <section className="py-6 sm:py-24 grid grid-container-desktop-banner gap-y-4 sm:gap-y-12 ">
        <div className="col-start-2 col-end-3">
          <h4 className="text-[16px] sm:text-[1.5rem] text-[#38404c] font-medium leading-[1.15]">
            {t("home.tittlePrimaryWhySection")}
          </h4>
          <h2 className="home-title-head text-[18px] sm:text-[2.25rem]">
            {t("home.tittleSecondaryWhySection")}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-[1.5rem] gap-y-[1rem] lg:gap-y-0 min-h-0 min-w-0 col-start-2 col-end-3">
          {freelancerIntro.map((freelancer, index) => (
            <div key={index} className="flex flex-col items-center sm:block">
              <Image
                src={freelancer.icon}
                alt="Group of people"
                width={62}
                height={62}
                className="max-w-full h-auto align-top self-center"
              />
              <div className="grid grid-cols-[1fr] mt-4 gap-y-1 text-text-primary font-medium">
                <h5 className="text-base sm:text-[1.25rem] leading-[1.15]">
                  {freelancer.title}
                </h5>
                <p className="m-0 text-base font-sans leading-[1.65] ">
                  {freelancer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-6">
        <div className="grid grid-container-desktop-banner gap-y-4 sm:gap-y-12">
          <div className="col-start-2 col-end-3">
            <h2 className="home-title-head text-[18px] sm:text-[2.25rem]">
              {t("home.titleStartHiringSection")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[1.5rem] min-h-0 min-w-0 col-start-2 col-end-3">
            {/* Cột 1 */}
            <div className="grid grid-rows-2 gap-y-6 text-text-primary font-medium">
              <div className="flex gap-x-5">
                <div className="flex-shrink-0">
                  <Image
                    src={GroupIcon.group11651}
                    width={30}
                    height={30}
                    alt="group1"
                  />
                </div>
                <div>
                  <h1 className="text-[1.25rem] leading-[1.15]">
                    {t("home.labelStartHiringSection1")}
                  </h1>
                  <p className="m-0 text-base font-sans leading-[1.65]">
                    {t("home.contentStartHiringSection1")}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-5">
                <div className="flex-shrink-0">
                  <Image
                    src={GroupIcon.group11653}
                    width={30}
                    height={30}
                    alt="group3"
                  />
                </div>
                <div>
                  <h1 className="text-[1.25rem] leading-[1.15]">
                    {t("home.labelStartHiringSection3")}
                  </h1>
                  <p className="m-0 text-base font-sans leading-[1.65]">
                    {t("home.contentStartHiringSection3")}
                  </p>
                </div>
              </div>
            </div>

            {/* Cột 2 */}
            <div className="grid grid-rows-2 gap-y-6 text-text-primary font-medium">
              <div className="flex gap-x-5">
                <div className="flex-shrink-0">
                  <Image
                    src={GroupIcon.group11652}
                    width={30}
                    height={30}
                    alt="group2"
                  />
                </div>
                <div>
                  <h1 className="text-[1.25rem] leading-[1.15]">
                    {t("home.labelStartHiringSection2")}
                  </h1>
                  <p className="m-0 text-base font-sans leading-[1.65]">
                    {t("home.contentStartHiringSection2")}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-5">
                <div className="flex-shrink-0">
                  <Image
                    src={GroupIcon.group11654}
                    width={30}
                    height={30}
                    alt="group4"
                  />
                </div>
                <div>
                  <h1 className="text-[1.25rem] leading-[1.15]">
                    {t("home.labelStartHiringSection4")}
                  </h1>
                  <p className="m-0 text-base font-sans leading-[1.65]">
                    {t("home.contentStartHiringSection4")}
                  </p>
                </div>
              </div>
            </div>

            {/* Cột 3 */}
            <div className="rounded-lg relative cursor-pointer h-[219px] mt-8 md:mt-0">
              <Image
                src={LandingImage.videoBg}
                alt="video background"
                className="rounded-lg object-cover w-full h-full"
                width={500}
                height={500}
              />
              <div className="bg-black/25 absolute top-0 left-0 w-full h-full rounded-lg">
                <div
                  className="w-[75px] h-[75px] rounded-full bg-black absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="w-[38px] h-[38px] text-white pl-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HiringSection;
