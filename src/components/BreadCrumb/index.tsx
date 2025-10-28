import {ChevronRight} from "lucide-react";
import Link from "next/link";
import React from "react";

type Crumb = {
  label: string;
  href?: string;
  forceLink?: boolean;
};

interface BreadCrumbProps {
  items: Crumb[];
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({items}) => {
  return (
    <section className="col-start-2 col-end-auto h-5 mt-2 sm:mt-10">
      <div className="flex justify-between items-center">
        <ul className="text-[12px] sm:text-base flex-wrap inline-flex m-0 h-0 list-none">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const shouldLink = item.href && (!isLast || item.forceLink);

            return (
              <li key={index} className="flex flex-row items-center gap-2">
                {shouldLink ? (
                  <Link prefetch={false}
                        href={item.href!}
                        className="text-third hover:text-primary transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-text-primary">{item.label}</span>
                )}

                {!isLast && (
                  <span className="text-neutral-400 pr-2 relative top-[2px]">
                    <ChevronRight className="w-4 text-text-secondary"/>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default BreadCrumb;
