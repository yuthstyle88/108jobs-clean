/**
 * Server-side data fetching function for Next.js
 *
 * This function fetches initial data for server-side rendering, including:
 * - Site configuration
 * - User information (if authenticated)
 * - Route-specific data based on the current URL
 *
 * @param url The current URL being rendered
 * @param incomingHeaders HTTP headers from the incoming request
 * @returns An IsoData object containing all necessary data for rendering, or null if an error occurred
 */
import {FailedRequestState, RequestState, wrapClient} from "@/services/HttpService";
import {isAuthPath} from "@/utils/app";
import {getErrorPageData,  matchPath } from "@/utils/helpers";
import {Match} from "@/utils/router";
import {routes} from "@/utils/routes";
import {ErrorPageData, IsoData, RouteData} from "@/utils/types";
import {parsePath} from "history";
import {IncomingHttpHeaders} from "http";
import {GetSiteResponse, LemmyHttp, ListCommunitiesResponse, MyUserInfo} from "lemmy-js-client";
import {getHttpBase} from "@/utils";
import {getJwtCookieFromServer, setForwardedHeaders} from "@/utils/helper-server";

/**
 * Optimized logger that conditionally logs based on environment
 * - In development: Provides detailed logs for debugging
 * - In production: Minimizes logging to improve performance
 */
