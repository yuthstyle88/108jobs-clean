"use client";
import {useEffect, useState} from 'react';
import {UserService} from "@/services";
import Link from "next/link";
import LanguageDropdown from "@/components/LanguageDropDown";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface ClientOnlyGuestSectionProps {
    globalLanguageData?: Record<string, string>;
}

const ClientOnlyGuestSection = ({globalLanguageData}: ClientOnlyGuestSectionProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => setIsClient(true), 0);
        return () => clearTimeout(id);
    }, []);

    if (!isClient) {
        return <div></div>;
    }

    const role = UserService.Instance.authInfo?.claims?.role || "Guest";
    const isGuest = role === "Guest";

    if (!isGuest) {
        return null;
    }

    return (
        <>
            <div className="group">
                <div className="relative">
                    <div className="relative">
                        <div
                            className="text-[14px] text-[#1d6cd2] px-3 py-2 bg-white rounded-md font-medium flex flex-row items-center gap-2 cursor-pointer">
                            {globalLanguageData?.labelEmploymentButton}
                            <span className="inline-block">
                <FontAwesomeIcon icon={faChevronDown}/>
              </span>
                        </div>
                    </div>
                    <div className="absolute left-0 right-0 w-[110px] bg-transparent h-4"></div>
                </div>

            </div>
            <Link prefetch={false}
                  href="/job-board"
                  className="text-white text-sm hover:bg-blue-800 hover:text-white px-3"
            >
                {globalLanguageData?.labelJobBoardCenter}
            </Link>
            <Link prefetch={false}
                  href="/login"
                  className="text-white text-sm hover:bg-blue-800 hover:text-white"
            >
                {globalLanguageData?.labelSignInButton}
            </Link>
            <LanguageDropdown/>
        </>
    );
};

export default ClientOnlyGuestSection;