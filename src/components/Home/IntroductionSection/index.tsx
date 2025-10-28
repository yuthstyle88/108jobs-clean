import {CustomerImage} from "@/constants/images";
import Image from "next/image";
import React from "react";
import {useTranslation} from "react-i18next";

type Props = {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
};

const IntroductionSection = ({expanded, setExpanded}: Props) => {
  const {t} = useTranslation();

  const customerLogos = [
    CustomerImage.pic1,
    CustomerImage.pic2,
    CustomerImage.pic3,
    CustomerImage.pic4,
    CustomerImage.pic5,
    CustomerImage.pic6,
    CustomerImage.pic7,
    CustomerImage.pic8,
    CustomerImage.pic9,
    CustomerImage.pic10,
    CustomerImage.pic11,
    CustomerImage.pic12,
  ];

  const jobCategories = [
    {title: t("home.graphicDesign"), desc: t("home.graphicDesignServices")},
    {
      title: t("home.architectureEngineering"),
      desc: t("home.architectureEngineeringServices"),
    },
    {title: t("home.websiteProgramming"), desc: t("home.websiteProgrammingServices")},
    {title: t("home.marketingAdvertising"), desc: t("home.marketingAdvertisingServices")},
    {title: t("home.writingTranslation"), desc: t("home.writingTranslationServices")},
    {title: t("home.mediaAudio"), desc: t("home.mediaAudioServices")},
    {title: t("home.businessConsulting"), desc: t("home.businessConsultingServices")},
    {title: t("home.lifestyle"), desc: t("home.lifestyleServices")},
  ];

  return (
    <>
      {/* Trusted Companies */}
      <section className="hidden md:block" style={{backgroundColor: "hsl(216, 15%, 97%)"}}>
        <div className="py-8 grid grid-container-desktop gap-y-[1.5rem]">
          <div className="col-start-2 col-end-3 text-center">
            <h5 className="text-[1.25rem] text-[#2B323BF2] font-medium mb-[1.5rem]">
              {t("home.titleTrustedCompanies")}
            </h5>
            <div className="grid grid-cols-6 grid-rows-2 gap-x-8 gap-y-4">
              {customerLogos.map((logo, index) => (
                <Image
                  key={index}
                  src={logo}
                  alt="trusted company"
                  style={{filter: "grayscale(100%)"}}
                  width={384}
                  height={230}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Introduction */}
      <section className="hidden md:block">
        <div className="bg-white pt-24 pb-16 grid grid-container-desktop gap-y-12">
          <div className="col-start-2 col-end-3">
            <h2 className="text-[rgb(8,67,155)] font-[500] text-[36px] mb-[0.83em]">
              {t("home.titlePlatform")}
            </h2>
            <div
              className={`text-gray-700 overflow-hidden transition-all duration-300 ${
                expanded ? "max-h-[500px]" : "max-h-20"
              }`}
            >
              <p>{t("home.contentFastwork1")}</p>
              <br/>
              <p>{t("home.contentFastwork2")}</p>
              <br/>
              <p>{t("home.contentFastwork3")}</p>
            </div>
            {!expanded && (
              <div
                className="text-primary cursor-pointer text-center mt-4"
                onClick={() => setExpanded(true)}
              >
                {t("home.buttonJobCategoriesViewMore")} ▼
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-container-desktop-banner">
        <div className="col-start-2 col-end-3">
          <hr className="w-full h-[1px] m-0 bg-border-secondary"/>
        </div>
      </div>

      {/* Job Categories */}
      <section className="hidden md:block">
        <div className="bg-white pt-24 pb-16 grid grid-container-desktop gap-y-12">
          <div className="col-start-2 col-end-3">
            <h2 className="text-[rgb(8,67,155)] font-[500] text-[36px] mb-[0.83em]">
              {t("home.titleJobCategories")}
            </h2>
            <div className="grid gap-x-8 gap-y-6 grid-cols-4 grid-rows-2">
              {jobCategories.map((cat, index) => (
                <div key={index}>
                  <strong className="font-[Kanit] text-[#2B323BF2]">{cat.title}</strong>
                  <p className="mt-2 text-[0.875rem] leading-[1.65] text-[hsl(216,15%,52%)]">
                    {cat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default IntroductionSection;
