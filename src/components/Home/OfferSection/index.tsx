import {CompareImage} from "@/constants/images";
import {faArrowRight, faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";
import {useTranslation} from "react-i18next";

const OfferSection = () => {
  const {t} = useTranslation();

  const cardData = [
    {
      image: CompareImage.compare1,
      title: "Freelancer",
      badge: null,
      contents: [
        "home.contentQualityOfferFreelancerCard1",
        "home.contentQualityOfferFreelancerCard2",
      ],
    },
    {
      image: CompareImage.compare2,
      title: t("home.tittleQualityOfferSpecialistCard"),
      badge: t("home.tittleQualityOfferSpecialistCard"),
      contents: [
        "home.contentQualityOfferSpecialistCard1",
        "home.contentQualityOfferSpecialistCard2",
        "home.contentQualityOfferSpecialistCard3",
        "home.contentQualityOfferSpecialistCard4",
      ],
    },
    {
      image: CompareImage.compare3,
      title: t("home.tittleQualityOfferProfessionalCard"),
      badge: t("home.tittleQualityOfferProfessionalCard"),
      badgeStyle: "bg-blue-500 text-white",
      contents: [
        "home.contentQualityOfferProfessionalCard1",
        "home.contentQualityOfferProfessionalCard2",
        "home.contentQualityOfferProfessionalCard3",
        "home.contentQualityOfferProfessionalCard4",
        "home.contentQualityOfferProfessionalCard5",
        "home.contentQualityOfferProfessionalCard6",
      ],
    },
  ];

  return (
    <section
      className="bg-gradient-to-t py-12 grid grid-container-desktop-banner gap-y-4 sm:gap-y-12 gap-x-4"
      style={{background: "linear-gradient(to top, hsl(216 85% 94%), #fff)"}}
    >
      <div className="col-start-2 col-end-3">
        <h2 className="home-title-head text-[18px] sm:text-[2.25rem] text-center">
          {t("home.tittleQualityOfferSection")}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[1.5rem] gap-y-[1.5rem] lg:gap-y-0 min-h-0 min-w-0 col-start-2 col-end-3">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="flex flex-col shadow-memberShipShadow rounded-lg bg-white"
          >
            <div className="p-6 flex-1 text-center bg-white rounded-lg gap-6">
              {card.badge && (
                <div className="w-full flex justify-end">
                  <button
                    className={`w-fit pointer-events-none font-semibold py-1 px-4 rounded-full shadow-md ${
                      card.badgeStyle || "bg-blue-200 text-blue-500"
                    }`}
                  >
                    {card.badge}
                  </button>
                </div>
              )}
              <div className="flex justify-center mt-8 items-center">
                <Image src={card.image} alt={card.title}/>
              </div>
              <div className="text-text-primary mt-6">
                <h3 className="font-semibold text-[1.25rem] mb-2">
                  {card.title}
                </h3>
                <ul className="text-sm text-left text-text_secondary grid grid-cols-[1fr] gap-1">
                  {card.contents.map((contentKey, idx) => (
                    <li key={idx} className="flex flex-row gap-3 items-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-[12px] h-[14px] text-third"
                      />
                      <p className="text-[0.875rem] leading-[1.65]">
                        {t(contentKey)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <hr className="w-full h-[1px] m-0 bg-border-secondary"/>
              <div className="h-[60px] px-6 flex justify-end items-center ">
                <div className="opacity-70 text-[0.875rem] cursor-pointer text-text_secondary">
                  {t("home.labelSeeMoreTittle")}
                  <FontAwesomeIcon icon={faArrowRight} className="pl-1"/>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OfferSection;
