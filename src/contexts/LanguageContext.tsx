"use client";
import React, {createContext, useContext, useEffect, useState} from "react";
import {VALID_LANGUAGES} from "@/constants/language";
import {I18NextService} from "@/services/I18NextService";
import {I18nextProvider} from "react-i18next";
import {setLangCookie} from "@/utils/browser";
import {buildLangRedirectTarget, getClientCurrentLanguage} from "@/utils/getClientCurrentLanguage";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

let i18nInitPromise: Promise<void> | null = null;

interface LanguageContextType {
    lang: string;
    setLang: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
    children: React.ReactNode;
    initialLang: string;
}

export function LanguageProvider({
    children,
    initialLang,
}: LanguageProviderProps) {
    const safeInitial = VALID_LANGUAGES.includes(initialLang) ? initialLang : 'th';
    // Initialize from client-side language resolver to ensure client consistency
    const [lang, setLangState] = useState<string>(() => {
        try {
            return getClientCurrentLanguage(true) || safeInitial;
        } catch {
            return safeInitial;
        }
    });
    const [ready, setReady] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize i18n ONCE, then mark ready
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                i18nInitPromise ||= I18NextService.init();
                await i18nInitPromise;
            } catch (e) {
                console.warn('[LanguageProvider] i18n init failed', e);
            } finally {
                if(!cancelled) setReady(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // On language changes, wait for init then switch language
    useEffect(() => {
        let active = true;
        const initAndSetLanguage = async () => {
            try {
                if (!i18nInitPromise) {
                    i18nInitPromise = I18NextService.init(); // make sure init sets i18n
                }
                await i18nInitPromise;
                if (!active) return;
                if (I18NextService.i18n) {
                    await I18NextService.i18n.changeLanguage(lang);
                }
            } catch (e) {
                console.warn('[LanguageProvider] changeLanguage failed', e);
            }
        };
        initAndSetLanguage();
        return () => { active = false; }
    }, [lang]);

    const setLang = (newLang: string) => {
        if(!VALID_LANGUAGES.includes(newLang)) return;
        console.log("setLang: ", newLang, " lang:", lang)
        if(newLang === lang) return;
        setLangCookie(newLang);
        setLangState(newLang);
        // Proactively switch i18n to new language so UI updates immediately
        try {
            if (!i18nInitPromise) {
                i18nInitPromise = I18NextService.init();
            }
            // Fire and forget; effect also ensures consistency
            i18nInitPromise.then(() => I18NextService.i18n.changeLanguage(newLang)).catch(() => {});
        } catch {}
        try {
            const search = searchParams?.toString();
            const hash = typeof window !== 'undefined' ? window.location.hash : '';
            const href = `${pathname ?? ''}${search ? `?${search}` : ''}${hash}`;
            const target = buildLangRedirectTarget(newLang, href);
            if (target) {
                // Use replace to avoid stacking history entries on language toggle
                router.replace(target);
            }
        } catch (e) {
            console.warn('[LanguageProvider] failed to build/perform language redirect', e);
        }
    };

    // Keep state/i18n in sync with URL when user navigates (e.g., links, back/forward)
    useEffect(() => {
        if (!pathname) return;
        const seg = pathname.split('/').filter(Boolean)[0];
        if (seg && VALID_LANGUAGES.includes(seg) && seg !== lang) {
            setLangState(seg);
            try {
                if (!i18nInitPromise) i18nInitPromise = I18NextService.init();
                i18nInitPromise.then(() => I18NextService.i18n.changeLanguage(seg)).catch(() => {});
            } catch {}
        }
    }, [pathname]);

    // Update <html lang="..."> attribute to reflect current language client-side
    useEffect(() => {
        try {
            if (typeof document !== 'undefined') {
                document.documentElement.setAttribute('lang', lang);
            }
        } catch {}
    }, [lang]);

    if(!ready) return null;

    return (
      <LanguageContext.Provider value={{lang, setLang}}>
          <I18nextProvider i18n={I18NextService.i18n} key={lang}>
              {children}
          </I18nextProvider>
      </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if(!context)
        throw new Error("useLanguage must be used within LanguageProvider");
    return context;
}