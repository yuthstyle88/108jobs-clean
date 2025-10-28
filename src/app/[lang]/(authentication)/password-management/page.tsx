"use client";
import {AuthFormContainer} from "@/components/Authentication/AuthFormContainer";
import {ChangePassword} from "@/components/Authentication/ChangePassword";
import {ForgotPasswordForm} from "@/components/Authentication/ForgotPasswordForm";
import {AuthenticateIcon} from "@/constants/icons";
import {CategoriesImage} from "@/constants/images";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import {RegisterDataProps} from "@/types/register-data";
import Image from "next/image";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";


type ViewState =
  | "manage-password"
  | "forgot-password"
  | "change-password";

export default function PasswordManagePage() {
  const loginLanguageData = getNamespace(LanguageFile.AUTHEN);

  const params = useSearchParams();
  const viewParam = params.get("view") as ViewState | null;
  const tokenPassword = params.get("token");
  // Set currentView from viewParam only once on mount
  useEffect(() => {
      if (viewParam) {
        setCurrentView(viewParam);
      }
    },
    []);

  const [currentView, setCurrentView] = useState<ViewState>(
    viewParam ?? "forgot-password"
  );

  const [forgotEmail, setForgotEmail] = useState<RegisterDataProps>();

  // Load singUpData from sessionStorage if available, only on client

  return (
    <div
      className="min-h-screen bg-[#E3EDFD] grid 2xl:grid-cols-[1fr_1240px_1fr] lg:grid-cols-[1fr_984px_1fr] md:grid-cols-[1fr_768px_1fr] grid-cols-[12px_minmax(0,auto)12px]">
      <div className="flex justify-center items-center lg:flex-row lg:gap-[3rem] lg:justify-between col-start-2 col-end-3">
        <div className="hidden lg:flex m-auto flex-col gap-[4rem]">
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
          <div className="flex gap-2 items-center">
            <Image
              src={CategoriesImage.conceptbanner}
              alt="concept banner"
              className="h-[164px]"
            />
          </div>
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
          {currentView === "forgot-password" && (
            <AuthFormContainer
              title={loginLanguageData?.linkForgotPassword}
              onBack={() => setCurrentView("manage-password")}
            >
              <ForgotPasswordForm
                setForgotEmail={setForgotEmail}
                switchToVerifyForgotPassword={() =>
                  setCurrentView("manage-password")
                }
              />
            </AuthFormContainer>
          )}
          {currentView === "change-password" && (
            <AuthFormContainer
              title="Change Password"
              onBack={() => setCurrentView("manage-password")}
            >
              <ChangePassword
                token={tokenPassword as string}
              />
            </AuthFormContainer>
          )}
        </div>
      </div>
    </div>
  );
}
