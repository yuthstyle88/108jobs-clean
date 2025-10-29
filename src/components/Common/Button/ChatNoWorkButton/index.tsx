import React from "react";
import {Person, PersonId} from "@/lib/lemmy-js-client/src";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/navigation";
import {dmRoomId} from "@/utils/helpers";
import {MessageCircle} from "lucide-react";
import {useHttpPost} from "@/hooks/useHttpPost";

interface ChatNoWorkButtonProps {
    profile: Person;
    currentUserId?: PersonId;
}

const ChatNoWorkButton: React.FC<ChatNoWorkButtonProps> = ({profile, currentUserId}) => {
    const {t} = useTranslation();
    const router = useRouter();
    const {execute: createChatRoom} = useHttpPost("createChatRoom");
    const handleChatClick = async () => {
        try {
            if (!currentUserId || !profile?.id || currentUserId === profile.id) return;
            const roomId = dmRoomId(currentUserId, profile.id, undefined);
            try {
                await createChatRoom({partnerPersonId: profile.id, roomId});
            } catch (e) {
                // If room already exists or API fails, proceed to navigate anyway
            }
            router.push(`/chat/message/${roomId}`);
        } catch (err) {
            try {
                const fallbackId = dmRoomId(currentUserId, profile.id, undefined);
                router.push(`/chat/message/${fallbackId}`);
            } catch {
            }
        }
    };

    return (
        <div className="mt-6">
            <button
                onClick={handleChatClick}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                aria-label={`Start a chat with ${profile?.name}`}
            >
                <MessageCircle className="w-5 h-5"/>
                <span>{t("profile.startChat") || "Start Chat"}</span>
            </button>
        </div>
    );
};

export default ChatNoWorkButton;