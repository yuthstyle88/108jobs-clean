"use client";
import {ProfileImage} from "@/constants/images";
import {useLanguage} from "@/contexts/LanguageContext";
import {faMessage} from "@fortawesome/free-regular-svg-icons";
import {
    faCalendar,
    faFileContract,
    faGear,
    faGift,
    faIdCard,
    faListCheck,
    faMoneyBill1Wave,
    faRightFromBracket,
    faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect} from "react";
import {UserService} from "@/services";
import {useMyUser} from "@/hooks/api/profile/useMyUser";

interface SellerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SellerMenu = ({isOpen, onClose}: SellerMenuProps) => {
  const {person} = useMyUser();

  const {lang} = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/seller",
      label: "Overall",
      icon: faFileContract,
      target: "Self",
    },
    {
      href: "/chat",
      label: "Chat and order",
      icon: faMessage,
      target: "Blank",
    },
    {
      href: "/seller/project-management",
      label: "Order Management",
      icon: faListCheck,
      target: "Self",
    },
    {
      href: "/seller/account-statistics",
      label: "Stats",
      icon: faIdCard,
      target: "Self",
    },
    {
      href: "/seller/my-service",
      label: "My job",
      icon: faCalendar,
      target: "Self",
    },
    {
      href: "/seller/withdrawal",
      label: "Balance information",
      icon: faMoneyBill1Wave,
      target: "Self",
    },
    {
      href: "/reward/earn",
      label: "Freelance Rewards",
      icon: faGift,
      target: "Blank",
    },
  ];
  const menuSettingItems = [
    {
      href: `${lang}/user/${person?.name}`,
      label: "Freelancer profile",
      icon: faUserPen,
      target: "Blank",
    },
    {
      href: "/seller-account-setting/freelance-profile",
      label: "Account setting",
      icon: faGear,
      target: "Blank",
    },
  ];

  const logout = () => UserService.Instance.logout();

  useEffect(() => {
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      document.addEventListener("keydown",
        handleEscapeKey);
      return () => {
        document.removeEventListener("keydown",
          handleEscapeKey);
      };
    },
    [isOpen, onClose]);

  useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
      return () => {
        document.body.style.overflow = "auto";
      };
    },
    [isOpen]);

  return (
    <main className={`fixed z-50 ${isOpen ? "visible" : "invisible"}`}>
      <div
        className={`fixed top-[3rem] left-0 min-h-screen w-full sm:w-[560px] bg-white border-t-1 border-gray-500 shadow-xl transform transition-all duration-150 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col relative bg-white">
          <section className="flex gap-3 items-center flex-col pt-8 px-4 pb-1">
            <figure className="rounded-full overflow-hidden relative">
              <Image
                src={person?.avatar || ProfileImage.avatar}
                alt="avatar"
                width={80}
                height={80}
                className="rounded-full w-20 h-20  object-cover"
              />
            </figure>
            <div className="text-[0.875rem] font-semibold text-text-primary">
              {person?.name}
            </div>
          </section>
          <section className="flex flex-col gap-2 p-4">
            <Link prefetch={false} href="/" className="flex-1">
              <button className="py-2 w-full cursor-pointer bg-third text-white font-semibold rounded-md border-1 border-border-primary">
                Find freelancer
              </button>
            </Link>
            <Link prefetch={false} href="/job-board" className="flex-1">
              <button className="py-2 w-full cursor-pointer bg-white text-third font-semibold rounded-md border-1 border-border-primary">
                Job board
              </button>
            </Link>
          </section>
        </div>
        <ul className="flex flex-col gap-0 mt-3 m-0 p-0 list-none">
          {menuItems.map((item) => {
            const isActive = pathname === `/${lang}${item.href}`;
            return (
              <li
                key={item.href}
                className={`flex flex-row items-center gap-2 ${
                  isActive
                    ? "bg-secondary text-third border-l-4 border-primary"
                    : "bg-white text-text-secondary"
                } leading-[25px] cursor-pointer`}
              >
                <Link prefetch={false}
                      onClick={onClose}
                      target={item.target}
                      href={item.href}
                      className="px-5 py-4 flex-1"
                >
                  <div className="flex flex-row items-center gap-4">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`text-[18px] ${
                        isActive ? "text-third" : "text-text-secondary"
                      }`}
                    />
                    <span className="font-sans whitespace-nowrap text-[0.875rem] flex items-center">
                      {item.label}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
          <hr className="h-[1px] bg-border-secondary w-full inline-block"/>
          {menuSettingItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li
                key={item.href}
                className={`flex flex-row items-center gap-2 ${
                  isActive
                    ? "bg-secondary text-third border-l-4 border-primary"
                    : "bg-white text-text-secondary"
                } leading-[25px] cursor-pointer`}
              >
                <Link prefetch={false}
                      target={item.target}
                      href={item.href}
                      className="px-5 py-4 flex-1"
                >
                  <div className="flex flex-row items-center gap-4">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`text-[18px] ${
                        isActive ? "text-third" : "text-text-secondary"
                      }`}
                    />
                    <span className="font-sans whitespace-nowrap text-[0.875rem] flex items-center">
                      {item.label}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
          <hr className="h-[1px] bg-border-secondary w-full inline-block"/>
          <li className="flex flex-row items-center gap-2 bg-white text-text-secondary">
            <button onClick={logout} className="px-5 py-4 flex-1">
              <div className="flex flex-row items-center gap-4">
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="text-[18px] text-text-secondary"
                />
                <span className="font-sans whitespace-nowrap text-[0.875rem] flex items-center">
                  Sign out
                </span>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default SellerMenu;
