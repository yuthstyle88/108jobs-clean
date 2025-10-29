import { NextRequest, NextResponse } from 'next/server';
import {LANGUAGE_COOKIE} from "@/constants/language";
import {isHttps, JWT} from "@/utils";
import {langFromPath, resolveLanguage} from "@/utils/getCookies";
import {getJwtCookieFromServer, isJwtExpired, parseJwtClaims} from "@/utils/helper-server";

const LOCALE_RE = /^\/([a-z]{2})(\/|$)/i;

function stripLocalePrefix(pathname: string) {
  return pathname.replace(LOCALE_RE, '/');
}
// Disable protection: make all routes public
const PROTECTED_PATHS: string[] = ['/chat', '/profile' ,'/account-setting', '/admin'];


export async function proxy(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    const pathLngCurrent = langFromPath(pathname);

    const rawCookie = (await getJwtCookieFromServer()) ?? "";
    // Normalize token (some environments may store it with a 'Bearer ' prefix)
    const token = rawCookie.startsWith("Bearer ") ? rawCookie.slice(7).trim() : rawCookie;
    const sid = Boolean(token) && !isJwtExpired(token);
    // Read claims from JWT (Edge-safe decode, no verification). Fall back to cookie when absent.
    let jwtLang: string | undefined;
    try {
        const claims = parseJwtClaims(rawCookie) as any;
        jwtLang = typeof claims?.lang === 'string' ? claims.lang : undefined;
    } catch {}
    // If the user is signed-in and the token does not explicitly confirm acceptance, assume they still need to accept.

    // Priority: Browser > Cookie > JWT > Path > Default('en')
    const cookieLng = req.cookies.get(LANGUAGE_COOKIE)?.value ?? '';
    const effectiveLng = resolveLanguage({ req, cookieLang: cookieLng, jwtLang, pathname });
    const cookieTargetLng = pathLngCurrent ?? effectiveLng;

    const setLangCookie = (resp: NextResponse, value: string) => {
        resp.cookies.set(LANGUAGE_COOKIE, value, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
            secure: isHttps(req),
        });
        return resp;
    };

    // --- protect dynamic routes ---
    const pathNoLang = stripLocalePrefix(pathname);
    const isProtected = PROTECTED_PATHS.some((p) => pathNoLang.startsWith(p));
    const isOnLogin = /^\/[a-z]{2}\/login(\/|$)/i.test(pathname);
    if (isProtected && !sid && !isOnLogin) {
        const login = new URL(`/${effectiveLng}/login`, req.url);
        login.searchParams.set('next', pathname + search);
        const resp = NextResponse.redirect(login);
        if (cookieLng !== cookieTargetLng) setLangCookie(resp, cookieTargetLng);
        return resp;
    }

    // --- i18n auto prefix + persist cookie ---
    if (!langFromPath(pathname)) {
        const target = new URL(`/${effectiveLng}${pathname}${search}`, req.url);
        // Prevent redirect loop: only redirect when the path actually changes
        if (target.pathname !== pathname || target.search !== search) {
            const resp = NextResponse.redirect(target);
            if (cookieLng !== cookieTargetLng) setLangCookie(resp, cookieTargetLng);
            return resp;
        }
    }
    const resp = NextResponse.next();
    if (cookieLng !== cookieTargetLng) setLangCookie(resp, cookieTargetLng);
    return resp;
}

// --- matcher (exclude static) ---
export const config = {
    matcher: [
        // everything except Next internals, static assets, api and uploads
        '/((?!_next|static|fonts|images|favicon|robots|sitemap|lottie|api|uploads).*)',
    ],
};