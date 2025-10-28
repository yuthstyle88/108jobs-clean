"use client";
import CouponCard from "@/components/CouponCard/CouponCard";
import {BannerImage, RewardImage} from "@/constants/images";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import {motion} from "framer-motion";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useState} from "react";


interface CouponData {
  id: number;
  value: number;
  isHotDeal?: boolean;
  points: number;
}

const coupons: CouponData[] = [
  {id: 1, value: 50, points: 50},
  {id: 2, value: 100, points: 90},
  {id: 3, value: 300, points: 300},
  {id: 4, value: 500, points: 500},
  {id: 5, value: 1000, points: 1000},
  {id: 6, value: 3000, points: 3000},
  {id: 7, value: 5000, points: 5000},
];

const RewardPage = () => {
  const rewardLanguageData = getNamespace(LanguageFile.REWARD);

  const route = useRouter();
  const [activeButton, setActiveButton] = useState(0);

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
              {rewardLanguageData?.sectionRewardsPoints}
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
              ≈ 0.00 บาท
            </div>
            <div className="text-[14px] font-[400] leading-[16.1px] text-[rgba(43,50,59,0.6)]">
              0.00 {rewardLanguageData?.labelTotalPoints} 28/02/2025
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
              {rewardLanguageData?.tabCollectPoints}
            </div>
            <div
              className="text-center cursor-pointer text-third border-b-2 border-third"
              onClick={() => route.push("/reward/reward")}
            >
              {rewardLanguageData?.tabRedeemRewards}
            </div>
            <div
              className="text-center cursor-pointer text-gray-400"
              onClick={() => route.push("/reward/point-history")}
            >
              {rewardLanguageData?.tabUsageHistory}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[hsl(216,85%,94%)] py-24 grid grid-container-desktop-banner gap-y-12 pt-0 sm:pt-[4rem]">
        <div className="col-start-2 col-end-3">
          <div className="flex">
            <div className="h-[40px] w-[5px] bg-primary mr-2 "/>
            <div className="text-[31px] font-semibold text-black">
              {rewardLanguageData?.sectionAwards}{" "}
            </div>
          </div>
          <div className="flex justify-left space-x-4 py-8">
            <button
              className={`py-1 px-3 sm:py-2 sm:px-6 rounded-full ${
                activeButton === 0
                  ? "bg-primary text-white"
                  : "bg-white text-primary border border-primary"
              }`}
              onClick={() => setActiveButton(0)}
            >
              {rewardLanguageData?.buttonAllAwards}{" "}
            </button>
            <button
              className={`py-1 px-3 sm:py-2 sm:px-6 rounded-full ${
                activeButton === 1
                  ? "bg-primary text-white"
                  : "bg-white text-primary border border-primary"
              }`}
              onClick={() => setActiveButton(1)}
            >
              {rewardLanguageData?.buttonForEmployment}{" "}
            </button>
          </div>
          <div className="text-[24px] font-[500] leading-[27.6px] text-[rgb(29,108,226)] py-8">
            {rewardLanguageData?.sectionGeneral}
          </div>
          <motion.div
            className="text-center mb-12"
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {coupons.map((coupon, index) => (
                <CouponCard
                  key={coupon.id}
                  id={coupon.id}
                  value={coupon.value}
                  points={coupon.points}
                  isHotDeal={coupon.isHotDeal}
                  delay={index * 0.1}
                  data={rewardLanguageData}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default RewardPage;
