"use client";

import React, {useRef, useState} from "react";
import Link from "next/link";
import {AnimatePresence, motion} from "framer-motion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBriefcase,
    faCircleQuestion,
    faComments,
    faFileContract,
    faGlobe,
    faShieldHalved,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import LanguageBottomSheet from "@/containers/SpBottomTab";
import {useTranslation} from "react-i18next";
import {getAppName} from "@/utils/appConfig";
import {UserService} from "@/services";
import {DoorClosedIcon} from "lucide-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const MobileSidebar: React.FC<Props> = ({isOpen, onClose}) => {
    const {t} = useTranslation();
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const [showLang, setShowLang] = useState(false);
    const logout = () => UserService.Instance.logout();

    // ป้องกันการกดปิด/เปิดรัว ๆ จาก overlay หรือปุ่มปิดที่ทำให้แอนิเมชันซ้อนจนหน่วง
    const lastCloseTsRef = useRef(0);
    const handleClose = () => {
        const now = Date.now();
        if (now - lastCloseTsRef.current < 400) return; // กันสแปม 400ms
        lastCloseTsRef.current = now;
        onClose();
    };

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
                        onClick={handleClose}
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
                                onClick={handleClose}
                                aria-label="Close sidebar"
                            >
                                <FontAwesomeIcon icon={faXmark} className="w-5 h-5 text-gray-600"/>
                            </button>
                        </div>

                        {/* Navigation links */}
                        <nav className="flex flex-col p-4 space-y-3">
                            {isLoggedIn && (
                                <Link
                                    href={`/chat`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                    onClick={handleClose}
                                >
                                    <FontAwesomeIcon icon={faComments} className="w-5 h-5 text-primary"/>
                                    <span className="font-medium">{t("global.menuChat")}</span>
                                </Link>
                            )}


                            <Link
                                href={`/job-board`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                onClick={handleClose}
                            >
                                <FontAwesomeIcon icon={faBriefcase} className="w-5 h-5 text-primary"/>
                                <span className="font-medium">{t("global.menuJobBoard")}</span>
                            </Link>

                            <Link
                                href={`/content/terms`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                onClick={handleClose}
                            >
                                <FontAwesomeIcon icon={faFileContract} className="w-5 h-5 text-primary"/>
                                <span className="font-medium">{t("global.labelTermsOfService")}</span>
                            </Link>

                            <Link
                                href={`/content/privacy`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                onClick={handleClose}
                            >
                                <FontAwesomeIcon icon={faShieldHalved} className="w-5 h-5 text-primary"/>
                                <span className="font-medium">{t("global.labelPrivacyPolicy")}</span>
                            </Link>

                            <Link
                                href={`/content/how`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                onClick={handleClose}
                            >
                                <FontAwesomeIcon icon={faCircleQuestion} className="w-5 h-5 text-primary"/>
                                <span className="font-medium">{t("how.label")}</span>
                            </Link>

                            <Link
                                href={`/login`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-gray-700"
                                onClick={logout}
                            >
                                <DoorClosedIcon className="w-5 h-5 text-primary"/>
                                <span>{t("global.menuLogout")}</span>
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