import {clearAuthCookie, getAuthJWTCookie, getRefreshTokenCookie, isBrowser, setAuthJWTCookie, setLangCookie, setRefreshTokenCookie} from "@/utils/browser";
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
        this.#scheduleRefresh();

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
    static readonly #REFRESH_RETRY_DELAY_MS = 3_000;
    static readonly #MAX_REFRESH_RETRIES = 2;
    static readonly #REFRESH_LOCK_NAME = "108jobs-refresh-token-lock";
    #refreshTimer?: ReturnType<typeof setTimeout>;

    #scheduleRefresh() {
        this.#clearRefreshTimer();
        if (!isBrowser()) return;
        const claims = this.authInfo?.claims;
        const refreshToken = getRefreshTokenCookie();
        if (!claims?.exp || !refreshToken) return;
        const delay = Math.max(0, claims.exp * 1000 - Date.now() - UserService.#REFRESH_MARGIN_MS);
        this.#refreshTimer = setTimeout(() => {
            this.#refreshAccessTokenCoordinated();
        }, delay);
    }

    #clearRefreshTimer() {
        if (this.#refreshTimer) clearTimeout(this.#refreshTimer);
        this.#refreshTimer = undefined;
    }

    // Re-reads the *current* access-token cookie (not this tab's possibly-stale
    // in-memory claims) and adopts it if it's already fresh enough that no
    // refresh is needed right now -- the case where another tab already
    // refreshed while this tab was scheduled or queued for the lock. Returns
    // true if it adopted (caller should not attempt a network refresh).
    #adoptCookieIfFresh(): boolean {
        const currentToken = getAuthJWTCookie();
        if (!currentToken) return false;
        let claims: Claims;
        try {
            claims = jwtDecode<Claims>(currentToken);
        } catch {
            return false;
        }
        if (!claims.exp || claims.exp * 1000 - Date.now() <= UserService.#REFRESH_MARGIN_MS) return false;
        this.#setAuthInfo(currentToken);
        this.#scheduleRefresh();
        return true;
    }

    // Entry point the scheduled timer calls. When the Web Locks API is
    // available, wraps the attempt in a per-origin exclusive lock so at most
    // one tab is ever inside #refreshAccessToken at a time -- eliminating the
    // multi-tab race at its source rather than narrowing its timing window.
    // Falls back to today's unlocked behavior (round-1/2 mitigation still
    // active) when navigator.locks doesn't exist.
    #refreshAccessTokenCoordinated(): void {
        const attempt = async () => {
            if (this.#adoptCookieIfFresh()) return;
            await this.#refreshAccessToken();
        };
        if (typeof navigator !== "undefined" && "locks" in navigator) {
            void navigator.locks.request(UserService.#REFRESH_LOCK_NAME, attempt).catch((e) => {
                console.warn("[UserService.refreshAccessTokenCoordinated] lock request failed", e);
            });
        } else {
            void attempt();
        }
    }

    async #refreshAccessToken(retryCount = 0) {
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
                await this.#handleRefreshFailure(refreshToken, retryCount);
            }
        } catch (e) {
            console.warn('[UserService.refreshAccessToken] refresh attempt failed', e);
            await this.#handleRefreshFailure(refreshToken, retryCount);
        }
    }

    // A failed refresh is not necessarily a dead session. Two recoverable
    // cases: another open tab may have already rotated the (origin-shared)
    // refresh-token cookie -- Identity-Platform invalidates the old token
    // the instant any tab's rotation succeeds, so if the cookie no longer
    // matches what we just sent, a sibling tab won the race and we can
    // retry immediately with its fresh value; or the failure was a plain
    // transient network blip, worth one delayed retry. Only give up and
    // log out once retries are exhausted or the access token has actually
    // expired -- logging out immediately on the first failure would tear
    // down every tab's session over an ordinary multi-tab race.
    async #handleRefreshFailure(attemptedRefreshToken: string, retryCount: number) {
        const exp = this.authInfo?.claims?.exp;
        const stillValid = Boolean(exp) && exp! * 1000 > Date.now();
        const canRetry = stillValid && retryCount < UserService.#MAX_REFRESH_RETRIES;
        if (canRetry) {
            const siblingAlreadyRotated = getRefreshTokenCookie() !== attemptedRefreshToken;
            this.#clearRefreshTimer();
            this.#refreshTimer = setTimeout(() => {
                void this.#refreshAccessToken(retryCount + 1);
            }, siblingAlreadyRotated ? 0 : UserService.#REFRESH_RETRY_DELAY_MS);
            return;
        }
        await this.logout();
    }
}
