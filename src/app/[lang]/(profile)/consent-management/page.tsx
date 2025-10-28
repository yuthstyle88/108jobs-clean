"use client";

import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import Link from "next/link";
import {useState} from "react";

type Tab = "fastwork" | "all" | "thirdParty";
const ConsentManagement = () => {
  const [activeTab, setActiveTab] = useState<Tab>("fastwork");
  const [preferences, setPreferences] = useState({
    marketing: true,
    analytics: true,
  });

  const concentLanguageData = getNamespace(LanguageFile.CONSENT);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "fastwork":
        return (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg text-text-primary font-medium mb-2">
                {concentLanguageData?.newsletterPromotions}
              </h3>
              <p className="text-text-primary mb-4 font-sans">
                ยินยอมการรับข่าวสารและโปรโมชันที่พิเศษต่าง ๆ ผ่านทุกช่องทางจากเว็บไซต์นี้{" "}
                <Link prefetch={false} href="#" className="text-primary underline">
                  นโยบายคุ้มครองความเป็นส่วนตัว
                </Link>
              </p>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="preference"
                    className="w-4 h-4 text-primary"
                    checked={preferences.marketing}
                    onChange={() => handleToggle("marketing")}
                  />
                  <span className="text-text-primary">
                    {concentLanguageData?.newsletterAccept}
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="preference"
                    className="w-4 h-4 text-primary"
                    checked={!preferences.marketing}
                    onChange={() => handleToggle("marketing")}
                  />
                  <span className="text-text-primary">
                    {concentLanguageData?.newsletterDecline}
                  </span>
                </label>
              </div>
            </div>
          </div>
        );
      case "all":
        return (
          <div className="p-6">
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                เว็บไซต์นี้มีการเก็บและใช้งานคุกกี้เพื่อช่วยปรับปรุงพัฒนาประสบการณ์การใช้งานให้ดียิ่งขึ้นเมื่อคุณเข้าเยี่ยมชมเว็บไซต์ของเรา
                คุณสามารถเลือกให้ความยินยอมคุกกี้แต่ละประเภทได้
                (ยกเว้นคุกกี้ที่จำเป็น){" "}
                <Link prefetch={false} href="#" className="text-primary hover:underline">
                  นโยบายคุกกี้
                </Link>
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-text-primary mb-1">
                        {concentLanguageData?.functionalCookies}
                      </h4>
                      <p className="text-gray-600 text-sm font-sans">
                        {concentLanguageData?.functionalCookiesDescription}
                      </p>
                    </div>
                    <div className="ml-0 md:ml-6">
                      <button className="bg-gray-100 text-primary font-medium px-4 py-2 rounded-lg cursor-not-allowed">
                        เปิดใช้งานตลอด
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary mb-1">
                        {concentLanguageData?.marketingCookies}
                      </h4>
                      <p className="text-gray-600 text-sm font-sans">
                        {concentLanguageData?.marketingCookiesDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-0 md:ml-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="marketingCookie"
                          className="w-4 h-4 text-primary"
                          checked={preferences.marketing}
                          onChange={() => handleToggle("marketing")}
                        />
                        <span className="text-text-primary">{concentLanguageData?.newsletterAccept}</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="marketingCookie"
                          className="w-4 h-4 text-primary"
                          checked={!preferences.marketing}
                          onChange={() => handleToggle("marketing")}
                        />
                        <span className="text-text-primary">{concentLanguageData?.newsletterDecline}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1 text-text-primary">
                        {concentLanguageData?.analyticsCookies}
                      </h4>
                      <p className="text-gray-600 text-sm font-sans">
                        {concentLanguageData?.analyticsCookiesDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-0 md:ml-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="analyticsCookie"
                          className="w-4 h-4 text-primary"
                          checked={preferences.analytics}
                          onChange={() => handleToggle("analytics")}
                        />
                        <span className="text-text-primary">{concentLanguageData?.newsletterAccept}</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="analyticsCookie"
                          className="w-4 h-4 text-primary"
                          checked={!preferences.analytics}
                          onChange={() => handleToggle("analytics")}
                        />
                        <span className="text-text-primary">{concentLanguageData?.newsletterDecline}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "thirdParty":
        return (
          <div className="p-6">
            <div className="w-full text-center py-8 px-4 rounded-sm bg-[#F6F7F8] mt-2">
              <p className="text-[1.5rem] leading-[1.5] font-medium text-text-secondary">
                ไม่มีฟรีแลนซ์ที่ถูกใจ
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="w-full">
      <div className="grid-container-desktop-banner w-full my-4 md:my-12 min-h-[400px]">
        <div className="col-start-2 col-end-3 max-w-[800px]">
          <h1 className="text-[2.25rem] text-text-primary font-medium">
            {concentLanguageData?.dataManagement}
          </h1>
          <div className="mb-[2rem] text-text-primary font-sans">
            {concentLanguageData?.termsConditions}
            {/* อ่าน{" "}
            <Link prefetch={false}
              href="https://static.108jobs.com/contents/terms"
              className="text-third underline"
            >
              เงื่อนไขข้อตกลงการใช้บริการ
            </Link>{" "}
            และ{" "}
            <Link prefetch={false}
              href="https://static.108jobs.com/contents/privacy"
              className="text-third underline"
            >
              นโยบายคุ้มครองความเป็นส่วนตัว
            </Link> */}
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="border-b">
              <div className="flex">
                <button
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "fastwork"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("fastwork")}
                >
                  {concentLanguageData?.dataUsageFastwork}
                </button>
                <button
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "all"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  {concentLanguageData?.cookiesManagement}
                </button>
                <button
                  className={`px-6 py-4 font-medium text-sm ${
                    activeTab === "thirdParty"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("thirdParty")}
                >
                  {concentLanguageData?.thirdPartyDataSharing}
                </button>
              </div>
            </div>

            {renderTabContent()}

            <div className="p-6 border-t bg-gray-50">
              <button className="w-full bg-primary text-white font-medium py-2.5 px-4 rounded-lg hover:bg-[#063a68] transition-colors">
                {concentLanguageData?.saveData}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentManagement;
