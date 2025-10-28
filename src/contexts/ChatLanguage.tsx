"use client";
import {createContext, useContext} from "react";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";

type LanguageContextType = {
  languageData: Record<string, string>;
  isLoading: boolean;
  error: unknown;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const ChatLanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const languageData = getNamespace(LanguageFile.CHAT);

  const isLoading = false;
  const error = false;

  return (
    <LanguageContext.Provider value={{languageData, isLoading, error}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useChatLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
