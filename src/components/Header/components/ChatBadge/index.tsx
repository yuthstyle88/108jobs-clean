import {faComment} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {useTotalUnread} from "@/modules/chat/utils";

const ChatBadge = () => {
    // Compute unread count from store via chat module
    const unreadCount = useTotalUnread();

    return (
        <Link prefetch={false}
              href="/chat"
              className="relative text-white text-sm hover:text-white px-3"
        >
            <FontAwesomeIcon
                icon={faComment}
                className="w-[24px] h-[24px] text-white"
            />
            {unreadCount > 0 && (
                <span
                    className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 text-[12px] leading-[20px] text-white bg-red-500 rounded-full flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
            )}
        </Link>
    );
};

export default ChatBadge;
