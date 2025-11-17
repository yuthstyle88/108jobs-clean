"use client";
import React, {createContext} from "react";

type LanguageContextType = {
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

    const isLoading = false;
    const error = false;

    return (
        <LanguageContext.Provider value={{isLoading, error}}>
            {children}
        </LanguageContext.Provider>
    );
};
