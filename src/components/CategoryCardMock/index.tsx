import {CategoriesImage} from "@/constants/images";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import {interpolateDouble} from "@/utils";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

const CategoryCardMock = () => {
  const jobCardLanguage = getNamespace(LanguageFile.JOB_CARD);
  return (
    <Link prefetch={false} href="/seo/job-detail" className="flex cursor-pointer w-full">
      <div
        className="hover:shadow-job-card border border-border-primary w-full flex flex-col overflow-hidden rounded-md bg-white transition-all ease-in-out duration-150">
        <section className="flex flex-row md:flex-col">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src={CategoriesImage.seoJob}
              alt="seo"
              className="object-cover w-full h-full bg-[#e8eaee]"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="flex flex-col p-2 bg-white border-b md:border-none">
            <h3 className="overflow-hidden leading-[1.25em] text-text-primary text-clip break-words font-normal text-sm font-sans line-clamp-2">
              เพิ่ม Traffic และ Backlink คุณภาพสูง ดัน Web ติดอันดับ SEO เร่ง
              index KW ให้ติดรัวๆ
            </h3>
            <div className="flex flex-row items-center mt-2 text-[12px]">
              <div className="text-text-secondary font-sans">
                <span>{jobCardLanguage.sold} 1.2K</span>
              </div>
              <div className="pl-2 ml-2 border-l border-[#2b323b66] flex items-center gap-1">
                <FontAwesomeIcon icon={faStar} className="text-[#e9b10c]"/>
                <span className="text-[12px] font-sans text-text-secondary">
                  4.9 (921)
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
            <span className="text-[0.75rem]">{jobCardLanguage.startingPrice}</span>
            <span className="text-[0.75rem] text-third text-right break-words">
              ฿1,600
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCardMock;
