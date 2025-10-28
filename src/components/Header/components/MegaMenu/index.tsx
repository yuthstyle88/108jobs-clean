"use client";
import {MegaMenuImage} from "@/constants/images";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import {faBuilding, faChevronRight, faStarAndCrescent,} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image, {StaticImageData} from "next/image";
import Link from "next/link";
import {JSX, useState} from "react";
import Business from "./Business";
import Chat from "./Chat";
import Find from "./Find";
import Hiring from "./Hiring";
import Post from "./Post";

interface MegaMenuItem {
  key: string;
  icon: StaticImageData;
  title?: string;
  description?: string;
}

const MegaMenu = () => {
  const global = getNamespace(LanguageFile.GLOBAL);

  const DESCRIPTION: Record<
    string,
    {component: JSX.Element; image: StaticImageData}
  > = {
    find: {
      component: <Find/>,
      image: MegaMenuImage.jobBg,
    },
    post: {
      component: <Post/>,
      image: MegaMenuImage.buyerJob,
    },
    chat: {
      component: <Chat/>,
      image: MegaMenuImage.chatToHire,
    },
    hire: {
      component: <Hiring/>,
      image: MegaMenuImage.companyTh,
    },
    business: {
      component: <Business/>,
      image: MegaMenuImage.b2b,
    },
  };

  const megaFreelancer: MegaMenuItem[] = [
    {
      key: "find",
      icon: MegaMenuImage.search,
      title: global?.labelMenuOption11,
      description: global?.hintLabelMenuOptionFindHire,
    },
    {
      key: "post",
      icon: MegaMenuImage.job,
      title: global?.labelMenuOption12,
      description: global?.hintLabelMenuOptionSearchJobBoard,
    },
    {
      key: "chat",
      icon: MegaMenuImage.chat,
      title: global?.labelMenuOption13,
      description: global?.hintFreelanceSearchAssistant,
    },
  ];

  const megaBusiness: MegaMenuItem[] = [
    {
      key: "hire",
      icon: MegaMenuImage.company,
      title: global?.labelMenuOption21,
      description: global?.hintHireOnBehalf,
    },
    {
      key: "business",
      icon: MegaMenuImage.business,
      title: global?.labelMenuOption22,
      description: global?.hintFreelanceServicesBusiness,
    },
  ];

  const [hoveredItem, setHoveredItem] = useState<
    keyof typeof DESCRIPTION | null
  >("find");

  return (
    <div className="grid-container-desktop w-full">
      <div className="col-start-2 col-end-3 flex">
        <div className="flex flex-col gap-2 ">
          <div className="">
            <div className="items-center mb-2 flex gap-x-2">
              <FontAwesomeIcon
                icon={faStarAndCrescent}
                className="w-3 h-3 inline-flex items-center justify-center cursor-pointer"
              />
              <span className="text-[0.875rem] font-semibold text-[rgba(43,50,59,.6)]">
                {global?.tittleHeaderMenuSection1}
              </span>
            </div>
            {megaFreelancer.map((freelancer, index) => (
              <div
                onMouseEnter={() => setHoveredItem(freelancer.key)}
                onMouseLeave={() => setHoveredItem(freelancer.key)}
                key={index}
                className={`hover:bg-[#F6F9FE] ${
                  freelancer.key === hoveredItem && "bg-[#F6F9FE]"
                }`}
              >
                <Link prefetch={false}
                      href="#"
                      className="w-[450px] rounded-md gap-[1.5rem] flex items-center p-4"
                >
                  <Image src={freelancer.icon} alt="search" className="w-9"/>
                  <div className="gap-x-1 flex flex-col flex-1 ">
                    <span
                      className={`text-[0.875rem] font-medium text-text-primary ${
                        freelancer.key === hoveredItem && "text-third"
                      }`}
                    >
                      {freelancer.title}
                    </span>
                    <span className="text-[0.75rem] text-[rgba(43,50,59,.6)]">
                      {freelancer.description}
                    </span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-2 h-2 inline-flex items-center justify-center cursor-pointer"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="">
            <div className="items-center mb-2 flex gap-x-2">
              <FontAwesomeIcon
                icon={faBuilding}
                className="w-3 h-3  inline-flex items-center justify-center cursor-pointer"
              />
              <span className="text-[0.875rem] font-semibold text-[rgba(43,50,59,.6)]">
                {global?.tittleHeaderMenuSection2}
              </span>
            </div>
            {megaBusiness.map((freelancer, index) => (
              <div
                onMouseEnter={() => setHoveredItem(freelancer.key)}
                onMouseLeave={() => setHoveredItem(freelancer.key)}
                key={index}
                className={`hover:bg-[#F6F9FE] ${
                  freelancer.key === hoveredItem && "bg-[#F6F9FE]"
                }`}
              >
                <Link prefetch={false}
                      href="#"
                      className="w-[450px] rounded-md gap-[1.5rem] flex items-center p-4"
                >
                  <Image src={freelancer.icon} alt="search" className="w-9"/>
                  <div className="gap-x-1 flex flex-col flex-1">
                    <span
                      className={`text-[0.875rem] font-medium text-text-primary ${
                        freelancer.key === hoveredItem && "text-third"
                      }`}
                    >
                      {freelancer.title}
                    </span>
                    <span className="text-[0.75rem] text-[rgba(43,50,59,.6)]">
                      {freelancer.description}
                    </span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-2 h-2 inline-flex items-center justify-center cursor-pointer"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div>
          <hr className="w-[0.0625rem] mx-8 h-full inline-block bg-[#e8eeea] m-0"/>
        </div>
        {hoveredItem && DESCRIPTION[hoveredItem]?.component}
        <div className="flex flex-col mt-8 ml-8">
          {hoveredItem && (
            <Image
              src={DESCRIPTION[hoveredItem]?.image}
              alt="job"
              className="align-top"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
