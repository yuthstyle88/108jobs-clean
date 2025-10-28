"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import ChatWrapper from "@/containers/ChatWrapper";

const Chat = () => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const onToggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="relative w-full h-full bg-white">
            {/* Mobile: Show ChatWrapper (hidden on desktop) */}
            <div className="md:hidden h-full pt-6">
                <ChatWrapper
                    isSidebarOpen={true}
                    onToggleSidebar={onToggleSidebar}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </div>

            {/* Desktop: Show placeholder (hidden on mobile) */}
            <div className="hidden md:flex h-full items-center justify-center text-gray-500 p-4">
                {t("profileChat.selectConversation")}
            </div>
        </div>
    );
};

export default Chat;