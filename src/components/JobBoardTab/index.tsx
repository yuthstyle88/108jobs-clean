'use client'

import Link from 'next/link'
import {usePathname, useParams} from 'next/navigation'
import React from 'react'
import {useTranslation} from "react-i18next";

const JobBoardTab = () => {
  const {t} = useTranslation();
  const pathname = usePathname();
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang as string) || 'en';
  const pathWithoutLang = '/' + pathname.split('/').slice(2).join('/');

  const hrefAll = `/${lang}/job-board`;
  const hrefJobs = `/${lang}/job-board/jobs`;

  const excludedPaths = ['/job-board/proposals', '/job-board/jobs'];

  const isAllJobPostsActive =
    pathWithoutLang === '/job-board' ||
    (pathWithoutLang.startsWith('/job-board/') &&
      !excludedPaths.includes(pathWithoutLang));

  return (
    <div className="flex -mb-px">
      <Link prefetch={false}
            href={hrefAll}
            className={`mr-6 py-2 text-[18px] font-medium border-b-2 ${isAllJobPostsActive
              ? 'text-primary border-primary'
              : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
      >
          {t("profileJob.allPostJobs")}
      </Link>

      <Link prefetch={false}
            href={hrefJobs}
            className={`py-2 text-[18px] font-medium border-b-2 ${pathWithoutLang === '/job-board/jobs'
              ? 'text-primary border-primary'
              : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
      >
          {t("profileJob.postedJobs")}
      </Link>
    </div>
  )
}

export default JobBoardTab
