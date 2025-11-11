"use client";
import {AssetIcon} from "@/constants/icons";
import {useAuthInfo} from "@/hooks/api/authenticate/useAuthInfo";
import Image from "next/image";
import Link from "next/link";
import {useTranslation} from "react-i18next";
import LanguageDropdown from "../LanguageDropDown";
import UserProfileSection from "./components/UserProfileSection";
import {useScrollHandler} from "./hooks/useScrollHandler";

const Header = ({ type, forceShowSearch = false }: { type: string; forceShowSearch?: boolean }) => {
    const { isLoggedIn, userInfo } = useAuthInfo();
    const { t } = useTranslation();
    const { scrollY, showSearch } = useScrollHandler(forceShowSearch);
    const bg = scrollY > 0 ? "bg-primary" : type === "transparent" ? "bg-transparent" : "bg-primary";

    return (
        <header className={`fixed top-0 z-[999] w-full transition-all duration-300 ${bg}`}>
            <nav className="mx-4 sm:mx-6 lg:mx-8 flex flex-wrap items-center justify-between h-auto py-2">
                <section className="flex items-center gap-x-4 w-full sm:w-auto">
                    <div className="block md:hidden">
                        <Link prefetch={true} href="/" className="shrink-0">
                            <Image
                                src={AssetIcon.logo}
                                alt="logo"
                                className="w-16 h-16"
                                width={700}
                                height={700}
                                priority
                            />
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center gap-x-4 w-full md:w-auto">
                        <Link prefetch={true} href="/" className="shrink-0">
                            <Image
                                src={AssetIcon.logo}
                                alt="logo"
                                className="w-full h-full"
                                width={700}
                                height={700}
                                priority
                            />
                        </Link>
                    </div>
                </section>
                <section className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 justify-end">
                    {!isLoggedIn && (
                        <Link prefetch={false} href="/job-board" className="text-white text-sm hover:text-gray-200 hover:text-black">
                            {t("global.labelJobBoardCenter")}
                        </Link>
                    )}
                    {isLoggedIn && <UserProfileSection />}
                    {/* Admin Dashboard Button */}
                    {userInfo?.localUserView.localUser.admin && (
                        <Link
                            href="/admin/dashboard"
                            className="bg-amber-500 text-white text-sm px-3 py-1 rounded hover:bg-amber-200"
                        >
                            {t("global.labelAdminDashboard") || "Admin Dashboard"}
                        </Link>
                    )}
                    {!isLoggedIn && (
                        <>
                            <Link prefetch={false} href="/login" className="text-white text-sm hover:text-gray-200">
                                {t("global.labelSignInButton")}
                            </Link>
                            <Link prefetch={false} href="/register" className="text-white text-sm hover:text-gray-200">
                                {t("global.labelSignUpButton")}
                            </Link>
                        </>
                    )}
                    {!isLoggedIn && <LanguageDropdown />}
                </section>
            </nav>
        </header>
    );
};

export default Header;