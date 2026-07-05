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
import {OAuthProvider} from "108jobs-client";
import {handleUseOAuthProvider} from "@/components/Authentication/LoginForm/handlers";
import {useSearchParams} from "next/navigation";
import {useSiteStore} from "@/store/useSiteStore";
import {UserService} from "@/services";
import {jwtDecode} from "jwt-decode";
import {isAdminClaims, Claims} from "@/services/UserService";

// Form schema definition
const createRegisterSchema = (t: any) => z
    .object({
        username: z.string().min(3, t("authen.usernameMin3")).max(32, t("authen.usernameMax32")),
        email: z.string().email(t("authen.invalidEmail")),
        password: z.string().min(6, t("authen.passwordMin6")),
        passwordVerify: z.string().min(6, t("authen.passwordMin6")),
    })
    .refine((data) => data.password === data.passwordVerify, {
        message: t("authen.passwordMismatch"),
        path: ["passwordVerify"],
    });

interface RegisterFormProps {
    setApiError?: (err: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
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
            const registerRes = await HttpService.client.registerWithIdentityPlatform({
                username: data.username,
                email: data.email,
                password: data.password,
                selfPromotion: false,
            });
            switch (registerRes.state) {
                case REQUEST_STATE.FAILED: {
                    const errName = registerRes.err?.name ?? "unknownError";
                    if (errName === "emailAlreadyExists") {
                        window.location.href = `/login?email-already-exists&redirect=${encodeURIComponent(redirectUrl)}&email=${encodeURIComponent(data.email)}`;
                    } else {
                        handleApiError(t(`authen.${errName}`));
                    }
                    break;
                }
                case REQUEST_STATE.SUCCESS: {
                    await UserService.Instance.login(registerRes.data.accessToken);
                    const claims = jwtDecode<Claims>(registerRes.data.accessToken);
                    if (isAdminClaims(claims)) {
                        window.location.href = "/admin/dashboard";
                        break;
                    }
                    window.location.href = redirectUrl;
                    break;
                }
            }
        },
        [redirectUrl, handleApiError, t]);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {apiErrorState && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {t("authen.apiErrorState")}
                </p>
            )}
            {errors.root && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {errors.root.message}
                </p>
            )}
            <CustomInput
                label={t("authen.labelUsername")}
                type="text"
                name={"username"}
                placeholder={t("authen.placeholderUsername")}
                register={register("username")}
                error={errors.username?.message}
            />

            <CustomInput
                label={t("authen.labelEmail")}
                type="email"
                name={"email"}
                placeholder={t("authen.placeholderEmail")}
                register={register("email")}
                error={errors.email?.message}
            />

            <CustomInput
                label={t("authen.labelPassword")}
                type="password"
                name={"password"}
                placeholder={t("authen.placeholderPassword")}
                register={register("password")}
                error={errors.password?.message}
            />

            <CustomInput
                label={t("authen.labelPasswordVerify")}
                type="password"
                name={"passwordVerify"}
                placeholder={t("authen.placeholderPasswordVerify")}
                register={register("passwordVerify")}
                error={errors.passwordVerify?.message}
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