"use client";

import React from "react";
import AvatarBadge from "@/components/AvatarBadge";
import { LocalUserId } from "lemmy-js-client";
import { ArrowLeft } from "lucide-react";
import { usePeerOnline } from "@/modules/chat/store/presenceStore";
import { useRouter, useParams } from "next/navigation";

interface ChatHeaderProps {
    avatarUrl?: string;
    displayName: string;
    partnerId: LocalUserId;
    typingText?: string;
    onToggleFlow?: () => void;
    isFlowOpen?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
                                                   avatarUrl,
                                                   displayName,
                                                   typingText,
                                                   partnerId,
                                                   onToggleFlow,
                                                   isFlowOpen,
                                               }) => {
    const online = usePeerOnline(Number(partnerId) ?? 0);
    const router = useRouter();
    const params = useParams();
    const lang = params?.lang as string;

    // Navigate back to chat list
    const handleBackToChatList = () => {
        router.push(`/${lang}/chat`);
    };

    return (
        <div className="sticky top-0 z-20 border-b p-4 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
                {/* Back Button for Mobile */}
                <button
                    onClick={handleBackToChatList}
                    aria-label="Back to chat list"
                    className="flex sm:hidden p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <AvatarBadge
                    name={displayName}
                    avatarUrl={avatarUrl}
                    online={online}
                    isActive
                    size={40}
                />
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-primary truncate max-w-[140px] sm:max-w-[160px]">
                        {displayName}
                    </span>
                    {typingText && (
                        <span className="text-xs text-gray-500">{typingText}</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Show Flow Button — only visible on mobile */}
                <button
                    onClick={onToggleFlow}
                    className="sm:hidden whitespace-nowrap rounded-md bg-primary hover:bg-[#063a68] text-white text-xs px-3 py-2"
                    aria-label={isFlowOpen ? "Hide Flow" : "Show Flow"}
                >
                    {isFlowOpen ? "Hide Flow" : "Show Flow"}
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;