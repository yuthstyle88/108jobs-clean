import {cookies} from "next/headers";
import {NextRequest} from "next/server";
import {SUPPORTED} from "@/utils/localeHref";
import {LANGUAGE_COOKIE} from "@/constants/language";
import {SupportedLang} from "@/lib/metadata";

type Lang = typeof SUPPORTED[number];

function langFromBrowser(req: NextRequest): Lang {
    const header = req.headers.get('accept-language') ?? '';
    const first = header.split(',')[0];
    return normalizeLang(first);
}

export function langFromPath(pathname: string): Lang | null {
    const m = pathname.match(/^\/([a-z]{2})(\/|$)/i);
    return m ? normalizeLang(m[1]) : null;
}

function normalizeLang(s?: string | null): Lang {
    const v = (s ?? '').toLowerCase().split('-')[0];
    return (SUPPORTED as readonly string[]).includes(v) ? (v as Lang) : 'en';
}
// Priority: Browser > Cookie > JWT > Path > Default('en')
export function resolveLanguage(args: { req: NextRequest; cookieLang?: string; jwtLang?: string; pathname: string }): Lang {
    const browserLng = langFromBrowser(args.req);
    const cookieLng = args.cookieLang;
    const jwtLng = args.jwtLang;
    const pathLng = langFromPath(args.pathname);
    return normalizeLang(browserLng || cookieLng || jwtLng || pathLng);
}

export async function getCookies(): Promise<SupportedLang | null> {
  const store = await cookies();

  // 1) language cookie (strict name)
  const langRaw = store.get(LANGUAGE_COOKIE)?.value ?? null;
  return (langRaw as SupportedLang | null);
}