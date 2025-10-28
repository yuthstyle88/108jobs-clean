"use client";
import {createContext, useContext, useEffect, useState} from "react";
import {VALID_LANGUAGES} from "@/constants/language";
import {I18NextService} from "@/services/I18NextService";
import {I18nextProvider} from "react-i18next";
import {setLangCookie} from "@/utils/browser";
import {getClientCurrentLanguage} from "@/utils/getClientCurrentLanguage";

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
        (async () => {
            try {
                i18nInitPromise ||= I18NextService.init();
                await i18nInitPromise;
                if(!active) return;
                await I18NextService.i18n.changeLanguage(lang);
            } catch (e) {
                console.warn('[LanguageProvider] changeLanguage failed', e);
            }
        })();
        return () => {
            active = false;
        };
    }, [lang]);

    const setLang = (newLang: string) => {
        if(!VALID_LANGUAGES.includes(newLang)) return;
        if(newLang === lang) return;
        setLangCookie(newLang);
        setLangState(newLang);
    };

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