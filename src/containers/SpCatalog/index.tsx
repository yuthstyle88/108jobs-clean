import {CommunityNodeView} from "lemmy-js-client";
import Link from "next/link";

type Props = {
    activeCatalog: CommunityNodeView;
};

const SpCatalog = ({ activeCatalog }: Props) => {
    return (
        <div className="mb-3">
            <h6 className="text-[1.125rem] text-primary font-semibold leading-[1.15]">
                Popular Catalog
            </h6>
            <div className="mb-3 pt-3">
                <div className="grid grid-cols-2 gap-2">
                    {activeCatalog?.children?.slice(0, 8).map(({ community }) => {
                        const backgroundImage = community.icon
                            ? `url(${community.icon})`
                            : `url("/categories-image/web-development-02032022.jpg")`;

                        return (
                            <Link
                                prefetch={false}
                                key={community.id}
                                href={`/job/${community.apId}`}
                                className="group"
                            >
                                <div
                                    style={{ backgroundImage }}
                                    className="relative rounded-md overflow-hidden bg-cover bg-center h-24 transition-all duration-150 ease-in-out cursor-pointer hover:shadow-lg"
                                >
                                    <div className="relative flex items-end h-full px-4 py-3 text-white bg-[rgba(0,0,0,0.6)] font-semibold transition-all duration-150">
                    <span className="group-hover:-translate-y-1">
                      {community.name}
                    </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                    {(!activeCatalog?.children || activeCatalog.children.length === 0) && (
                        <div className="col-span-2 text-center text-gray-500 py-4">
                            No subcatalogs available
                        </div>
                    )}
                </div>
            </div>
            <Link
                prefetch={false}
                href="/categories/popular-service"
                className="w-full flex justify-center items-center text-primary font-semibold text-[1rem] leading-[1.15] hover:text-blue-800 transition-all duration-150"
            >
                <span className="pt-3">View more categories</span>
            </Link>
        </div>
    );
};

export default SpCatalog;