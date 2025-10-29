"use client";
import {Pagination} from "@/components/Pagination";
import {Badge} from "@/components/ui/Badge";
import {ProfileImage} from "@/constants/images";
import {formatDateTime} from "@/utils";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import ConfirmCloseJob from "@/components/Common/Modal/ConfirmCloseJobsModal";
import JobBoardTab from "@/components/JobBoardTab";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import {useTranslation} from "react-i18next";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";

const MyJobs = () => {
    const {t} = useTranslation();
    const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);
    const router = useRouter();

    const {
        data: jobPosts,
        pagination,
        isMutating: isJobsLoading,
    } = useHttpGet("listPersonCreated", {
        pageCursor: currentCursor,
    });

    const [selectedJob, setSelectedJob] = useState<{ id: string } | null>(null);
    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedJob) {
            setSelectedJob(null);
        }
    };

    const handlePageChange = (pageCursor: string | null) => {
        setCurrentCursor(pageCursor || undefined);
    };

    const getStatusBadge = (status: boolean) => {
        switch (status) {
            case false:
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200">
                        {t("global.open")}
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200">
                        {t("global.closed")}
                    </Badge>
                );
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                    <div className="border-b border-gray-200 pb-6 mb-8">
                        <JobBoardTab />
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                        {isJobsLoading ? (
                            <div className="py-20 text-center">
                                <LoadingBlur text={t("profileJob.loadingJobs")} />
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderTitle")}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderBudget")}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderStatus")}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderPostDate")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {t("profileJob.tableHeaderProposals")}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                                        {t("profileJob.tableHeaderDeadline")}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderActions")}
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {(jobPosts as any)?.created ? (
                                    (jobPosts as any).created.length > 0 ? (
                                        (jobPosts as any).created.map((job: any) => (
                                            <tr
                                                key={job.post.id}
                                                onClick={() => router.push(`/job-board/${job.post.id}`)}
                                                className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                            >
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="h-5 w-5 text-gray-400 mr-3"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M9 12h6m-3-3v6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <Link
                                                            prefetch={false}
                                                            href={`/job-board/${job.post.id}`}
                                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 max-w-[300px] line-clamp-1"
                                                        >
                                                            {job.post.name}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {job.post.budget.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    {getStatusBadge(job.post.pending)}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                                                    {formatDateTime(job.post.publishedAt, "datetime")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-text-primary">
                                                    {job.post.comments}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                                                    {formatDateTime(job.post.deadline || "", "date")}
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm flex space-x-4">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/job-board/edit/${job.post.id}`);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 px-3 py-1 rounded-md hover:bg-blue-50"
                                                    >
                                                        {t("profileJob.tableHeaderActionEdit")}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-16 text-center text-gray-500 text-base"
                                            >
                                                {t("profileJob.noJob")}
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-16 text-center text-gray-500 text-base"
                                        >
                                            {t("profileJob.noJob")}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {pagination && (
                        <div className="mt-10 flex justify-center">
                            <Pagination
                                prevPage={pagination.prevPage}
                                nextPage={pagination.nextPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-12 h-48 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl overflow-hidden flex justify-center items-center shadow-lg transition-all duration-300 hover:shadow-xl">
                    <Image
                        src={ProfileImage.jobBoard}
                        alt="Job Board"
                        className="transition-transform duration-500 hover:scale-110"
                        priority
                    />
                </div>
            </div>
            <ConfirmCloseJob
                isDeleteLoading={false}
                isOpen={!!selectedJob}
                onClose={handleCloseModal}
                handleConfirmChange={handleConfirmDelete}
            />
        </div>
    );
};

export default MyJobs;