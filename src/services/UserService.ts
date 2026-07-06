import {clearAuthCookie, getRefreshTokenCookie, isBrowser, setAuthJWTCookie, setLangCookie, setRefreshTokenCookie} from "@/utils/browser";
import {jwtDecode} from "jwt-decode";
import {MyUserInfo} from "108jobs-client";
import {HttpService} from "./index";
import {isSuccess} from "./HttpService";
import {toast} from "sonner";
import {VALID_LANGUAGES} from "@/constants/language";

export const JOBS_ADMIN_ROLE = "jobs:admin";

export interface Claims {
    sub: string;
    iss: string;
    aud: string;
    exp: number;
    iat: number;
    roles: string[];
    realm: string;
    platform: string;
    tenant_id: string;
}

export function isAdminClaims(claims?: Claims): boolean {
    return Array.isArray(claims?.roles) && claims.roles.includes(JOBS_ADMIN_ROLE);
}

interface AuthInfo {
    claims?: Claims;
    auth?: string;
    sharedKey?: CryptoKey;
}

export class UserService {
    static #instance: UserService;
    public myUserInfo?: MyUserInfo;
    public authInfo?: AuthInfo;
    public currentLanguage: string = "th";
    public acceptedTerms: boolean = false;

    private constructor() {
        this.#setAuthInfo();
        this.#hydrateReadLastMap();
        this.#scheduleRefresh();
    }

    public static get Instance() {
        return this.#instance || (this.#instance = new this());
    }

    get getLanguage(): string {
        return this.currentLanguage;
    }

    get getAcceptedTerms(): boolean {
        return this.acceptedTerms;
    }

    get isLoggedIn() {
        return Boolean(this.authInfo?.auth);
    }

    public async login(accessToken: string, refreshToken?: string, showToast = false): Promise<void> {
        if (!isBrowser() || !accessToken) return;

        if (showToast) {
            toast("loggedIn");
        }
        // Client-side cookie. proxy.ts's middleware reads this same cookie
        // (falls back to authCookieName when the "jwt"-named cookie is absent),
        // so it's already visible to SSR/middleware on the very next request --
        // no separate server-side HttpOnly cookie round trip is needed.
        setAuthJWTCookie(accessToken);
        if (refreshToken) setRefreshTokenCookie(refreshToken);
        this.#setAuthInfo(accessToken);
        this.#hydrateReadLastMap();
        this.#scheduleRefresh();

        // Profile fields (language, accepted-terms) no longer live on the JWT --
        //    fetch them once from the real API. Falls back to existing defaults on
        //    failure rather than blocking login: the user is still logged in even
        //    if this one call hiccups, and the next getMyUser()-backed page load
        //    will pick up the real values.
        try {
            const myUser = await HttpService.client.getMyUser();
            if (isSuccess(myUser)) {
                this.myUserInfo = myUser.data;
                const localUser = myUser.data.localUserView.localUser;
                this.currentLanguage = localUser.interfaceLanguage || this.currentLanguage || 'th';
                this.acceptedTerms = Boolean(localUser.acceptedTerms);
            }
        } catch (e) {
            console.warn('[UserService.login] Failed to hydrate profile via getMyUser()', e);
        }

        // 4) Language cookie (non-HttpOnly for client-side reads)
        if (!VALID_LANGUAGES.includes(this.currentLanguage)) return;
        setLangCookie(this.currentLanguage);
    }

    public async setToken(jwt: string): Promise<void> {
      if (!jwt) return;
      try {
        // Set client cookie
        setAuthJWTCookie(jwt);
        // Update auth info
        this.#setAuthInfo(jwt);

      } catch (e) {
        console.warn('[UserService.setToken] Failed to set token', e);
      }
    }

    public async logout() {
        try {
            this.#clearRefreshTimer();
            this.authInfo = undefined;
            this.myUserInfo = undefined;

            if (isBrowser()) {
                // Clear client-side cookies
                clearAuthCookie();

                // Clear possible legacy cache
                window.caches?.delete?.('instance-cache');
            }

            // Notify backend logout endpoint safely
            try {
                await HttpService.client.logout();
            } catch {}

            // Redirect to language-aware login/home page
            const lang = (this.currentLanguage && this.currentLanguage === "browser") ? "th" : this.currentLanguage;
            const redirectPath = `/${lang}/login`;
            setTimeout(() => {
                if (isBrowser()) location.replace(redirectPath);
            }, 150);
        } catch (err) {
            console.warn('[UserService.logout] failed', err);
            if (isBrowser()) location.replace('/');
        }
    }

    public auth(throwErr = false): string | undefined {
        const auth = this.authInfo?.auth;

        if(auth) {
            return auth;
        } else {
            const msg = "No JWT cookie found";

            if(throwErr && isBrowser()) {
                console.error(msg);
                toast("notLoggedIn");
            }

            return undefined;
            // throw msg;
        }
    }

    #hydrateReadLastMap() {
        if(!isBrowser()) return;
        try {
            if(!this.authInfo) this.authInfo = {auth: ""} as AuthInfo;
        } catch {
            if(!this.authInfo) this.authInfo = {auth: ""} as AuthInfo;

        }
    }

    #setAuthInfo(jwt?: string) {
        try {
            const claims = jwtDecode<Claims>(jwt ?? "");
            this.authInfo = { auth: jwt, claims };
        } catch {
            this.authInfo = { jwt } as AuthInfo;
        }
    }

    static readonly #REFRESH_MARGIN_MS = 60_000;
    #refreshTimer?: ReturnType<typeof setTimeout>;

    #scheduleRefresh() {
        this.#clearRefreshTimer();
        if (!isBrowser()) return;
        const claims = this.authInfo?.claims;
        const refreshToken = getRefreshTokenCookie();
        if (!claims?.exp || !refreshToken) return;
        const delay = Math.max(0, claims.exp * 1000 - Date.now() - UserService.#REFRESH_MARGIN_MS);
        this.#refreshTimer = setTimeout(() => {
            void this.#refreshAccessToken();
        }, delay);
    }

    #clearRefreshTimer() {
        if (this.#refreshTimer) clearTimeout(this.#refreshTimer);
        this.#refreshTimer = undefined;
    }

    async #refreshAccessToken() {
        const refreshToken = getRefreshTokenCookie();
        if (!refreshToken) return;
        try {
            const res = await HttpService.client.refreshWithIdentityPlatform({ refreshToken });
            if (isSuccess(res)) {
                setAuthJWTCookie(res.data.accessToken);
                setRefreshTokenCookie(res.data.refreshToken);
                this.#setAuthInfo(res.data.accessToken);
                this.#scheduleRefresh();
            } else {
                await this.logout();
            }
        } catch (e) {
            console.warn('[UserService.refreshAccessToken] refresh failed, logging out', e);
            await this.logout();
        }
    }
}
