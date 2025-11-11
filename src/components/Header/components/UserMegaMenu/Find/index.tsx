import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";

const Find = () => {
  const global = getNamespace(LanguageFile.GLOBAL);

    const {
        data: catalogData,
        isMutating: isCatalogLoading,
    } = useHttpGet("listCategories");


  const popularCategories =
    catalogData?.categories?.find(
      (catalog) => catalog.category.id === 1
    )?.children || [];

  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        {global?.hintLabelMenuOptionFindHire}
      </span>
      <p className="mt-3 text-[0.875rem] text-text-secondary font-sans">
        {global?.freelancerSelectionDescription}
      </p>
      <div className="mt-6">
        <span className="text-[0.875rem] font-medium text-text-primary">
          {global?.labelNavBarItem1}
        </span>
        <div className="mt-2 flex flex-col mr-4">
          {popularCategories.map((job, index) => (
            <Link prefetch={false}
                  href={`/job/${job.category.id}`}
                  key={index}
                  className="text-[0.875rem] text-text-secondary px-2 py-[4px] flex-1 flex items-center justify-between rounded-sm transition-all duration-150 ease-in-out"
            >
              {job.category.name}
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-[rgba(43,50,59,.4)]"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Find;
