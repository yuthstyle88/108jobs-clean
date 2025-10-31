"use client";

import { useTranslation } from "react-i18next";

const Chat = () => {
    const { t } = useTranslation();

    return (
        <div className="relative w-full h-full bg-white">
            {/* Desktop: Show placeholder (hidden on mobile) */}
            <div className="hidden md:flex h-full items-center justify-center text-gray-500 p-4">
                {t("profileChat.selectConversation")}
            </div>
        </div>
    );
};

export default Chat;