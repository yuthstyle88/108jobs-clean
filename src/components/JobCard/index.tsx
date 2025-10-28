import {CategoriesImage} from "@/constants/images";
import {LanguageFile} from "@/constants/language";
import {useLanguage} from "@/contexts/LanguageContext";
import {Job} from "@/types/jobSearch";
import {formatThaiBaht, interpolateDouble} from "@/utils";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import {getNamespace} from "@/utils/i18nHelper";

type Props = {
  data: Job;
};

const JobCard = ({data}: Props) => {
  const jobCardLanguage = getNamespace(LanguageFile.JOB_CARD);
  const coverImage = data.images?.find((image) => image.isCoverPhoto);
  const {lang: currentLang} = useLanguage();

  // Handle loading and error states
  return (
    <Link prefetch={false} href={`/${currentLang}/user/${data.user.username}/${data.slug}`} className="flex cursor-pointer w-full">
      <div
        className="hover:shadow-job-card border border-border-primary w-full flex flex-col overflow-hidden rounded-md bg-white transition-all ease-in-out duration-150">
        <section className="grid grid-cols-[minmax(17px,170px)1fr] grid-rows-[1fr_max-content] md:flex md:flex-col">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src={coverImage?.imageUrl || CategoriesImage.seoJob}
              alt="seo"
              className="object-cover w-full h-full bg-[#e8eaee]"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>
          <div className="flex flex-col p-2 bg-white border-b md:border-none">
            <h3 className="overflow-hidden leading-[1.25em] text-text-primary text-clip break-words font-normal text-sm font-sans line-clamp-2">
              {data.title}
            </h3>
            <div className="flex flex-row items-center mt-2 text-[12px]">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faStar} className="text-[#e9b10c]"/>
                <span className="text-[12px] font-sans text-text-secondary">
                  {Number(data.rating).toFixed()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              <Image
                src={CategoriesImage.specialist}
                alt="seo"
                className="h-[1.125rem] w-auto align-top"
              />
              <Image
                src={CategoriesImage.badgeRehire}
                alt="badgeRehire"
                className="h-[1.125rem] w-auto align-top"
              />
            </div>
          </div>
        </section>
        <div className="mt-0 md:mt-2 flex gap-1 items-end md:min-h-10 pt-2 md:pt-1 px-2 pb-2 md:pb-3 bg-white font-sans">
          <div className="text-text-secondary text-[0.75rem] overflow-hidden text-ellipsis whitespace-nowrap">
            {interpolateDouble(jobCardLanguage.responseTime,
              {
                n: 2,
              })}
          </div>
          <div
            className="flex flex-row gap-2 md:gap-0 md:flex-col items-end min-w-fit ml-auto text-text-secondary overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-[0.75rem]">
              {jobCardLanguage.startingPrice}
            </span>
            <span className="text-[0.75rem] text-third text-right break-words">
              {formatThaiBaht(data.basePrice)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
