"use client";
import LoadingCircle from "@/components/Common/Loading/LoadingCircle";
import {CustomInput} from "@/components/ui/InputField";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {HttpService, REQUEST_STATE,} from "@/services/HttpService";
import {useTranslation} from "react-i18next";
import {OAuthButtons} from "@/components/Authentication/LoginForm/oauth-provider";
import {OAuthProvider} from "lemmy-js-client";
import {handleUseOAuthProvider} from "@/components/Authentication/LoginForm/handlers";
import {useSearchParams} from "next/navigation";
import {getAppName} from "@/utils/appConfig";
import {useSiteStore} from "@/store/useSiteStore";

// Form schema definition
const createRegisterSchema = (t: any) => z
    .object({
        email: z.string().email(t("authen.invalidEmail")),
    });

interface RegisterFormProps {
    setApiError?: (err: string) => void;
    switchToVerifyOTP?: (data: { email: string }) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
                                                              switchToVerifyOTP,
                                                              setApiError,
                                                          }) => {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/";
    // Hooks
    const {t} = useTranslation();
    // State
    const [apiErrorState, setApiErrorState] = useState<string | null>(null);
    const {oauthProviders} = useSiteStore();
    // Use the provided setApiError function if available, otherwise use the local state setter
    const handleApiError = useCallback((err: string) => {
            if (setApiError) {
                setApiError(err);
            } else {
                setApiErrorState(err);
            }
        },
        [setApiError]);

    // Form setup
    const registerSchema = createRegisterSchema(t);
    const formMethods = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        criteriaMode: "all",
    });

    const {
        register,
        handleSubmit,
        formState: {isValid, errors, isSubmitting}
    } = formMethods;

    const handleLoginWithProvider = async (provider: OAuthProvider) => {
        await handleUseOAuthProvider({
            oauthProvider: provider,
            prev: redirectUrl,
        });
    };
    const onSubmit = useCallback(async (data: any) => {

            const registerRes = await HttpService.client.register({
                email: data.email,
                answer: getAppName(),
            });
            switch (registerRes.state) {
                case REQUEST_STATE.FAILED: {
                    const errName = registerRes.err?.name ?? "unknownError";
                    if (errName === "requireVerification" && switchToVerifyOTP) {
                        switchToVerifyOTP({email: data.email});
                    } else if (errName === "emailAlreadyExists") {
                        window.location.href = `/login?email-already-exists&redirect=${encodeURIComponent(redirectUrl)}&email=${encodeURIComponent(data.email)}`;
                    } else {
                        handleApiError(t(`authen.${errName}`));
                    }
                    break;
                }
                case REQUEST_STATE.SUCCESS: {
                    if (registerRes.data.verifyEmailSent) {
                        if (switchToVerifyOTP) {
                            switchToVerifyOTP({email: data.email});
                        }
                    }
                }
                    break;
            }
        },
        [switchToVerifyOTP, redirectUrl, handleApiError, t]);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {apiErrorState && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {t("authen.apiErrorState")}
                </p>
            )}
            {errors.root && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {errors.root.message}sss
                </p>
            )}
            <CustomInput
                label={t("authen.labelEmail")}
                type="email"
                name={"email"}
                placeholder={t("authen.placeholderEmail")}
                register={register("email")}
                error={errors.email?.message}
            />

            {apiErrorState && (
                <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                    {apiErrorState}
                </div>
            )}

            <div className="text-center">
                <button
                    type="submit"
                    className="submit-button py-3"
                    disabled={!isValid || isSubmitting}
                >
                    {isSubmitting ? <LoadingCircle/> : t("global.labelContinue")}
                </button>
            </div>

            {
                oauthProviders.length > 0 && (<div className="flex flex-col gap-3 mt-6">
                    <OAuthButtons providers={oauthProviders} onLogin={handleLoginWithProvider}
                                  label={t("authen.labelOrSignInWith")}/>
                </div>)
            }

        </form>
    );
};