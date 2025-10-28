"use client";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/Accordion";
import {Button} from "@/components/ui/Button";
import {AssetIcon, ContentIcon} from "@/constants/icons";
import Image from "next/image";
import {useTranslation} from "react-i18next";

const SupportCenter = () => {
  const { t } = useTranslation();
  const faqData = [
    {
      question: t("supportCenter.faqQuestion1"),
      answer: [
        t("supportCenter.faqQuestion1Step1"),
        t("supportCenter.faqQuestion1Step2"),
        t("supportCenter.faqQuestion1Step3"),
        t("supportCenter.faqQuestion1Step4"),
      ],
      note: t("supportCenter.faqQuestion1Note"),
    },
    {
      question: t("supportCenter.faqQuestion2"),
      answer: [
        t("supportCenter.faqQuestion2Step1"),
        t("supportCenter.faqQuestion2Step2"),
        t("supportCenter.faqQuestion2Step3"),
      ],
    },
    {
      question: t("supportCenter.faqQuestion3"),
      answer: [
        t("supportCenter.faqQuestion3Step1"),
        t("supportCenter.faqQuestion3Step2"),
        t("supportCenter.faqQuestion3Step3"),
      ],
    },
  ];
  return (
    <>
      <main>
        <section
          className="flex items-center justify-center w-full h-[200px] relative overflow-hidden"
          style={{background: "linear-gradient(282deg, #27c8f8, #1850c2)"}}
        >
          <div className="px-[1.5rem] relative">
            <div className="text-center text-white">
              <h1 className="text-[28px]">{t("supportCenter.faqTitle")}</h1>
              <p className="text-[16px]">{t("supportCenter.faqSubtitle")}</p>
            </div>
          </div>
          <div className="absolute right-[-100px] bottom-[150px] h-[150px] ml-auto opacity-30 pointer-events-none">
            <Image
              src={AssetIcon.logoIcon}
              alt="Logo"
              width={350}
              height={350}
            />
          </div>
        </section>
        <section className="py-24 grid grid-container-content pt-[4rem]">
          <div className="col-start-2 col-end-3 flex flex-row items-start gap-6 p-4 md:p-0">
            <div className="px-6 w-full">
              <div className="text-center mb-12">
                <h1 className="font-sans text-[1.5rem] text-text-primary font-semibold mb-4">
                  {t("supportCenter.faqHeader")}
                </h1>
                <div className="w-20 h-[2px] rounded-full bg-blue-500 mx-auto"></div>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {faqData.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-gray-200 rounded-lg"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                      <span className="text-lg font-medium text-gray-900">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-3">
                        {faq.answer.map((step, stepIndex) => (
                          <p key={stepIndex} className="text-gray-700">
                            {step}
                          </p>
                        ))}
                        {faq.note && (
                          <p className="text-gray-600 italic mt-4">
                            {faq.note}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
        <section className="grid grid-container-content pt-[1rem] bg-[#FBFBFC]">
          <div className="col-start-2 col-end-3 flex flex-row items-start gap-6 p-4 md:p-0 bg-[#FBFBFC]">
            <div className="bg-gray-50 py-16 mt-2">
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                  <h1 className="font-sans text-[1.5rem] text-text-primary font-semibold mb-4">
                    {t("supportCenter.contactUsHeader")}
                  </h1>
                  <div className="w-20 h-[2px] rounded-full bg-blue-500 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {/* Support Center */}
                  <div className="bg-white rounded-lg p-8 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {t("supportCenter.supportCenterTitle")}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t("supportCenter.supportCenterDescription")}
                    </p>
                    <Button className="bg-primary hover:bg-[#063a68] text-white px-6 py-2 rounded-md mb-6">
                      {t("supportCenter.chatWithUsButton")}
                    </Button>
                    <p className="text-sm text-gray-500">
                      {t("supportCenter.supportCenterHours")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                  {/* Contact via Email */}
                  <div className="bg-white rounded-lg p-8 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {t("supportCenter.contactEmailTitle")}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t("supportCenter.contactEmailResponseTime")} {" "}
                      <span className="text-primary">{t("supportCenter.contactEmailResponseTimeHighlight")}</span>
                    </p>
                    <Button className="text-third bg-white border-1 border-gray-300 hover:bg-blue-50 px-6 py-2 rounded-md">
                      {t("supportCenter.sendEmailButton")}
                    </Button>
                  </div>
                  {/* Call */}
                  <div className="bg-white rounded-lg p-8 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {t("supportCenter.callUsTitle")}
                    </h3>
                    <p className="text-primary font-semibold text-lg mb-4">
                      {t("supportCenter.callUsPhone")}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {t("supportCenter.callUsHours")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("supportCenter.callUsClosed")}
                    </p>
                  </div>
                </div>

                {/* Add Line Section */}
                <div className="bg-white rounded-lg p-8 shadow-sm mt-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t("supportCenter.addLineTitle")}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {t("supportCenter.addLineDescription")}
                    </p>
                    <Button className="text-third bg-white border-1 border-gray-300 px-6 py-2 rounded-md">
                      {t("supportCenter.addLineButton")}
                    </Button>
                  </div>
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image
                      src={ContentIcon.qr}
                      alt="Line Icon"
                      width={96}
                      height={96}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default SupportCenter;
