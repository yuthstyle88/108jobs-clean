"use client";
import {AssetIcon} from "@/constants/icons";
import {ProfileImage} from "@/constants/images";
import {LANGUAGES} from "@/constants/language";
import LanguageBottomSheet from "@/containers/SpBottomTab";
import {useLanguage} from "@/contexts/LanguageContext";
import {useToggle} from "@/hooks/useToggle";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import UserProfileSection from "../Header/components/UserProfileSection";
import LanguageDropdown from "../LanguageDropDown";

import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {useAuthInfo} from "@/hooks/authenticate-api/useAuthInfo";


const RewardHeader = () => {
  const {isLoggedIn} = useAuthInfo();

  const [showLang, setShowLang] = useState(false);
  const {lang} = useLanguage();
  const {isOpen, toggle, close} = useToggle();
  const currentLang = LANGUAGES[lang as keyof typeof LANGUAGES];

  const {person} = useMyUser();
  return (
    <header className="sticky top-0 z-[999] w-full transition-all duration-300 bg-transparent">
      <nav className="mx-3 sm:mx-[1.5rem] flex items-center justify-between h-auto min-h-[70px] py-4 ">
        {/* Logo */}
        <section className="flex items-center gap-x-4 w-full md:w-auto">
          <Link prefetch={false} href="/" className="shrink-0">
            <Image
              src={AssetIcon.logo}
              alt="logo"
              className="w-full h-full"
            />
          </Link>
        </section>

        {/* Right side */}
        <section className="flex items-center gap-4 w-full justify-end">
          {/* Language switch */}
          <div className="hidden sm:block">
            <LanguageDropdown/>
          </div>
          <div className="block sm:hidden">
            <button
              onClick={() => setShowLang(true)}
              className="flex-1 flex items-center justify-center p-2 text-white cursor-pointer"
            >
              <Image
                src={currentLang.flag}
                alt={currentLang.label}
                width={30}
                height={30}
              />
            </button>
          </div>

          {/* Profile (mobile) */}
          <Link
            prefetch={false}
            href="/profile"
            className="flex sm:hidden items-center justify-center p-2 text-white text-[24px] cursor-pointer"
          >
            <Image
              src={person?.avatar || ProfileImage.avatar}
              alt="avatar"
              className="rounded-full w-8 h-8"
              width={500}
              height={500}
            />
          </Link>

          {/* Profile (desktop) */}
          {isLoggedIn && (
            <div className="hidden sm:block">
              <div className="relative px-4">
                <button
                  onClick={toggle}
                  className="flex items-center justify-center gap-2 w-12 h-12 rounded-full"
                >
                  <Image
                    src={person?.avatar || ProfileImage.avatar}
                    alt="avatar"
                    className="rounded-full"
                    width={500}
                    height={500}
                  />
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="w-[14px] h-[14px] text-white"
                  />
                </button>

                {isOpen && (
                  <>
                    <UserProfileSection />
                    <div
                      className="fixed inset-0 z-40"
                      onClick={close}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      </nav>

      <LanguageBottomSheet
        open={showLang}
        onClose={() => setShowLang(false)}
      />
    </header>
  );
};

export default RewardHeader;
