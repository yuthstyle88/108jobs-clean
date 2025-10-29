"use client";

import {PostForm} from "@/components/Job/PostForm";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import NotFound from "@/components/Common/NotFound";
import {useParams} from "next/navigation";

export default function EditPostPage() {
    const { jobId, commentId } = useParams() as { jobId: string; commentId?: string };

    const {
        data: postResponse,
        isMutating: isLoading,
    } = useHttpGet("getPost", {
        id: Number(jobId),
        commentId: commentId ? Number(commentId) : undefined,
    });

    if (isLoading) return <LoadingBlur text="Loading post..." />;
    if (!postResponse?.postView) return <NotFound />;

    return (
        <main className="w-full min-h-screen bg-[#F6F9FE] pt-16">
            <PostForm mode="edit" postView={postResponse.postView} />
        </main>
    );
}
