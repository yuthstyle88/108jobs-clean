import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {useTranslation} from "react-i18next";

const Post = () => {
    const {t} = useTranslation();
    return (
        <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        {t("global.jobBoardSideTitle")}
      </span>
            <p className="mt-3 text-[0.875rem] text-text-secondary font-sans">
                {t("global.jobBoardSideDesc")}
            </p>
            <Link prefetch={false} href="/job-board" className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
          {t("global.jobBoardButton")}
            <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third"/>
        </span>
            </Link>
        </div>
    );
};

export default Post;