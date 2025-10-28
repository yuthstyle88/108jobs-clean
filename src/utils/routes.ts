// Route definitions for converting Lemmy Inferno Router to Next.js routing structure

// This list maps the routes to their corresponding Next.js page structure (for reference or generation tools)
// Actual pages should be placed under /app or /pages depending on routing mode
import {GetSiteResponse, MyUserInfo} from "lemmy-js-client";
import {InitialFetchRequest, IRouteProps, RouteData} from "@/utils/types";
import {LoginForm} from "@/components/Authentication/LoginForm";
import {LoginFetchConfig,} from "@/components/Authentication/LoginForm/interface";
import {getLoginQueryParams} from "@/components/Authentication/LoginForm/handlers";

type RouteComponentProps<PathPropsT> = {
  params: PathPropsT;
};

export interface IRoutePropsWithFetch<
  DataT extends RouteData,
  PathPropsT extends Record<string, string>,
  QueryPropsT extends object,
> extends IRouteProps {
  component: React.ComponentType<RouteComponentProps<PathPropsT> & QueryPropsT>;
  mountedSameRouteNavKey?: string;

  fetchInitialData?(
    req: InitialFetchRequest<PathPropsT, QueryPropsT>,
  ): Promise<DataT>;

  getQueryParams?(
    source: string | undefined,
    siteRes: GetSiteResponse,
    myUserInfo?: MyUserInfo,
  ): QueryPropsT;
}

export const routes: LoginFetchConfig[] = [
  {
    path: `/login/:id`,
    component: LoginForm,
    getQueryParams: getLoginQueryParams,
  } as LoginFetchConfig,
  {
    path: `/comment/:name`,
    component: LoginForm,
    getQueryParams: getLoginQueryParams,
  } as LoginFetchConfig,

];