const logger = {
    /**
     * Log debug messages (development only)
     */
    debug: (message: string, ...args: any[]) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[fetchIsoData] ${message}`,
                ...args);
        }
    },

    /**
     * Log error messages with different behavior based on environment
     * - In production: Use console.warn with minimal details
     * - In development: Use console.warn with full error details
     */
    error: (message: string, err?: unknown) => {
        const prefix = `[fetchIsoData] ${message}`;

        if (process.env.NODE_ENV !== "development") {
            // In production, use warn instead of error and minimize logging
            if (err) {
                console.warn(prefix,
                    err instanceof Error ? err.message : String(err));
            }
            return; // Prevent console.error in production
        }

        // Development mode only - provide detailed error information
        if (!err) {
            console.warn(prefix);
            return;
        }
        const detail = err instanceof Error ? err.message.trim() : String(err).trim();
        console.error(detail ? `${prefix}: ${detail}` : prefix, err);
    }
};

/**
 * Fetches initial data for server-side rendering with optimized performance
 * and improved error handling.
 *
 * @param url The current URL being rendered
 * @param incomingHeaders HTTP headers from the incoming request
 * @returns An IsoData object containing all necessary data for rendering
 */
export default async function fetchIsoData(url: string, incomingHeaders: IncomingHttpHeaders): Promise<IsoData | null> {
    // Initialize data containers
    let siteRes: GetSiteResponse | undefined = undefined;
    let myUserInfo: MyUserInfo | undefined = undefined;
    let routeData: RouteData = {};
    let errorPageData: ErrorPageData | undefined = undefined;
    let match: Match<any> | null | undefined;
    let communities: ListCommunitiesResponse | undefined = undefined;
    let activeRoute;
    try {

        // Set up headers and authentication
        const headers = await setForwardedHeaders(incomingHeaders);
        const auth = await getJwtCookieFromServer(incomingHeaders);
        // Create a per-request client and set headers without mutating the shared client
        const tempClient = wrapClient(new LemmyHttp(getHttpBase()));
        await (tempClient as any).setHeaders(headers);

        // Check authentication for protected routes
        if (!auth && isAuthPath(url)) {
            return createIsoDataResponse(url, undefined, undefined, undefined, {}, {
                code: 302,
                redirectTo: `/login?prev=${encodeURIComponent(url)}`,
            } as any);
        }

        // Fetch site data and profile info in parallel for better performance
        const [trySite, tryUser, tryCommunities] = await Promise.all([
            (tempClient as any).getSite(),
            (tempClient as any).getMyUser(),
            (tempClient as any).listCommunities()
        ]);
        // Process profile data with improved error handling
        await processUserData(tryUser);

        await processCommunitiesData(tryCommunities)

        // Process site data and fetch route-specific data
        if (!await processSiteData(trySite,
            url,
            headers)) {
            // If site data processing failed, return early with error data
            return createIsoDataResponse(url,
                siteRes,
                myUserInfo,
                communities,
                routeData,
                errorPageData);
        }

        // Check for errors in route data
        if (hasRouteDataErrors()) {
            return createIsoDataResponse(url,
                siteRes,
                myUserInfo,
                communities,
                {},
                errorPageData);
        }

        // Return the complete data
        return createIsoDataResponse(url,
            siteRes,
            myUserInfo,
            communities,
            routeData,
            errorPageData);
    } catch (err) {
        // Log the error and return a structured error response
        logger.error("Unhandled error in fetchIsoData",
            err);
        errorPageData = getErrorPageData(err as Error,
            undefined);
        return createIsoDataResponse(url,
            undefined,
            undefined,
            undefined,
            {},
            errorPageData);
    }

    /**
     * Process profile data and handle authentication errors
     */
    async function processUserData(tryUser: RequestState<MyUserInfo>): Promise<void> {
        if (tryUser.state === "success") {
            myUserInfo = tryUser.data;
        }
    }

    /**
     * Process communities data and handle fetch list errors
     */
    async function processCommunitiesData(tryCommunities: RequestState<ListCommunitiesResponse>): Promise<void> {
        if (tryCommunities.state === "success") {
            communities = tryCommunities.data;
        }
    }


    /**
     * Process site data and fetch route-specific data
     * @returns true if processing was successful, false if there was an error
     */
    async function processSiteData(
        trySite: RequestState<GetSiteResponse>,
        url: string,
        headers: Record<string, string>
    ): Promise<boolean> {
        if (trySite.state === "success") {
            siteRes = trySite.data;

            // Find the active route for the current URL
            activeRoute = routes.find(
                route => (match = matchPath(route.path,
                    url)),
            );

            // Fetch route-specific data if available
            if (siteRes && activeRoute?.fetchInitialData && match) {
                const {search} = parsePath(url);
                const initialFetchReq = {
                    path: url,
                    query: activeRoute.getQueryParams?.(search,
                        siteRes) ?? {},
                    match,
                    site: siteRes,
                    headers: headers,
                };

                // Development-only code to test race conditions
                // if (process.env.NODE_ENV === "development" && process.env.SIMULATE_RACE_CONDITIONS === "true") {
                //     setTimeout(() => {
                //         // Intentionally break things if fetchInitialData tries to use global state
                //         // after the first await of an unresolved promise.
                //         myUserInfo = undefined;
                //     });
                // }

                try {
                    routeData = await activeRoute.fetchInitialData(initialFetchReq);
                } catch (routeError) {
                    logger.error(`Error fetching route data for ${url}`,
                        routeError);
                    errorPageData = getErrorPageData(
                        new Error(`Failed to fetch route data: ${(routeError as Error).message}`),
                        siteRes
                    );
                    return false;
                }
            }
            return true;
        } else if (trySite.state === "failed") {
            logger.error(`Failed to fetch site data: ${trySite.err.message}`);
            errorPageData = getErrorPageData(new Error(trySite.err.message),
                undefined);
            return false;
        }
        return true;
    }

    /**
     * Check if there are any errors in the route data
     * @returns true if there are errors, false otherwise
     */
    function hasRouteDataErrors(): boolean {
        const error = Object.values(routeData).find(
            res => res.state === "failed" && res.err.message !== "couldnt_find_object",
        ) as FailedRequestState | undefined;

        if (error) {
            logger.error(`Error in route data: ${error.err.message}`,
                error.err);
            errorPageData = getErrorPageData(new Error(error.err.message),
                siteRes);
            return true;
        }
        return false;
    }

    /**
     * Create a standardized IsoData response object
     */
    function createIsoDataResponse(
        path: string,
        siteRes?: GetSiteResponse,
        myUserInfo?: MyUserInfo,
        communities?: ListCommunitiesResponse,
        routeData: RouteData = {},
        errorPageData?: ErrorPageData
    ): IsoData {
        return {
            path,
            siteRes,
            myUserInfo,
            communities,
            routeData,
            errorPageData,
            appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://staging.108jobs.com",
        };
    }
}