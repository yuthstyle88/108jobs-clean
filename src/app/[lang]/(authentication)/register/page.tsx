"use client";
import {AuthFormContainer} from "@/components/Authentication/AuthFormContainer";

import {RegisterForm} from "@/components/Authentication/RegisterForm";
import {AuthenticateIcon} from "@/constants/icons";
import {CategoriesImage} from "@/constants/images";
import {LanguageFile} from "@/constants/language";
import {RegisterDataProps} from "@/types/register-data";
import {getNamespace} from "@/utils/i18nHelper";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {VerifyOTPForm} from "@/components/Authentication/VerifyOTP";
import {useTranslation} from "react-i18next";

type ViewState = "register" | "verify-otp"  | "resend-otp";

export default function RegisterPage() {
  const {t} = useTranslation();
  const route = useRouter();
  const loginLanguageData = getNamespace(LanguageFile.AUTHEN);

  const [currentView, setCurrentView] = useState<ViewState>("register");
  const [dataDataRegister, setDataDataRegister] = useState<RegisterDataProps>();
  const [apiError, setApiError] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen bg-[#E3EDFD] grid 2xl:grid-cols-[1fr_1240px_1fr] lg:grid-cols-[1fr_984px_1fr] md:grid-cols-[1fr_768px_1fr] grid-cols-[12px_minmax(0,auto)12px]">
      <div className="flex justify-center items-center lg:flex-row lg:gap-[3rem] lg:justify-between col-start-2 col-end-3">
        <div className="hidden lg:flex m-auto flex-col gap-[5rem]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                {loginLanguageData?.titleHireThrough}
              </h2>
              <Image src={CategoriesImage.logodefault} alt="logo"/>
            </div>
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                {loginLanguageData?.subtitleSafeMoney}
              </h2>
            </div>
          </div>
          {/*<div className="flex gap-2 items-center">*/}
          {/*    <DotLottieReact*/}
          {/*        src="/lottie/concept-banner.lottie"*/}
          {/*        loop*/}
          {/*        autoplay*/}
          {/*    />*/}
          {/*</div>*/}
          <div className="grid gap-4 grid-cols-2">
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage1}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.labelGuaranteedPay}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage2}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.labelProfessionalLicense}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage3}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.labelRefundPolicy}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage4}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.labelHiringAdvice}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage5}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.labelFreelancerVerified}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 justify-center items-center py-[4rem] max-w-[500px] w-full h-full ">
          <Image
            className="lg:hidden block"
            src={CategoriesImage.logodefault}
            alt="logo"
          />
          {currentView === "register" && (
            <AuthFormContainer
              title={t("authen.titleCreateAccount")}
              onBack={() => route.push("/login")}
            >
              <RegisterForm
                setApiError={setApiError}
                switchToVerifyOTP={(data) => {
                  if (data) {
                    setDataDataRegister(data);
                    setCurrentView("verify-otp");
                  }
                }}
              />

            </AuthFormContainer>
          )}
          {currentView === "verify-otp" && (
            <AuthFormContainer
              title={t("authen.titleVerifyingCode")}
            >
              <VerifyOTPForm
                setApiError={setApiError}
                email={dataDataRegister}
              />
            </AuthFormContainer>
          )}
        </div>
      </div>
    </div>
  );
}
