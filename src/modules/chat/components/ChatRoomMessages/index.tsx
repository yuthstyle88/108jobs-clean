"use client";

import type {ChatMessage, LocalUserId} from "lemmy-js-client";
import ChatMessageItem from "../ChatMessageBubble";
import {StaticImageData} from "next/image";
import {Virtuoso, VirtuosoHandle} from "react-virtuoso";
import React from "react";
import {useParams} from "next/navigation";
import {formatDateToLong} from "@/utils";
import {getLocale} from "@/utils/date";
import {useTranslation} from "react-i18next";

interface ChatRoomMessagesProps {
    messages: ChatMessage[];
    partnerAvatar: StaticImageData | string;
    customScrollParent?: HTMLElement | null;
    onTopReached?: () => void;
    hasMore?: boolean;
    isFetching?: boolean;
    onAtBottomChange?: (isAtBottom: boolean) => void;
    initialLoadDone?: boolean;
    partnerId: LocalUserId;
}

const ChatRoomMessages: React.FC<ChatRoomMessagesProps> = ({
                                                               messages,
                                                               partnerAvatar,
                                                               customScrollParent,
                                                               onTopReached,
                                                               hasMore,
                                                               isFetching,
                                                               onAtBottomChange,
                                                               initialLoadDone = false,
                                                               partnerId
                                                           }) => {
    const {t} = useTranslation();
    const params = useParams();

    const currentLang = (params?.lang as string) || "th";
    const currentLocale = getLocale(currentLang);
    const data = React.useMemo(() => [...messages], [messages]);
    const virtuosoRef = React.useRef<VirtuosoHandle | null>(null);
    const [isAtBottom, setIsAtBottom] = React.useState(true);

    const prevLengthRef = React.useRef(data.length);
    const headIdRef = React.useRef<string | null>(
        data.length ? String((data[0] as any)?.id ?? '') : null
    );
    const tailIdRef = React.useRef<string | null>(
        data.length ? String((data[data.length - 1] as any)?.id ?? '') : null
    );

    const rangeRef = React.useRef({startIndex: 0, endIndex: 0});
    const hasMoreRef = React.useRef(hasMore);
    const isFetchingRef = React.useRef(isFetching);
    const initialLoadDoneRef = React.useRef(initialLoadDone);

    React.useEffect(() => {
        hasMoreRef.current = hasMore;
        isFetchingRef.current = isFetching;
    }, [hasMore, isFetching]);

    React.useEffect(() => {
        initialLoadDoneRef.current = initialLoadDone;
    }, [initialLoadDone]);

    const handleTopReached = React.useCallback(() => {
        if (!hasMoreRef.current || isFetchingRef.current) return;
        onTopReached?.();
    }, [onTopReached]);

    const handleRangeChanged = React.useCallback((range: { startIndex: number; endIndex: number }) => {
        rangeRef.current = range;
        if (!initialLoadDoneRef.current && range.startIndex === 0) {
            return;
        }
        if (range.startIndex <= 10 && hasMoreRef.current && !isFetchingRef.current) {
            handleTopReached();
        }
    }, [handleTopReached]);

    React.useEffect(() => {
        const prevLength = prevLengthRef.current;
        const newLength = data.length;
        const added = newLength - prevLength;

        const prevHeadId = headIdRef.current;
        const newHeadId = newLength ? String((data[0] as any)?.id ?? '') : null;

        const prevTailId = tailIdRef.current;
        const newTailId = newLength ? String((data[newLength - 1] as any)?.id ?? '') : null;

        prevLengthRef.current = newLength;
        headIdRef.current = newHeadId;
        tailIdRef.current = newTailId;

        if (added <= 0) return;

        const isPrepend = prevHeadId !== newHeadId;
        const isAppend = prevTailId !== newTailId;

        if (isPrepend) {
            setTimeout(() => {
                virtuosoRef.current?.scrollToIndex({
                    index: added,
                    behavior: 'auto',
                    align: 'start',
                });
            }, 0);
        } else if (isAppend || isAtBottom) {
            setTimeout(() => {
                virtuosoRef.current?.scrollToIndex({
                    index: newLength - 1,
                    behavior: 'auto',
                    align: 'end',
                });
            }, 0);
        }
    }, [data, isAtBottom]);

    return (
        <>
            <style jsx global>{`
                @keyframes dot-flashing {
                    0% {
                        opacity: 0.2;
                        transform: scale(0.8);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                    100% {
                        opacity: 0.2;
                        transform: scale(0.8);
                    }
                }

                .dot-flashing {
                    animation: dot-flashing 1.2s infinite ease-in-out;
                    background: #042b4a;
                }

                .dot-flashing:nth-child(2) {
                    animation-delay: 0.4s;
                }

                .dot-flashing:nth-child(3) {
                    animation-delay: 0.8s;
                }
            `}</style>
            <Virtuoso
                ref={virtuosoRef}
                data={data}
                firstItemIndex={0}
                initialTopMostItemIndex={data.length > 0 ? data.length - 1 : 0}
                followOutput={true}
                customScrollParent={customScrollParent ?? undefined}
                computeItemKey={(_index, msg) => {
                    const m: any = msg as any;
                    const id = m?.id ?? m?.clientId;
                    if (id != null) return String(id);
                    const created = m?.createdAt ?? '';
                    const sender = m?.senderId ?? '';
                    return `${created}|${sender}`;
                }}
                alignToBottom
                rangeChanged={handleRangeChanged}
                atTopStateChange={(atTop) => {
                    // Intentionally empty to avoid double fetching
                }}
                atBottomStateChange={(bottom) => {
                    setIsAtBottom(bottom);
                    onAtBottomChange?.(bottom);
                }}
                components={{
                    Footer: () => <div className="h-4 sm:h-6"/>, // Responsive footer height
                    Header: hasMore
                        ? () => (
                            <div className="w-full flex justify-center my-2 sm:my-3">
                                <div
                                    className="inline-block px-4 sm:px-5 py-2 text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 text-xs sm:text-sm font-medium text-center rounded-full min-w-[100px] sm:min-w-[120px] shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent isFetching ? 'border-blue-300' : ''">
                                    {isFetching ? (
                                        <div className="flex space-x-1.5 justify-center items-center">
                                            <span className="dot-flashing w-2.5 h-2.5 rounded-full"></span>
                                            <span className="dot-flashing w-2.5 h-2.5 rounded-full"></span>
                                            <span className="dot-flashing w-2.5 h-2.5 rounded-full"></span>
                                        </div>
                                    ) : (
                                        t("profileChat.previousMessages")
                                    )}
                                </div>
                            </div>
                        )
                        : undefined,
                }}
                itemContent={(index, msg) => {
                    const currentDate = formatDateToLong(msg.createdAt, currentLocale);
                    const prev = index > 0 ? data[index - 1] : null;
                    const prevDate = prev ? formatDateToLong(prev.createdAt, currentLocale) : null;
                    const showDate = currentDate !== prevDate;

                    return (
                        <div className="px-2 sm:px-4 last:mb-0"> {/* Responsive padding */}
                            {showDate && (
                                <div className="w-full flex justify-center my-2 sm:my-3">
                                    <div
                                        className="inline-block px-2 sm:px-3 py-1 min-w-[80px] sm:min-w-[100px] text-gray-600 bg-gray-100 text-xs sm:text-sm font-medium text-center rounded-full"
                                    >
                                        {currentDate}
                                    </div>
                                </div>
                            )}
                            <ChatMessageItem message={msg} partnerAvatar={partnerAvatar} partnerId={partnerId}/>
                        </div>
                    );
                }}
                className="w-full h-full overflow-x-hidden" // Replaced inline style with className
            />
        </>
    );
};


export default ChatRoomMessages;