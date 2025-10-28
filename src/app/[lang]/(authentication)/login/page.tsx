"use client";
import {AuthFormContainer} from "@/components/Authentication/AuthFormContainer";
import {ForgotPasswordForm} from "@/components/Authentication/ForgotPasswordForm";
import {LoginForm} from "@/components/Authentication/LoginForm";
import VerificationForgotPassword from "@/components/Authentication/VerifyForgotPassword";
import {AuthenticateIcon} from "@/constants/icons";
import {CategoriesImage} from "@/constants/images";
import {RegisterDataProps} from "@/types/register-data";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {DotLottieReact} from "@lottiefiles/dotlottie-react";

type ViewState = "login" | "forgot-password" | "verify-forgot-password";

export default function LoginPage() {
  const {t} = useTranslation();

  const params = useSearchParams();
  const viewParam = params.get("view") as ViewState | null;

  // Set currentView from viewParam only once on mount
  useEffect(() => {
      if (viewParam) {
        setCurrentView(viewParam);
      }
    },
    []);

  const [currentView, setCurrentView] = useState<ViewState>("login");

  const [forgotEmail, setForgotEmail] = useState<RegisterDataProps>();
  // Load singUpData from sessionStorage if available, only on client
  const route = useRouter();

  return (
    <div
      className="min-h-screen bg-[#E3EDFD] grid 2xl:grid-cols-[1fr_1240px_1fr] lg:grid-cols-[1fr_984px_1fr] md:grid-cols-[1fr_768px_1fr] grid-cols-[12px_minmax(0,auto)12px]">
      <div className="flex justify-center items-center lg:flex-row lg:gap-[3rem] lg:justify-between col-start-2 col-end-3">
        <div className="hidden lg:flex m-auto flex-col gap-[4rem]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                {t("authen.titleHireThrough")}
              </h2>
              <Image src={CategoriesImage.logodefault} alt="logo"/>
            </div>
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                {t("authen.subtitleSafeMoney")}
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
                {t("authen.labelGuaranteedPay")}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage2}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {t("authen.labelProfessionalLicense")}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage3}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {t("authen.labelRefundPolicy")}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage4}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {t("authen.labelHiringAdvice")}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage5}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {t("authen.labelFreelancerVerified")}
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
          {currentView === "login" && (
            <AuthFormContainer title={t("authen.titleLoginForm")}>
              <LoginForm
                switchToRegister={() => route.push("/register")}
                switchToForgotPassword={() => setCurrentView("forgot-password")}
              />
            </AuthFormContainer>
          )}
          {currentView === "forgot-password" && (
            <AuthFormContainer
              title={t("authen.linkForgotPassword")}
              onBack={() => setCurrentView("login")}
            >
              <ForgotPasswordForm
                setForgotEmail={setForgotEmail}
                switchToVerifyForgotPassword={() =>
                  setCurrentView("verify-forgot-password")
                }
              />
            </AuthFormContainer>
          )}
          {currentView === "verify-forgot-password" && (
            <AuthFormContainer
              title="Forgot password"
              onBack={() => setCurrentView("forgot-password")}
            >
              <VerificationForgotPassword forgotEmail={forgotEmail}/>
            </AuthFormContainer>
          )}
        </div>
      </div>
    </div>
  );
}
