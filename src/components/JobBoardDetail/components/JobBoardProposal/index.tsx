"use client";

import {ProfileImage} from "@/constants/images";
import {Pagination} from "@/components/Pagination";
import {useHttpGet} from "@/hooks/useHttpGet";
import type {CommentView} from "lemmy-js-client";
import Image from "next/image";
import React, {useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {dmRoomId} from "@/utils/helpers";
import {HttpService} from "@/services/HttpService";
import {MessageCircleMore} from "lucide-react";
import {getLocale} from "@/utils/date";
import {useTranslation} from "react-i18next";
import LoadingMultiCircle from "@/components/Common/Loading/LoadingMultiCircle";
import {useHttpPost} from "@/hooks/useHttpPost";

type JobBoardProposalProps = {
    postId?: number;
    jobCreatorId?: number;
};

const JobBoardProposal = ({postId, jobCreatorId}: JobBoardProposalProps) => {
    const {t} = useTranslation();
    const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);
    const [startingChatFor, setStartingChatFor] = useState<number | null>(null);

    const {data: proposals, pagination, isMutating: isLoading} = useHttpGet("getComments", {
        pageCursor: currentCursor,
        ...(postId ? {postId} : {}),
    });
    const {execute: createChatRoom} = useHttpPost("createChatRoom");
    const {person: currentUser} = useMyUser();
    const route = useRouter();
    const params = useParams();
    const currentLang = (params?.lang as string) || 'th';
    const currentLocale = getLocale(currentLang);

    const handlePageChange = (pageCursor: string | null) => {
        setCurrentCursor(pageCursor || undefined);
    };

    const handleStartChat = async (cv: CommentView) => {
        const partnerPersonId = (cv as any)?.creator?.id as number | undefined;
        const currentUserId = currentUser?.id;
        if (!partnerPersonId || !currentUserId) return;
        if (partnerPersonId === currentUserId) return;

        const roomId = dmRoomId(currentUserId, partnerPersonId, cv.post.id.toString());
        const roomName = `${cv.post.name}`;

        try {
            setStartingChatFor(partnerPersonId);
            try {
                await createChatRoom({
                    partnerPersonId,
                    roomId,
                    ...(cv.post.id ? {postId: cv.post.id} : {}),
                    ...(cv?.comment?.id ? {currentCommentId: cv.comment.id} : {}),
                    roomName,
                });
            } catch (e) {
                // If room already exists or API fails, proceed to navigate anyway
            }
            route.push(`/${currentLang}/chat/message/${roomId}`);
        } finally {
            setStartingChatFor(null);
        }
    };

    if (isLoading) {
        return <LoadingMultiCircle/>
    }

    return (
        <main className="mt-10 text-[18px] text-text-secondary flex flex-col gap-6 max-w-4xl mx-auto">
            {!isLoading && (!proposals?.comments || proposals.comments.length === 0) && (
                <div className="text-center text-lg font-medium text-text-secondary bg-gray-50 py-6 rounded-lg">
                    {t("jobBoardDetail.noProposal")}
                </div>
            )}

            {proposals?.comments && proposals.comments.length > 0 && (
                <div className="space-y-6">
                    {proposals.comments.map((cv: CommentView) => (
                        <div
                            key={cv.comment.id}
                            className="p-6 rounded-lg border border-border-secondary bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <section className="grid grid-cols-[3fr_1fr] gap-6 md:gap-8">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row items-center gap-3">
                                        <Image
                                            src={cv.creator?.avatar || ProfileImage.avatar}
                                            alt={cv.creator?.name || "avatar"}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 object-cover rounded-full border border-border-secondary"
                                        />
                                        <div>
                                            <p className="text-lg font-semibold text-text-primary font-sans">
                                                {cv.creator?.displayName || cv.creator?.name || "Unknown"}
                                            </p>
                                            <p className="text-sm text-text-secondary font-sans">
                                                @{cv.creator?.name || "unknown"}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-base font-normal text-text-primary font-sans break-words whitespace-pre-wrap leading-relaxed">
                                        {cv.comment.content}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="text-sm text-text-secondary font-sans">
                                            {new Date(cv.comment.publishedAt).toLocaleString(currentLocale, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: true,
                                            })}
                                        </p>
                                    </div>
                                    {currentUser?.id === jobCreatorId && (cv as any)?.creator?.id !== currentUser?.id && (
                                        <button
                                            type="button"
                                            onClick={() => handleStartChat(cv)}
                                            disabled={startingChatFor === (cv as any)?.creator?.id}
                                            className="self-end inline-flex items-center bg-primary text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-[#063a68] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Start chat with proposer"
                                            title="Start chat"
                                        >
                                            <MessageCircleMore className="w-4 h-4 mr-2"/>
                                            {startingChatFor === (cv as any)?.creator?.id ? "..." : t("profile.startChat")}
                                        </button>
                                    )}
                                </div>
                            </section>
                        </div>
                    ))}
                </div>
            )}

            {pagination && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        prevPage={pagination.prevPage}
                        nextPage={pagination.nextPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </main>
    );
};

export default JobBoardProposal;