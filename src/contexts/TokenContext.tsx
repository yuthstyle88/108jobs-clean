import {createContext, useContext} from "react";

export const TokenContext = createContext<string | null>(null);

export const useAccessToken = () => {
  return useContext(TokenContext);
};