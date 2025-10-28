"use client";
import React, {createContext, useContext, useState} from "react";
import {useTranslation} from "@/hooks/translation/useTranslation";

type GlobalErrorContextType = {
  error: string | null;
  setError: (message: string | null) => void;
  clearError: () => void;
};

const GlobalErrorContext = createContext<GlobalErrorContextType | undefined>(
  undefined,
);

export const GlobalErrorProvider = ({children}: {children: React.ReactNode}) => {
  const {t} = useTranslation(); // ใช้ Hook การแปลข้อความ
  const [error, setRawError] = useState<string | null>(null);

  const setError = (message: string | null) => {
    setRawError(message ? t(message) : null); // แปลงข้อความก่อนแสดง
  };

  const clearError = () => setRawError(null);

  return (
    <GlobalErrorContext.Provider value={{error, setError, clearError}}>
      {children}
    </GlobalErrorContext.Provider>
  );
};

export const useGlobalError = () => {
  const context = useContext(GlobalErrorContext);
  if (!context) {
    throw new Error("useGlobalError must be used within a GlobalErrorProvider");
  }
  return context;
};