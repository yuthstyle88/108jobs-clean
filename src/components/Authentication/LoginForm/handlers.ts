import {LoginResponse, OAuthProvider,} from "lemmy-js-client";
import {HttpService, UserService} from "@/services";
import {setIsoData} from "@/utils/app";
import {LoginFormClass} from "@/components/Authentication/LoginForm";
import {toast} from "@/toast";
import {LoginProps} from "@/components/Authentication/LoginForm/interface";
import getQueryParams from "@/utils/helpers";
import {isSuccess, REQUEST_STATE} from "@/services/HttpService";
import {getAppName} from "@/utils/appConfig";
import {isBrowser} from "@/utils";
import {t} from "i18next";

export const handleUseOAuthProvider = async (params: {
    oauthProvider: OAuthProvider;
    username?: string;
    prev?: string;
    answer?: string;
    showNsfw?: boolean;
}) => {
    const redirectUri = `${window.location.origin}/en/api/auth/callback/${params.oauthProvider.displayName}`;
    const state = crypto.randomUUID();
    const requestUri =
        params.oauthProvider.authorizationEndpoint +
        "?" +
        [
            `client_id=${encodeURIComponent(params.oauthProvider.clientId)}`,
            `response_type=code`,
            `scope=${encodeURIComponent(params.oauthProvider.scopes)}`,
            `redirect_uri=${encodeURIComponent(redirectUri)}`,
            `state=${state}`,
        ].join("&");

    localStorage.setItem(
        "oauthState",
        JSON.stringify({
            state,
            oauthProviderId: params.oauthProvider.id,
            redirectUri: redirectUri,
            prev: params.prev ?? "/",
            username: params.username,
            answer: getAppName(),
            expiresAt: Date.now() + 5 * 60_000,
        }),
    );

    window.location.assign(requestUri);
};

export const handleLogin = async (i: LoginFormClass, data: any) => {
    const {usernameOrEmail, password} = data;
    i.setState(prev => ({
        form: {
            ...prev.form,
            usernameOrEmail,
            password,
        }
    }));
    try {
        const loginRes = await HttpService.client.login({
            usernameOrEmail,
            password,
            totp2faToken: i.state.form.totp2faToken || undefined,
        });

        switch (loginRes.state) {
            case REQUEST_STATE.FAILED: {
                const {name} = loginRes.err ?? {};
                const {formMethods, t} = i.props;

                const errorActions: Record<string, () => void> = {
                    missingTotpToken: () => i.setState({show2faModal: true}),
                    userNotFound: () =>
                        formMethods.setError("usernameOrEmail", {
                            type: "manual",
                            message: t("authen.userNotFound"),
                        }),
                    default: () =>
                        formMethods.setError("password", {
                            type: "manual",
                            message: t("error.invalidPassword"),
                        }),
                };

                (errorActions[name ?? "default"] || errorActions.default)();
                i.setState({loginRes});
                break;
            }

            case REQUEST_STATE.SUCCESS: {
                await handleLoginSuccess(i, loginRes.data);
                break;
            }

            default:
                break;
        }

    } catch (error) {
        console.error(error);
        i.props.formMethods.setError("root",
            {
                type: "manual",
                message: i.props.t("systemError"),
            });
    }
};

export async function handleLoginSuccess(i: LoginFormClass, loginRes: LoginResponse) {
    UserService.Instance.login({
        res: loginRes,
    });

    const site = await HttpService.client.getSite();

    if (isSuccess(site)) {
        try {
            const isoData = setIsoData(i.context);
            if (isoData && isoData.siteRes) {
                isoData.siteRes.oauthProviders = site.data.oauthProviders;
                isoData.siteRes.adminOauthProviders = site.data.adminOauthProviders;
            }
        } catch (error) {
            console.error("Error updating isoData:",
                error);
        }
    }

    // ใช้ redirectUrl จาก props แทน prev
    const {redirectUrl} = i.props;

    // ทำแค่ redirect แบบ full reload เพื่อให้ server/middleware เห็นคุกกี้ใหม่ทันที
    if (isBrowser() && redirectUrl) {
      window.location.assign(redirectUrl || '/');
    }
}

export async function handleSubmitTotp(i: LoginFormClass, totp: string) {
    const {usernameOrEmail, password} = i.state.form;
    const {t} = i.props;

    i.setState(prev => ({
        form: {
            ...prev.form,
            totp2faToken: totp,
        },
    }));

    const loginRes = await HttpService.client.login({
        usernameOrEmail,
        password,
        totp2faToken: totp,
    });

    const successful = isSuccess(loginRes);
    if (successful) {
        await handleLoginSuccess(i,
            loginRes.data);
    } else {
        i.props.setApiError(t("totp.invalidCode"));
    }

    return successful;
}

export function getLoginQueryParams(source?: string): LoginProps {
    return getQueryParams<LoginProps>(
        {
            prev: (param?: string) => param,
        },
        source,
    );
}