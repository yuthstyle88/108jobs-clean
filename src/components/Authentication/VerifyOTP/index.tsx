"use client";
import {HttpService, UserService,} from "@/services";
import React, {useCallback, useState} from "react";

import {CustomInput} from "@/components/ui/InputField";
import {Trans, useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {REQUEST_STATE} from "@/services/HttpService";
import LoadingCircle from "@/components/Common/Loading/LoadingCircle";
import {RegisterDataProps} from "@/types/register-data";
import {getCurrentLanguage} from "@/utils/getCurrentLanguage";
import {getClientCurrentLanguage} from "@/utils/getClientCurrentLanguage";

const MAX_RESENDS = 3;
const RESEND_COOLDOWN = 20; // seconds

interface VerifyOTPProps {
    switchToVerifyEmail?: () => void;
    setApiError?: (err: string) => void;
    email?: RegisterDataProps;
}

const createOTPSchema = (t: any) => z
    .object({
        code: z.string().min(5, t("authen.invalidOTP")),
    });

export const VerifyOTPForm: React.FC<VerifyOTPProps> = ({
                                                            setApiError,
                                                            email,
                                                        }) => {
    // Hooks
    const {t} = useTranslation();
    // State
    const [apiErrorState, setApiErrorState] = useState<string | null>(null);
    const [apiSuccessState, setApiSuccessState] = useState<string | null>(null);
    const [resendCount, setResendCount] = useState<number>(0);
    const [cooldown, setCooldown] = useState<number>(0);

    React.useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // Use the provided setApiError function if available, otherwise use the local state setter
    const handleApiError = useCallback((err: string) => {
            if (setApiError) {
                setApiError(err);
                setApiErrorState(err);
            }
        },
        [setApiError]);
    // Form setup
    const otpSchema = createOTPSchema(t);
    const formMethods = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        mode: "onChange",
        criteriaMode: "all",
    });
    const {
        register,
        handleSubmit,
        formState: {isValid, errors, isSubmitting}
    } = formMethods;
    const onSubmit = useCallback(async (data: any) => {

            const verifyRes = await HttpService.client.verifyEmail({
                code: data.code,
            });
            switch (verifyRes.state) {
                case REQUEST_STATE.FAILED: {
                    handleApiError(verifyRes.err.name ?? "Error: VerifyOTPForm error");
                    setApiErrorState(
                        verifyRes.err.name ?? "unknownError"
                    )
                    setApiSuccessState(null);
                    break;
                }
                case REQUEST_STATE.SUCCESS: {
                    try {
                      if (typeof window !== 'undefined') {
                        // Stash the server verify payload for post-terms login
                        sessionStorage.setItem('pendingLogin', JSON.stringify(verifyRes.data.jwt));
                      }
                    } catch {}
                    // Redirect to terms first; that page will read `pendingLogin` and call login after acceptance
                    const lang = getClientCurrentLanguage();
                    window.location.href = `/${lang}/update-terms?email=${encodeURIComponent(email?.email || "")}`;
                    break;
                }
                    break;
            }
        },
        [email?.email, handleApiError]);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <p className="text-text-primary text-gray-600 text-sm">
                <Trans
                    i18nKey="authen.enterCodeWithEmail"
                    components={{strong: <span className="text-blue-700 font-semibold break-all"/>}}
                    values={{email: email?.email || ""}}
                />
            </p>
            <p className="text-gray-600 text-sm mt-1">
                {t("authen.checkSpamHint", { defaultValue: "If you don’t see the email in your inbox, please check your spam or junk folder." })}
            </p>
            <CustomInput
                label={t("authen.labelOTP")}
                type="string"
                name={"code"}
                placeholder={t("authen.placeholderOTP")}
                register={register("code")}
                error={errors.code?.message}
            />

            <div className="text-center">
                <button
                    type="submit"
                    className="submit-button py-3"
                    disabled={!isValid || isSubmitting}
                >
                    {isSubmitting ? <LoadingCircle/> : t("global.labelContinue")}
                </button>
            </div>
            <div className="text-center">
                <button
                    type="button"
                    disabled={isSubmitting || cooldown > 0 || resendCount >= MAX_RESENDS}
                    onClick={async () => {
                        if (resendCount >= MAX_RESENDS) {
                            setApiErrorState(t("authen.resendLimitReached"));
                            return;
                        }
                        if (cooldown > 0) return;

                        const emailString: string = email?.email || "";
                        const resendRes = await HttpService.client.resendVerificationEmail({
                            email: emailString,
                        });
                        if (resendRes.state === REQUEST_STATE.FAILED) {
                            handleApiError(resendRes.err.name ?? "Error: resendOTPForm error");
                            setApiErrorState(
                                resendRes.err.name ?? "unknownError"
                            )
                        } else {
                            setApiErrorState(null);
                            setApiSuccessState(t("authen.resendEmailSuccess"));
                            setResendCount((c) => c + 1);
                            setCooldown(RESEND_COOLDOWN);
                        }
                    }}
                    className="text-text-primary text-gray-800 text-sm font-sans"
                >
                    <>
                      {t("authen.resendEmail")} {resendCount > 0 ? `(${resendCount}/${MAX_RESENDS})` : null}
                      {cooldown > 0 ? ` – ${cooldown}s` : ""}
                    </>
                </button>
                <p className="text-xs text-gray-800 mt-1">
                  {t("authen.resendEmail")}: {resendCount}/{MAX_RESENDS}
                </p>
                {apiErrorState && (
                    <p className="text-red-500 text-sm text-center mb-4">
                        {t("authen.notFound")}
                    </p>
                )}
                {errors.root && (
                    <p className="text-red-500 text-sm text-center mb-4">
                        {errors.root.message}
                    </p>
                )}
                {apiSuccessState && (
                    <p className="text-green-500 text-sm text-center mb-4">
                        {apiSuccessState}
                    </p>
                )}
            </div>
        </form>
    );
};
