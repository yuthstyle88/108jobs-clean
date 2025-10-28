'use client'
import React, {createContext, useContext, useState} from "react";

type GlobalLoaderContextType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(
  undefined
);

export const GlobalLoaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GlobalLoaderContext.Provider
      value={{
        isLoading,
        setLoading: setIsLoading,
      }}
    >
      {children}
    </GlobalLoaderContext.Provider>
  );
};

export const useGlobalLoader = () => {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error(
      "useGlobalLoader must be used within a GlobalLoaderProvider"
    );
  }
  return context;
};