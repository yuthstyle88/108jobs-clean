"use client"
import React, {createContext, useContext} from "react";
import {IsoData} from "@/utils/types";


const IsoDataContext = createContext<IsoData | undefined>(undefined);

export const IsoDataProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: IsoData;
}) => {
  return <IsoDataContext.Provider value={value}>{children}</IsoDataContext.Provider>;
};
export const useIsoData = () => {
  const context = useContext(IsoDataContext);
  if (!context) {
    throw new Error("useIsoData must be used within an IsoDataProvider");
  }
  return context;
}