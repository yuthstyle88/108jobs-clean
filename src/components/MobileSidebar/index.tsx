"use client";

import React, {useState} from "react";
import Link from "next/link";
import {motion, AnimatePresence} from "framer-motion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faComments,
    faFileContract,
    faShieldHalved,
    faCircleQuestion,
    faBriefcase,
    faGlobe
} from "@fortawesome/free-solid-svg-icons";
import LanguageBottomSheet from "@/containers/SpBottomTab";
import {useTranslation} from "react-i18next";
import {getAppName} from "@/utils/appConfig";
import {UserService} from "@/services";
import {useLanguage} from "@/contexts/LanguageContext";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const MobileSidebar: React.FC<Props> = ({isOpen, onClose}) => {
    const {t} = useTranslation();
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const lang =  useLanguage();
  const [showLang, setShowLang] = useState(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Background overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[800]" // Increased z-index
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        onClick={onClose}
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        className="fixed top-0 left-0 right-0 z-[1002] bg-white rounded-b-3xl shadow-xl" // Increased z-index
                        initial={{y: "-100%"}}
                        animate={{y: 0}}
                        exit={{y: "-100%"}}
                        transition={{type: "spring", damping: 20, stiffness: 300}}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                            <button
                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                                onClick={onClose}
                                aria-label="Close sidebar"
                            >
                                <FontAwesomeIcon icon={faXmark} className="w-5 h-5 text-gray-600"/>
                            </button>
                        </div>

                        {/* Navigation links */}
                        <nav className="flex flex-col p-4 space-y-3">
                            {isLoggedIn && (
                                <Link
                                    href={`/${lang}/chat`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                    onClick={onClose}
                                >
                                    <FontAwesomeIcon icon={faComments} className="w-5 h-5 text-primary" />
                                    <span className="font-medium">{t("global.menuChat")}</span>
                                </Link>
                            )}


                            <Link
                                href={`/${lang}/job-board`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                onClick={onClose}
                            >
                                <FontAwesomeIcon icon={faBriefcase} className="w-5 h-5 text-primary"/>
                                <span className="font-medium">{t("global.menuJobBoard")}</span>
                            </Link>

                            <Link
                                href={`/${lang}/content/terms`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                onClick={onClose}
                            >
                                <FontAwesomeIcon icon={faFileContract} className="w-5 h-5 text-primary"/>
                                <span className="font-medium">{t("global.labelTermsOfService")}</span>
                            </Link>

                            <Link
                                href={`/${lang}/content/privacy`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                onClick={onClose}
                            >
                                <FontAwesomeIcon icon={faShieldHalved} className="w-5 h-5 text-primary"/>
                                <span className="font-medium">{t("global.labelPrivacyPolicy")}</span>
                            </Link>

                            <Link
                                href={`/${lang}/content/how`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                onClick={onClose}
                            >
                                <FontAwesomeIcon icon={faCircleQuestion} className="w-5 h-5 text-primary"/>
                                <span className="font-medium">{t("how.label")}</span>
                            </Link>
                        </nav>

                        {/* Divider */}
                        <div className="mx-4 border-t border-gray-200 my-3"/>

                        {/* Language selector */}
                        <div className="px-4 pb-5">
                            <button
                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-700"
                                onClick={() => setShowLang(true)}
                            >
                                <FontAwesomeIcon icon={faGlobe} className="w-5 h-5 text-primary"/>
                                <span className="font-medium flex-1 text-left">{t("global.menuLanguage")}</span>
                                <span className="text-sm text-gray-500">{t("global.change")}</span>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
                            © {new Date().getFullYear()} {getAppName()}
                        </div>
                    </motion.div>

                    {/* Language selector bottom sheet */}
                    <LanguageBottomSheet open={showLang} onClose={() => setShowLang(false)}/>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileSidebar;