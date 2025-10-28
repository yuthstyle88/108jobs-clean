"use client";
import {ProfileIcon} from "@/constants/icons";
import {LanguageFile} from "@/constants/language";

import Image from "next/image";
import {getNamespace} from "@/utils/i18nHelper";

export default function BusinessPage() {

  const companyInfoLanguageData = getNamespace(LanguageFile.COMPANY);

  return (
    <div>
      <div className="mb-6">
        <Image
          src={ProfileIcon.hiringInfo}
          alt="hiring-info"
          className="w-full h-full rounded-tl-lg rounded-tr-lg"
        />
        <div className="px-3 py-2 bg-[#E3EDFD] rounded-br-lg rounded-bl-lg">
          <ul className="font-sans">
            {/*{companyInfoLanguageData?.noteRequirements?.map((note, index) => (*/}
            {/*  <li key={index}>*/}
            {/*    <p className="text-[0.75rem] text-third">• {note}</p>*/}
            {/*  </li>*/}
            {/*))}*/}
          </ul>
        </div>
      </div>
      <div className="border-1 border-border-primary rounded-lg bg-white py-6">
        <div className="border-b-1 px-6">
          <h2 className="text-[16px] font-medium mb-2 text-text-primary">
            {companyInfoLanguageData?.sectionCompanyHiring}
          </h2>
          <p className="text-gray-600 mb-6 text-[14px] font-sans">
            {companyInfoLanguageData?.subtitleCompanyHiring}
          </p>
        </div>
        <div className="p-6">
          <label className="block text-sm text-text-primary font-semibold text-gray-600 mb-2">
            {companyInfoLanguageData?.labelTaxId}
          </label>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              className="sm:flex-1 border border-gray-300 rounded-lg px-3 py-2"
              placeholder={companyInfoLanguageData?.placeholderTaxId}
              defaultValue=""
            />
            <button className="sm:w-auto bg-primary text-white px-6 py-2 rounded-lg hover:bg-[#063a68] whitespace-nowrap">
              {companyInfoLanguageData?.buttonSearchCompany}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
