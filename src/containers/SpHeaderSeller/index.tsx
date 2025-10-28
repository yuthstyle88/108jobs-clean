"use client";
import {AssetIcon} from "@/constants/icons";
import {LANGUAGES} from "@/constants/language";
import {useLanguage} from "@/contexts/LanguageContext";
import {faBell} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AlignJustify, X} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import SellerMenu from "../SellerMenu";
import LanguageBottomSheet from "../SpBottomTab";

const SpSellerHeader = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [showLang, setShowLang] = useState(false);
  const {lang} = useLanguage();
  const currentLang = LANGUAGES[lang as keyof typeof LANGUAGES];

  return (
    <header className="fixed top-0 z-[999] w-full transition-all duration-300 h-[72px] border-b-1 border-gray-500 bg-white">
      <nav className="flex flex-row justify-between items-center gap-2 p-4 h-full">
        <div className="px-[1.125rem]">
          {isFilterOpen ? (
            <div onClick={() => setIsFilterOpen(false)}>
              <X className="text-gray-500 w-[20px] h-[22px]"/>
            </div>
          ) : (
            <div onClick={() => setIsFilterOpen(true)}>
              <AlignJustify className="text-gray-500 w-[20px] h-[22px]"/>
            </div>
          )}
        </div>
        <Link prefetch={false}
              href="/seller"
              className="overflow-hidden relative whitespace-nowrap flex self-center"
        >
          <Image
            src={AssetIcon.logoFreelancer}
            alt="avatar"
            width={140}
            height={40}
          />
        </Link>

        <div className="px-[1.125rem] flex flex-row items-center gap-2">
          <FontAwesomeIcon
            icon={faBell}
            className="text-gray-500 w-[24px] h-[24px]"
          />
          <button
            onClick={() => setShowLang(true)}
            className="flex-1 flex items-center justify-center p-2 text-white cursor-pointer"
          >
            <Image
              src={currentLang.flag}
              alt={currentLang.label}
              width={25}
              height={25}
            />
          </button>
        </div>
      </nav>
      <SellerMenu
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
      <LanguageBottomSheet open={showLang} onClose={() => setShowLang(false)}/>
    </header>
  );
};

export default SpSellerHeader;
