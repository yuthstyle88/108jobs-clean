'use client'
import React, {createContext, useContext, useState} from "react";

type GlobalLoaderContextType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showLoader: () => void;
  hideLoader: () => void;
};

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(
  undefined
);

export const GlobalLoaderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [count, setCount] = useState(0);
  const isLoading = count > 0;

  const showLoader = () => setCount(c => c + 1);
  const hideLoader = () => setCount(c => Math.max(0, c - 1));
  const setLoading = (loading: boolean) => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  };

  return (
    <GlobalLoaderContext.Provider
      value={{
        isLoading,
        setLoading,
        showLoader,
        hideLoader,
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