import React from "react";
import {RequestState} from "@/services/HttpService";
import {GetSiteResponse, LoginResponse, PublicOAuthProvider,} from "lemmy-js-client";
import {RouteData} from "@/utils/types"
import {IRoutePropsWithFetch} from "@/utils/routes";

export interface LoginFormProps {
  formState: {
    usernameOrEmail: string;
    password: string;
    totp2faToken?: string;
  };
  setFormState: React.Dispatch<
    React.SetStateAction<{
      usernameOrEmail: string;
      password: string;
      totp2faToken?: string;
    }>
  >;
  switchToRegister: () => void;
  switchToForgotPassword: () => void;
}


export interface State {
  loginRes: RequestState<LoginResponse>;
  form: {
    usernameOrEmail: string;
    password: string;
    totp2faToken?: string;
  };

  siteRes: GetSiteResponse | null;
  show2faModal: boolean;
  showOAuthModal: boolean;
  showPassword: boolean;
  oauthProviders: PublicOAuthProvider[];
  hasFetchedSite: boolean;
}

export interface LoginFormState {
  showPassword: boolean;
  oauthProviders: PublicOAuthProvider[];
  hasFetchedSite: boolean;
}

export interface LoginProps {
  prev?: string;
}

export type LoginFetchConfig = IRoutePropsWithFetch<
  RouteData,
  Record<string, never>,
  LoginProps
>;