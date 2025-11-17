"use client";
import React, {createContext, useContext, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {VALID_LANGUAGES, LANGUAGE_COOKIE} from "@/constants/language";
import {I18NextService} from "@/services/I18NextService";
import {I18nextProvider} from "react-i18next";
import {setLangCookie} from "@/utils/browser";

interface LanguageContextType {
    lang: string;
    setLang: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({children, initialLang}: { children: React.ReactNode; initialLang?: string }) {
    const pathname = usePathname();
    const segments = pathname?.split("/") || [];
    const langFromUrl = segments[1] && VALID_LANGUAGES.includes(segments[1]) ? segments[1] : undefined;

    const safeInitial = langFromUrl || initialLang || "en";
    const [lang, setLangState] = useState(safeInitial);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                await I18NextService.init();
                if (!cancelled) {
                    await I18NextService.i18n.changeLanguage(lang);
                    setReady(true);
                }
            } catch (e) {
                console.warn("[LanguageProvider] i18n init failed", e);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Update i18n whenever lang changes
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                await I18NextService.i18n.changeLanguage(lang);
                setLangCookie(lang); // sync cookie
            } catch (e) {
                console.warn("[LanguageProvider] changeLanguage failed", e);
            }
        })();
        return () => {
            active = false;
        };
    }, [lang]);

    const setLang = (newLang: string) => {
        if (!VALID_LANGUAGES.includes(newLang)) return;
        if (newLang === lang) return;
        setLangState(newLang);
    };

    if (!ready) return null;

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
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
}
