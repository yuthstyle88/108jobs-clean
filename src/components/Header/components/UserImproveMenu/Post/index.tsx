import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Post = () => {
  const global = getNamespace(LanguageFile.GLOBAL);
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        {global?.jobBoardSideTitle}
      </span>
      <p className="mt-3 text-[0.875rem] text-text-secondary font-sans">
        {global?.jobBoardSideDesc}
      </p>
      <Link prefetch={false} href="/job-board" className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
          {global?.jobBoardButton}
          <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third"/>
        </span>
      </Link>
    </div>
  );
};

export default Post;
