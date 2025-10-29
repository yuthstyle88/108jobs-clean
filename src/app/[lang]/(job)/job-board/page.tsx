"use client";
import {ProfileImage} from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {useCallback, useEffect, useMemo, useState} from "react";
import {debounce} from "lodash";
import {CommunityId, IntendedUse, JobType, PostSortType, SearchCombinedView,} from "lemmy-js-client";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import JobBoardTab from "@/components/JobBoardTab";
import {useTranslation} from "react-i18next";
import {
    formatBudget,
    formatDate,
    getCommunitiesAtLevel,
    getJobTypeLabel,
    toCamelCaseLastSegment
} from "@/utils/helpers";
import ErrorState from "@/components/ErrorState";
import {REQUEST_STATE} from "@/services/HttpService";
import {useCommunities} from "@/hooks/api/communities/useCommunities";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";

const ITEMS_PER_PAGE = 20;

interface FilterState {
    community: CommunityId | undefined;
    jobType: JobType | undefined;
    intendedUse: IntendedUse | undefined;
    budgetMin: number | undefined;
    budgetMax: number | undefined;
    sort: PostSortType | undefined;
}

const JobBoard = () => {
    const {t} = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();

    const encoded = searchParams.get("q");
    // Avoid double-encoding: values from URLSearchParams are already decoded once by Next.js
    // So use the raw value (trimmed) directly when sending to backend; backend/client will encode as needed.
    const sanitizedQuery = encoded ? encoded.trim() : "";

    const [filters, setFilters] = useState<FilterState>({
        community: undefined,
        jobType: undefined,
        intendedUse: undefined,
        budgetMin: undefined,
        budgetMax: undefined,
        sort: undefined,
    });
    const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);
    const [cursorHistory, setCursorHistory] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [budgetError, setBudgetError] = useState<string | null>(null);
    const communitiesResponse = useCommunities();
    const catalogData = getCommunitiesAtLevel(communitiesResponse.communities, 3);

    const {
        state: searchState,
        data: jobPostsPagination,
        isMutating: isJobsLoading,
    } = useHttpGet("search", {
        type: "Posts",
        q: sanitizedQuery,
        communityId: filters.community,
        pageCursor: currentCursor,
        budgetMin: filters.budgetMin,
        budgetMax: filters.budgetMax,
        jobType: filters.jobType,
        intendedUse: filters.intendedUse,
        limit: ITEMS_PER_PAGE,
    });

    const hasPreviousPage = useMemo(() => cursorHistory.length > 0, [cursorHistory]);
    const hasNextPage = useMemo(() => !!jobPostsPagination?.nextPage, [jobPostsPagination?.nextPage]);
    const totalJobs = useMemo(() => jobPostsPagination?.results?.length || 0, [jobPostsPagination?.results]);

    const handleFilterChange = useCallback(
        (key: keyof FilterState, value: unknown) => {
            setFilters((prev) => {
                const newFilters = {
                    ...prev,
                    [key]: key === "community" ? (typeof value === "string" && value ? parseInt(value) : undefined) : value
                };
                const params = new URLSearchParams(searchParams);
                if (newFilters.community) params.set("community", newFilters.community.toString());
                else params.delete("community");
                if (newFilters.jobType) params.set("jobType", newFilters.jobType);
                else params.delete("jobType");
                if (newFilters.intendedUse) params.set("intendedUse", newFilters.intendedUse);
                else params.delete("intendedUse");
                if (newFilters.budgetMin) params.set("budgetMin", newFilters.budgetMin.toString());
                else params.delete("budgetMin");
                if (newFilters.budgetMax) params.set("budgetMax", newFilters.budgetMax.toString());
                else params.delete("budgetMax");
                router.push(`?${params.toString()}`, {scroll: false});
                return newFilters;
            });
            if (key === "budgetMin") setBudgetError(null);
        },
        [router, searchParams]
    );

    const debouncedHandleBudgetInput = useCallback(
        debounce((type: 'min' | 'max', value: string) => {
            const numValue = value ? parseInt(value) : undefined;
            if (numValue !== undefined && numValue < 0) {
                setBudgetError(t("profileJob.budgetNegativeError"));
                return;
            }
            setBudgetError(null);
            handleFilterChange(type === 'min' ? 'budgetMin' : 'budgetMax', numValue);
        }, 50),
        [handleFilterChange, filters.budgetMin]
    );

    const handleNextPage = useCallback(() => {
        if (jobPostsPagination?.nextPage) {
            setCursorHistory((prev) => [...prev, currentCursor || ""]);
            setCurrentCursor(jobPostsPagination.nextPage);
        }
    }, [jobPostsPagination?.nextPage, currentCursor]);

    const handlePrevPage = useCallback(() => {
        if (cursorHistory.length > 0) {
            const prevCursor = cursorHistory[cursorHistory.length - 1];
            setCursorHistory((prev) => prev.slice(0, -1));
            setCurrentCursor(prevCursor || undefined);
        }
    }, [cursorHistory]);

    const handleJobClick = useCallback(
        (jobId: number) => {
            router.push(`/job-board/${jobId}`);
        },
        [router]
    );

    const clearFilters = useCallback(() => {
        setFilters({
            community: undefined,
            jobType: undefined,
            intendedUse: undefined,
            budgetMin: undefined,
            budgetMax: undefined,
            sort: undefined,
        });
        router.push(`?q=${sanitizedQuery}`, {scroll: false});
    }, [router, sanitizedQuery]);

    const hasActiveFilters = useMemo(
        () =>
            filters.community ||
            filters.jobType ||
            filters.intendedUse ||
            filters.budgetMin ||
            filters.budgetMax ||
            filters.sort,
        [filters]
    );

    useEffect(() => {
        setFilters({
            community: searchParams.get("community") ? parseInt(searchParams.get("community")!) : undefined,
            jobType: searchParams.get("jobType") ? (searchParams.get("jobType")! as JobType) : undefined,
            intendedUse: searchParams.get("intendedUse") ? (searchParams.get("intendedUse")! as IntendedUse) : undefined,
            budgetMin: searchParams.get("budgetMin") ? parseInt(searchParams.get("budgetMin")!) : undefined,
            budgetMax: searchParams.get("budgetMax") ? parseInt(searchParams.get("budgetMax")!) : undefined,
            sort: searchParams.get("sort") ? (searchParams.get("sort")! as PostSortType) : undefined,
        });
    }, [searchParams]);

    useEffect(() => {
        setCurrentCursor(undefined);
        setCursorHistory([]);
    }, [filters.community, filters.sort, filters.budgetMin, filters.budgetMax, filters.jobType, filters.intendedUse]);

    useEffect(() => {
        setIsLoading(isJobsLoading);
    }, [isJobsLoading]);

    if (searchState.state === REQUEST_STATE.FAILED) {
        return (
            <ErrorState/>
        );
    }

    return (
        <div className="bg-[#F6F9FE] min-h-screen">
            <div className="max-w-[1283px] mx-auto py-8 px-4 md:px-6 lg:px-8 rounded-lg shadow-sm">
                <div className="mb-6 flex items-center justify-between space-x-4">
                    <div>
                        <h1 className="text-2xl font-bold text-primary mb-1">{t("profileJob.sectionJobBoard")}</h1>
                        <p className="text-gray-600">{t("profileJob.subtitleJobBoard")}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <Link
                            prefetch={false}
                            href="/job-board/create-job"
                            className="inline-flex items-center bg-primary text-white py-3 px-6 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M12 4v16m8-8H4"/>
                            </svg>
                            {t("profileJob.buttonPostJob")}
                        </Link>
                    </div>
                </div>

                <div className="border-1 border-borderPrimary bg-white p-4 rounded-lg">
                    <div className="border-b">
                        <JobBoardTab/>
                    </div>

                    <div
                        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6 sm:p-8 mb-8 space-y-6 md:space-y-0 md:flex md:flex-wrap md:items-end md:justify-between transition-all duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                            <div className="relative group">
                                <label
                                    htmlFor="category-filter"
                                    className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-hover:text-primary"
                                >
                                    {t("profileJob.dropdownSearchCategory")}
                                </label>
                                <select
                                    id="category-filter"
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-blue-300"
                                    value={filters.community || ""}
                                    onChange={(e) => handleFilterChange("community", e.target.value || undefined)}
                                    aria-label={t("profileJob.dropdownSearchCategory")}
                                >
                                    <option value="">{t("profileJob.dropdownSearchCategory")}</option>
                                    {catalogData.map((category) => (
                                        <option key={category.community.id} value={category.community.id}>
                                            {t(`catalogs.${toCamelCaseLastSegment(category.community.path)}`)}
                                        </option>
                                    ))}
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 top-7">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="relative group">
                                <label
                                    htmlFor="job-type-filter"
                                    className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-hover:text-primary"
                                >
                                    {t("profileJob.dropdownSearchType")}
                                </label>
                                <select
                                    id="job-type-filter"
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-blue-300"
                                    value={filters.jobType || ""}
                                    onChange={(e) => handleFilterChange("jobType", e.target.value as JobType || undefined)}
                                    aria-label={t("profileJob.dropdownSearchType")}
                                >
                                    <option value="">{t("profileJob.tableAllJobTypesPlaceholder")}</option>
                                    <option value={JobType.FullTime}>{getJobTypeLabel(JobType.FullTime, t)}</option>
                                    <option value={JobType.PartTime}>{getJobTypeLabel(JobType.PartTime, t)}</option>
                                    <option value={JobType.Contract}>{getJobTypeLabel(JobType.Contract, t)}</option>
                                    <option value={JobType.Freelance}>{getJobTypeLabel(JobType.Freelance, t)}</option>
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 top-7">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="relative group">
                                <label
                                    htmlFor="intended-use-filter"
                                    className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-hover:text-primary"
                                >
                                    {t("profileJob.dropdownSearchIntendedUse")}
                                </label>
                                <select
                                    id="intended-use-filter"
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-blue-300"
                                    value={filters.intendedUse || ""}
                                    onChange={(e) => handleFilterChange("intendedUse", e.target.value as IntendedUse || undefined)}
                                    aria-label={t("profileJob.dropdownSearchIntendedUse")}
                                >
                                    <option value="">{t("profileJob.tableAllIntendedUsesPlaceholder")}</option>
                                    <option
                                        value={IntendedUse.Personal}>{t("profileJob.tablePersonalSelection")}</option>
                                    <option
                                        value={IntendedUse.Business}>{t("profileJob.tableBusinessSelection")}</option>
                                    <option value={IntendedUse.Unknown}>{t("profileJob.tableUnknownSelection")}</option>
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 top-7">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    className="block text-sm font-semibold text-gray-700">{t("profileJob.dropdownSearchBudget")}</label>
                                <div className="flex gap-3">
                                    <input
                                        id="budget-min"
                                        type="number"
                                        min="0"
                                        placeholder={t("profileJob.minBudgetPlaceholder")}
                                        value={filters.budgetMin || ""}
                                        onChange={(e) => debouncedHandleBudgetInput("min", e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-blue-300"
                                        aria-label={t("profileJob.minBudgetPlaceholder")}
                                    />
                                    <input
                                        id="budget-max"
                                        type="number"
                                        min="0"
                                        placeholder={t("profileJob.maxBudgetPlaceholder")}
                                        value={filters.budgetMax || ""}
                                        onChange={(e) => debouncedHandleBudgetInput("max", e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-blue-300"
                                        aria-label={t("profileJob.maxBudgetPlaceholder")}
                                    />
                                </div>
                                {budgetError && (
                                    <p className="text-sm text-red-600 mt-1">{budgetError}</p>
                                )}
                            </div>
                        </div>

                    </div>

                    {!isLoading && totalJobs > 0 && (
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {totalJobs} job{totalJobs !== 1 ? 's' : ''}{hasPreviousPage && ` (page ${cursorHistory.length + 1})`}
                        </div>
                    )}

                    <div className="overflow-x-auto border-1 border-borderPrimary rounded-lg">
                        {isLoading ? (
                            <div className="py-12 text-center">
                                <LoadingBlur text={""}/>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200" role="table"
                                   aria-label="Job listings">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {t("profileJob.tableHeaderTitle")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {t("profileJob.tableHeaderCategory")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {t("profileJob.tableHeaderJobType")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {t("profileJob.tableHeaderBudget")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {t("profileJob.tableHeaderProposals")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                                    >
                                        {t("profileJob.tableHeaderPostDate")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                                    >
                                        {t("profileJob.tableHeaderDeadline")}
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">{t("profileJob.tableHeaderActions")}</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {jobPostsPagination?.results?.length ? (
                                    jobPostsPagination?.results
                                        ?.filter((job: SearchCombinedView): job is Extract<SearchCombinedView, {
                                            type_: "Post"
                                        }> => job.type_ === "Post")
                                        .map((job: Extract<SearchCombinedView, { type_: "Post" }>) => (
                                            <tr
                                                key={job.post.id}
                                                onClick={() => handleJobClick(job.post.id)}
                                                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        handleJobClick(job.post.id);
                                                    }
                                                }}
                                                aria-label={`View job: ${job.post.name || job.post.embedTitle || "Untitled"}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-start">
                                                        <div className="mr-2 mt-1 flex-shrink-0">
                                                            <svg
                                                                className="h-5 w-5 text-gray-400"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                aria-hidden="true"
                                                            >
                                                                <path
                                                                    d="M9 12h6m-3-3v6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <Link
                                                                prefetch={false}
                                                                href={`/job-board/${job.post.id}`}
                                                                className="hover:text-primary font-medium text-base text-text-primary font-sans block truncate"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {job.post.name || job.post.embedTitle || "Untitled"}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                                                    {t(`catalogs.${toCamelCaseLastSegment(job.community.path)}`) || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                                                    {getJobTypeLabel(job.post.jobType, t)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 font-medium">
                                                    {formatBudget(job.post.budget)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-text-primary">
                                                    {job.post.comments}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-text-primary">
                                                    {formatDate(job.post.publishedAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-text-primary">
                                                    {job.post.deadline ? formatDate(job.post.deadline) : "-"}
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="col-span-full text-center text-gray-500 py-8">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-300 mb-4" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 12h6m-3-3v6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <p className="text-lg font-medium">
                                                    {hasActiveFilters || sanitizedQuery
                                                        ? t("profileJob.noJobsTitleWithFilters")
                                                        : t("profileJob.noJobsTitleNoFilters")}
                                                </p>
                                                <p className="text-sm">
                                                    {hasActiveFilters || sanitizedQuery
                                                        ? t("profileJob.noJobsDescriptionWithFilters") +
                                                        (sanitizedQuery ? ` Try searching for something else or adjusting filters.` : "")
                                                        : t("profileJob.noJobsDescriptionNoFilters")}
                                                </p>
                                                {(hasActiveFilters || sanitizedQuery) && (
                                                    <button
                                                        onClick={clearFilters}
                                                        className="mt-4 text-primary hover:text-blue-800 font-medium"
                                                    >
                                                        {t("profileJob.clearAllFilters")}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {(hasPreviousPage || hasNextPage) && (
                        <div className="mt-6 flex justify-center gap-4">
                            {hasPreviousPage && (
                                <button
                                    onClick={handlePrevPage}
                                    className="py-2 px-4 rounded-lg font-medium bg-primary text-white hover:bg-[#063a68] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                    aria-label="Go to previous page"
                                >
                                    {t("profileJob.previousButton")}
                                </button>
                            )}
                            {hasNextPage && (
                                <button
                                    onClick={handleNextPage}
                                    className="py-2 px-4 rounded-lg font-medium bg-primary text-white hover:bg-[#063a68] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                    aria-label="Go to next page"
                                >
                                    {t("profileJob.nextButton")}
                                </button>
                            )}
                        </div>
                    )}

                    <div
                        className="mt-12 h-[148px] bg-[#D0E1FB] rounded-lg overflow-hidden flex justify-center items-center">
                        <Image src={ProfileImage.jobBoard} alt="Job Board"
                               priority={false}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobBoard;