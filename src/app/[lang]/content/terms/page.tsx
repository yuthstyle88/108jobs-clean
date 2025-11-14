"use client";
import {AssetIcon} from "@/constants/icons";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {useTranslation} from "react-i18next";

const TermAndConditions = () => {
    const { t } = useTranslation();
    const [openSection, setOpenSection] = useState<string | null>(null);

    const sections = [
        { id: "definitions", title: t("termsEmployer.definitionTitle"), key: "definition" },
        { id: "general", title: t("termsEmployer.titleGeneral"), key: "general" },
        { id: "employer-warranty", title: t("termsEmployer.titleEmployerWarranty"), key: "employerWarranty" },
        { id: "registration", title: t("termsEmployer.titleRegistration"), key: "registration" },
        { id: "order", title: t("termsEmployer.orderTitle"), key: "order" },
        { id: "contact", title: t("termsEmployer.contact.title"), key: "contact" },
        { id: "fee", title: t("termsEmployer.fee.title"), key: "fee" },
        { id: "coin-and-bonus", title: t("termsEmployer.coinAndBonus.title"), key: "coinAndBonus" },
        { id: "work", title: t("termsEmployer.work.title"), key: "work" },
        { id: "review", title: t("termsEmployer.review.title"), key: "review" },
        { id: "order-change", title: t("termsEmployer.orderChange.title"), key: "orderChange" },
        { id: "order-cancel-refund", title: t("termsEmployer.orderCancelRefundTitle"), key: "orderCancelRefund" },
        { id: "account-suspension", title: t("termsEmployer.accountSuspensionTitle"), key: "accountSuspension" },
        { id: "dispute", title: t("termsEmployer.dispute.title"), key: "dispute" },
        { id: "liability-claim", title: t("termsEmployer.liabilityClaim.title"), key: "liabilityClaim" },
        { id: "limitation", title: t("termsEmployer.limitation.title"), key: "limitation" },
        { id: "intellectual-property", title: t("termsEmployer.intellectualPropertyTitle"), key: "intellectualProperty" },
        { id: "privacy-policy", title: t("termsEmployer.privacyPolicyTitle"), key: "privacyPolicy" },
        { id: "contact-info", title: t("termsEmployer.contactInfoTitle"), key: "contactInfo" },
    ];

    const toggleSection = (id: string) => {
        setOpenSection(openSection === id ? null : id);
    };

    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Header Section */}
            <section className="relative bg-[#042A48] text-white py-16 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <Image
                        src={AssetIcon.logoIcon}
                        alt="Background Logo"
                        layout="fill"
                        objectFit="cover"
                        className="object-right-bottom"
                    />
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("termsEmployer.pageTitle")}</h1>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar (Table of Contents) */}
                    <aside className="lg:w-64 flex-shrink-0 lg:sticky lg:top-20 hidden lg:block">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100/50">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("termsEmployer.tableOfContents")}</h2>
                            <ul className="space-y-2">
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <a
                                            href={`#${section.id}`}
                                            className="text-sm text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            aria-label={`Jump to ${section.title}`}
                                        >
                                            {section.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Mobile Dropdown Menu */}
                    <div className="lg:hidden mb-6">
                        <select
                            className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onChange={(e) => {
                                if (e.target.value) {
                                    document.getElementById(e.target.value)?.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            aria-label={t("termsEmployer.selectSection")}
                        >
                            <option value="">{t("termsEmployer.selectSection")}</option>
                            {sections.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Content */}
                    <div className="flex-1 max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">{t("termsEmployer.heading")}</h2>
                        </div>
                        <div className="space-y-6">
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    id={section.id}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100/50"
                                >
                                    <button
                                        className="w-full text-left text-lg font-semibold text-gray-900 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        onClick={() => toggleSection(section.id)}
                                        aria-expanded={openSection === section.id}
                                        aria-controls={`${section.id}-content`}
                                    >
                                        {section.title}
                                    </button>
                                    <div
                                        id={`${section.id}-content`}
                                        className={`space-y-4 text-gray-700 ${openSection === section.id || window.innerWidth >= 1024 ? "block" : "hidden"}`}
                                    >
                                        {section.key === "definition" && (
                                            <ul className="list-disc pl-6 grid gap-2">
                                                {[
                                                    "definitionPlatform",
                                                    "definitionWork",
                                                    "definitionCompany",
                                                    "definitionFastwork",
                                                    "definitionUser",
                                                    "definitionEmployer",
                                                    "definitionFreelancer",
                                                    "definitionMyWork",
                                                    "definitionProposedWork",
                                                    "definitionJobAnnouncement",
                                                    "definitionChat",
                                                    "definitionOrder",
                                                    "definitionInactiveOrder",
                                                    "definitionQuote",
                                                    "definitionServiceFee",
                                                    "definitionPlatformFee1",
                                                    "definitionPlatformFee2",
                                                    "definitionPaymentFee",
                                                    "definitionFastworkCoin",
                                                    "definitionBonusCoin",
                                                    "definitionPersonalData",
                                                ].map((key) => (
                                                    <li key={key}>{t(`termsEmployer.${key}`)}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {section.key === "general" && (
                                            <>
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.general${i}`)}</p>
                                                ))}
                                            </>
                                        )}
                                        {section.key === "employerWarranty" && (
                                            <>
                                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.employerWarranty${i}`)}</p>
                                                ))}
                                            </>
                                        )}
                                        {section.key === "registration" && (
                                            <>
                                                {[1, 2, 3].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.registration${i}`)}</p>
                                                ))}
                                            </>
                                        )}
                                        {section.key === "order" && (
                                            <>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.order${i}`)}</p>
                                                ))}
                                            </>
                                        )}
                                        {section.key === "contact" && (
                                            <>
                                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.contact.${i}`)}</p>
                                                ))}
                                            </>
                                        )}
                                        {section.key === "fee" && (
                                            <>
                                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.fee.${i}`)}</p>
                                                ))}
                                            </>
                                        )}
                                        {section.key === "coinAndBonus" && (
                                            <>
                                                {[1, 2].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.coinAndBonus.detail${i}`)}</p>
                                                ))}
                                            </>
                                        )}
                                        {section.key === "work" && (
                                            <>
                                                {[1, 2].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.work.detail${i}`)}</p>
                                                ))}
                                            </>
                                        )}
                                        {section.key === "review" && (
                                            <>
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.review.detail${i}`)}</p>
                                                ))}
                                            </>
                                        )}
                                        {section.key === "orderChange" && (
                                            <>
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.orderChange.detail${i}`)}</p>
                                                ))}
                                                <ul className="list-disc pl-6 grid gap-2">
                                                    {[1, 2, 3, 4].map((i) => (
                                                        <li key={i}>{t(`termsEmployer.orderChange.method${i}`)}</li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                        {section.key === "orderCancelRefund" && (
                                            <>
                                                <p className="leading-relaxed">{t("termsEmployer.orderCancelRefundIntro")}</p>
                                                <ul className="list-disc pl-6 grid gap-2">
                                                    {[1, 2, 3, 4].map((i) => (
                                                        <li key={i}>{t(`termsEmployer.orderCancelRefundReason${i}`)}</li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                        {section.key === "accountSuspension" && (
                                            <>
                                                <p className="leading-relaxed">{t("termsEmployer.accountSuspensionIntro")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.accountSuspensionViolationIntro")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.accountSuspensionWarning")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.accountSuspensionRights")}</p>
                                                <ul className="list-disc pl-6 grid gap-2">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                                        <li key={i}>{t(`termsEmployer.accountSuspensionReason${i}`)}</li>
                                                    ))}
                                                </ul>
                                                <p className="leading-relaxed">{t("termsEmployer.accountSuspensionFinalDecision")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.accountSuspensionEffect")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.accountSuspensionContact")}</p>
                                            </>
                                        )}
                                        {section.key === "dispute" && (
                                            <>
                                                <p className="leading-relaxed">{t("termsEmployer.dispute.intro")}</p>
                                                <ul className="list-disc pl-6 grid gap-2">
                                                    {["quality", "scope", "deadline", "damageDuring", "damageAfter"].map((key) => (
                                                        <li key={key}>{t(`termsEmployer.dispute.issues.${key}`)}</li>
                                                    ))}
                                                </ul>
                                                <p className="leading-relaxed">{t("termsEmployer.dispute.escalation")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.dispute.complaint")}</p>
                                            </>
                                        )}
                                        {section.key === "liabilityClaim" && (
                                            <>
                                                <p className="leading-relaxed">{t("termsEmployer.liabilityClaim.intro")}</p>
                                                <ul className="list-disc pl-6 grid gap-2">
                                                    {["personalData", "ip", "confidential", "defamation"].map((key) => (
                                                        <li key={key}>{t(`termsEmployer.liabilityClaim.${key}`)}</li>
                                                    ))}
                                                </ul>
                                                <p className="leading-relaxed">{t("termsEmployer.liabilityClaim.legalAction")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.liabilityClaim.toCompany")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.liabilityClaim.toEachOther")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.liabilityClaim.companyLiability")}</p>
                                            </>
                                        )}
                                        {section.key === "limitation" && (
                                            <>
                                                <p className="leading-relaxed">{t("termsEmployer.limitation.intro")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.limitation.exclusions")}</p>
                                                <ul className="list-disc pl-6 grid gap-2">
                                                    {[
                                                        "outOfOrder",
                                                        "noPayment",
                                                        "violation",
                                                        "userMessages",
                                                        "review",
                                                        "quality",
                                                        "damage",
                                                        "dispute",
                                                    ].map((key) => (
                                                        <li key={key}>{t(`termsEmployer.limitation.exclusions.${key}`)}</li>
                                                    ))}
                                                </ul>
                                                <p className="leading-relaxed">{t("termsEmployer.limitation.noGuarantee")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.limitation.disclaimer")}</p>
                                            </>
                                        )}
                                        {section.key === "intellectualProperty" && (
                                            <>
                                                {[1, 2, 3, 4].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.intellectualPropertyContent${i}`)}</p>
                                                ))}
                                            </>
                                        )}
                                        {section.key === "privacyPolicy" && (
                                            <>
                                                <p className="leading-relaxed">
                                                    {t("termsEmployer.privacyPolicyContent1")}{" "}
                                                    <Link
                                                        prefetch={false}
                                                        className="text-blue-500 hover:text-blue-600 underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                        href="/content/privacy"
                                                        aria-label={t("termsEmployer.privacyPolicyLinkText")}
                                                    >
                                                        {t("termsEmployer.privacyPolicyLinkText")}
                                                    </Link>{" "}
                                                    {t("termsEmployer.privacyPolicyContent2")}
                                                </p>
                                                {[3, 4, 5].map((i) => (
                                                    <p key={i} className="leading-relaxed">{t(`termsEmployer.privacyPolicyContent${i}`)}</p>
                                                ))}
                                            </>
                                        )}
                                        {section.key === "contactInfo" && (
                                            <>
                                                <p className="leading-relaxed">{t("termsEmployer.contactInfoContent1")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.contactInfoCompanyName")}</p>
                                                <p className="leading-relaxed">{t("termsEmployer.contactInfoAddress")}</p>
                                                <p className="leading-relaxed">
                                                    <a
                                                        className="text-blue-500 hover:text-blue-600 underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                        href={`mailto:${t("termsEmployer.contactInfoEmail")}`}
                                                        aria-label="Email support"
                                                    >
                                                        {t("termsEmployer.contactInfoEmail")}
                                                    </a>
                                                </p>
                                                <p className="leading-relaxed">{t("termsEmployer.contactInfoPhone")}</p>
                                                <p className="leading-relaxed">
                                                    <Link
                                                        prefetch={false}
                                                        className="text-blue-500 hover:text-blue-600 underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                        href="/content/support-center"
                                                        aria-label={t("termsEmployer.contactInfoWebsiteLinkText")}
                                                    >
                                                        {t("termsEmployer.contactInfoWebsiteLinkText")}
                                                    </Link>
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default TermAndConditions;