"use client";
import {AssetIcon, ContentIcon} from "@/constants/icons";
import {ArrowRight} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useLanguage} from "@/contexts/LanguageContext";

const HowSellAndBuy = () => {
    const {lang} = useLanguage();
    const {t} = useTranslation();
    const [selectedTab, setSelectedTab] = useState(0);

    const EMPLOYERS = [
        {
            id: 1,
            title: t('how.chooseServiceButton'),
            description:
                t('how.employerStep1Description'),
            list: [
                t('how.employerStep1List1'),
                t('how.employerStep1List2'),
                t('how.employerStep1List3'),
                t('how.employerStep1List4'),
                t('how.employerStep1List5'),
                t('how.employerStep1List6'),
                t('how.employerStep1List7'),
            ],
        },
        {
            id: 2,
            title: t('how.employerStep2Title'),
            description: t('how.employerStep2Description'),
            list: [
                t('how.employerStep2List1'),
                t('how.employerStep2List2'),
                t('how.employerStep2List3'),
            ],
        },
        {
            id: 3,
            title: t('how.employerStep3Title'),
            description: t('how.employerStep3Description'),
            list: [
                t('how.employerStep3List1'),
                t('how.employerStep3List2'),
                t('how.employerStep3List3'),
                t('how.employerStep3List5'),
                t('how.employerStep3List7'),
            ],
        },
        {
            id: 4,
            title: t('how.employerStep4Title'),
            description: t('how.employerStep4Description'),
            list: [
                t('how.employerStep4List1'),
                t('how.employerStep4List2'),
                t('how.employerStep4List3'),
                t('how.employerStep4List4'),
                t('how.employerStep4List5'),
            ],
        },
        {
            id: 5,
            title: t('how.employerStep5Title'),
            description: t('how.employerStep5Description'),
            list: [
                t('how.employerStep5List1'),
                t('how.employerStep5List2'),
            ],
        },
    ];

    const SELLERS = [
        {
            id: 1,
            title: t('how.sellerStep1Title'),
            description: t('how.sellerStep1Description'),
            list: [
                t('how.sellerStep1List1'),
                t('how.sellerStep1List2'),
                t('how.sellerStep1List3'),
                t('how.sellerStep1List4'),
                t('how.sellerStep1List5'),
                t('how.sellerStep1List6'),
            ],
        },
        {
            id: 2,
            title: t('how.sellerStep2Title'),
            description: t('how.sellerStep2Description'),
            list: [
                t('how.sellerStep2List1'),
                t('how.sellerStep2List2'),
            ],
        },
        {
            id: 3,
            title: t('how.sellerStep3Title'),
            description: t('how.sellerStep3Description'),
            list: [
                t('how.sellerStep3List1'),
                t('how.sellerStep3List2'),
            ],
        },
        {
            id: 4,
            title: t('how.sellerStep4Title'),
            description: t('how.sellerStep4Description'),
            list: [
                t('how.sellerStep4List1'),
                t('how.sellerStep4List2'),
            ],
        },
        {
            id: 5,
            title: t('how.sellerStep5Title'),
            description: t('how.sellerStep5Description'),
            list: [
                t('how.sellerStep5List1'),
                t('how.sellerStep5List2'),
            ],
        },
    ];

    const tabs = [
        {
            name: t('profileCoupon.tabForHiring'),
            content: t('profileCoupon.messageNoOffers'),
        },
        {
            name: t('profileCoupon.tabForFreelancers'),
            content: t('profileCoupon.messageNoOffers'),
        },
    ];

    const currentSteps = selectedTab === 0 ? EMPLOYERS : SELLERS;

    return (
        <>
            <main>
                <section
                    className="flex items-center justify-center w-full h-[200px] relative overflow-hidden"
                    style={{background: "linear-gradient(282deg, #27c8f8, #1850c2)"}}
                >
                    <div className="px-[1.5rem] relative">
                        <div className="text-center text-white">
                            <h1 className="text-[28px]">{t('how.howToBuySellTitle')}</h1>
                            <p className="text-[16px]">
                                {t('how.howToBuySellSubtitle')}
                            </p>
                        </div>
                    </div>
                    <div
                        className="absolute right-[-100px] bottom-[150px] h-[150px] ml-auto opacity-30 pointer-events-none">
                        <Image
                            src={AssetIcon.logoIcon}
                            alt="Logo"
                            width={350}
                            height={350}
                        />
                    </div>
                </section>
                <section className="py-24 grid grid-container-desktop-banner pt-[4rem]">
                    <div className="col-start-2 col-end-3">
                        <div className="text-center w-full">
                            <h1 className="font-sans text-[1.5rem] text-text-primary font-semibold mb-12">
                                {t('how.easyStepsTitle')}
                            </h1>
                        </div>
                    </div>
                    <div className="col-start-2 col-end-3 flex flex-row items-start gap-6 p-4 md:p-0">
                        <div className="hidden xl:block sticky top-4">
                            <Image
                                src={selectedTab === 0 ? ContentIcon.buyer : ContentIcon.seller}
                                alt="Seller Icon"
                                width={500}
                                height={500}
                                className="max-w-full w-[500px]"
                            />
                        </div>
                        <div className="z-10 relative flex-1 ">
                            <div className="flex items-center md:items-start border-b border-gray-300">
                                {tabs.map((tab, index) => (
                                    <button
                                        key={index}
                                        className={`${
                                            selectedTab === index
                                                ? "border-b-2 border-blue-500 text-blue-500 flex-1 md:block"
                                                : "text-gray-500 flex-1 md:block"
                                        } py-2 px-4 text-lg font-medium`}
                                        onClick={() => setSelectedTab(index)}
                                    >
                                        {tab.name}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-6 gap-6 grid grid-cols-1 ">
                                {currentSteps.map((item, index) => (
                                    <div
                                        key={`${item.id}` + `${index}`}
                                        className="shadow-how-shadow border-1 border-border-secondary rounded-xl bg-white p-6"
                                    >
                                        <div className="flex items-center flex-row gap-3">
                                            <div
                                                className="w-8 flex justify-center items-center h-8 text-[1.25rem] text-white bg-third rounded-full">
                                                {item.id}
                                            </div>
                                            <p className="text-[1.25rem] font-semibold flex-1 font-sans text-text-primary">
                                                {item.title}
                                            </p>
                                        </div>
                                        <p className="text-[0.875rem] mt-3 text-text-secondary ">
                                            {item.description}
                                        </p>
                                        <ul className="pl-6 mt-2 list-disc gap-2 text-[0.875rem] text-text-secondary grid grid-cols-1">
                                            {item.list.map((list, index) => (
                                                <li key={index}>{list}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-start-2 col-end-3 mt-12 block md:flex justify-end items-end px-4 md:px-0">
                        <Link prefetch={false} href={`/${lang}`} className="">
                            <button
                                className="submit-button-custom py-2 px-4 w-full md:w-fit flex flex-row justify-center md:justify-start gap-2">
                                <p>{t('how.chooseServiceButton')}</p>
                                <ArrowRight className="w-5"/>
                            </button>
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
};

export default HowSellAndBuy;
