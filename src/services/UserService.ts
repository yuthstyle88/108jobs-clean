import {clearAuthCookie, isBrowser, setAuthJWTCookie, setLangCookie} from "@/utils/browser";
import {jwtDecode} from "jwt-decode";
import {LoginResponse, MyUserInfo} from "lemmy-js-client";
import {HttpService} from "./index";
import {toast} from "sonner";
import {VALID_LANGUAGES} from "@/constants/language";

export interface Claims {
    acceptedTerms: boolean;
    isAdmin: boolean;
    sub: number;
    iss: string;
    iat: number;
    email: string;
    role: string;
    lang: string;
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

    public async login({
        res,
        showToast = false,
    }: {
        res: LoginResponse | string;
        showToast?: boolean;
    }): Promise<void> {
        if (isBrowser() && typeof res !== "string" && res.jwt) {
            if (showToast) {
                toast("loggedIn");
            }
            // 1) Client-side cookie (kept for immediate client state)
            setAuthJWTCookie(res.jwt);
            this.#setAuthInfo(res.jwt);
            this.#hydrateReadLastMap();

            // 2) Server-side cookie (so Next.js middleware sees it on the very next request)
            //    This expects a Next.js Route Handler at /api/session that sets HttpOnly cookies via Set-Cookie.
            //    Important: credentials: 'include' so the browser stores the cookie for this origin.
            try {
                await fetch('/api/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ jwt: res.jwt })
                });
            } catch (e) {
                console.warn('[UserService.login] Failed to POST /api/session', e);
            }

            // Give the browser a tiny moment to flush Set-Cookie I/O (helps Safari after OAuth/login)
            await new Promise<void>(r => setTimeout(r, 60));

            // 3) Language cookie (non-HttpOnly for client-side reads)
            if (!VALID_LANGUAGES.includes(this.currentLanguage)) return;
            setLangCookie(this.currentLanguage);
        }
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
            this.authInfo = undefined;
            this.myUserInfo = undefined;

            if (isBrowser()) {
                // Clear client-side cookies
                clearAuthCookie();

                // Invalidate session cookie on server (if exists)
                await fetch('/api/session', {
                    method: 'DELETE',
                    credentials: 'include',
                }).catch(() => {});

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
            this.currentLanguage = claims?.lang;
            this.acceptedTerms = Boolean(claims?.acceptedTerms);
        } catch {
            this.authInfo = { jwt } as AuthInfo;
            this.currentLanguage = this.currentLanguage || 'th';
            this.acceptedTerms = false;
        }
    }
}
