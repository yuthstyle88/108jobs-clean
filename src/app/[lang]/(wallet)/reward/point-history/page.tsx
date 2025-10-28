"use client";
import {BannerImage, RewardImage} from "@/constants/images";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useState} from "react";

// import CouponCard from "@/components/CouponCard/CouponCard";

interface PointHistory {
  id: number;
  date: string;
  details: string;
  points: number;
}

const PointHistoryPage = () => {
  const historyLanguageData = getNamespace(LanguageFile.REWARD);

  const route = useRouter();
  const [activeTab1, setActiveTab1] = useState<"received" | "exchange">(
    "received"
  );
  const [histories, setHistories] = useState<PointHistory[]>([]);
  const hasData = false;

  return (
    <>
      <section className="relative">
        <div className="bg-white absolute top-0 right-0 bottom-0 left-0 flex w-full h-[200px]">
          <div className="flex-shrink-0 h-full hidden sm:block">
            <Image
              src={BannerImage.left}
              className="h-full w-auto object-cover"
              alt="left"
            />
          </div>

          <div className="flex-grow flex justify-center h-full">
            <Image
              src={BannerImage.center}
              className="h-full w-auto object-cover"
              alt="center"
            />
          </div>
          <div className="flex-shrink-0 h-full ml-auto hidden sm:block">
            <Image
              src={BannerImage.right}
              className="h-full w-auto object-cover"
              alt="right"
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 h-[200px] block sm:hidden">
          <div className="flex-shrink-0 h-full">
            <Image
              src={BannerImage.left}
              className="object-cover"
              height={50}
              width={50}
              alt="left"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 h-[200px] block sm:hidden">
          <div className="flex-shrink-0 h-full">
            <Image
              src={BannerImage.right}
              className="object-cover"
              height={50}
              width={50}
              alt="right"
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 flex justify-center items-center h-[200px] text-black">
          <div className="flex flex-col justify-center items-center text-center">
            <div className="text-[20px] font-[500] leading-[23px]">
              {historyLanguageData?.sectionRewardsPoints}
            </div>
            <div className="flex items-center">
              <Image
                src={RewardImage.point}
                alt="point"
                className="w-[2rem] mr-2"
              />
              <div className="text-[28px] font-[600] leading-[46.2px] text-[rgb(29,108,226)]">
                0.00
              </div>
            </div>
            <div className="text-[14px] font-[400] leading-[16.1px] text-[rgba(43,50,59,0.6)]">
              {historyLanguageData?.approximate_symbol} 0.00 {historyLanguageData?.currency_baht}
            </div>
            <div className="text-[14px] font-[400] leading-[16.1px] text-[rgba(43,50,59,0.6)]">
              0.00 {historyLanguageData?.labelTotalPoints} {historyLanguageData?.expiration_date || "28/02/2025"}
            </div>
          </div>
        </div>
      </section>
      <section className="pt-[200px]">
        <div
          className="flex justify-center items-center h-[135px] px-8 sm:px-4 pt-4 sm:pt-0 pb-0 bg-[hsl(216,85%,94%)] rounded-reward-sp sm:rounded-reward-pc">
          <div className="flex space-x-8 pl-8 text-base sm:text-[20px] font-normal">
            <div
              className="text-center cursor-pointer text-gray-400"
              onClick={() => route.push("/reward/earn")}
            >
              {historyLanguageData?.tabCollectPoints}
            </div>
            <div
              className="text-center cursor-pointer text-gray-400"
              onClick={() => route.push("/reward/reward")}
            >
              {historyLanguageData?.tabRedeemRewards}
            </div>
            <div
              className="text-center cursor-pointer text-third border-b-2 border-third"
              onClick={() => route.push("/reward/point-history")}
            >
              {historyLanguageData?.tabUsageHistory}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[hsl(216,85%,94%)] py-24 grid grid-container-desktop-banner gap-y-12 pt-0 sm:pt-[4rem]">
        <div className="col-start-2 col-end-3">
          <div className="flex pb-4">
            <div className="h-[40px] w-[5px] bg-primary mr-2 "/>
            <div className="text-[31px] font-semibold text-black">
              {historyLanguageData?.tabEarnedPoints}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 ">
            <div className="grid grid-cols-2 divide-x divide-gray-200">
              <button
                className={`py-4 text-center font-medium ${
                  activeTab1 === "received" ? "text-primary" : "text-gray-500"
                }`}
                onClick={() => setActiveTab1("received")}
              >
                {historyLanguageData?.tabEarnedPoints}
              </button>
              <button
                className={`py-4 text-center font-medium ${
                  activeTab1 === "exchange" ? "text-primary" : "text-gray-500"
                }`}
                onClick={() => setActiveTab1("exchange")}
              >
                {historyLanguageData?.tabRedeemedExpired}
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="grid grid-cols-3 py-4 px-6 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div>{historyLanguageData?.columnDateReceived}</div>
              <div>{historyLanguageData?.columnDetails}</div>
              <div className="text-right">
                {historyLanguageData?.columnPointsAmount}
              </div>
            </div>

            {/* Table Content */}
            {hasData ? (
              histories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => setHistories([])}
                  className="grid grid-cols-3 py-4 px-6 border-b border-gray-100 text-sm"
                >
                  <div>{history.date}</div>
                  <div>{history.details}</div>
                  <div className="text-right font-medium">
                    {history.points > 0 ? historyLanguageData?.plus_symbol || "+" : ""}
                    {history.points}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                {historyLanguageData?.labelNoData}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PointHistoryPage;
