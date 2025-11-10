import {
    Comment,
    CommentReply,
    CommentView,
    CommunityView,
    CreateOAuthProvider,
    GetSiteResponse, ListBankAccountsResponse,
    ListCommunitiesResponse,
    ListUserChatRoomsResponse,
    MyUserInfo,
    PersonCommentMention,
    PersonView,
} from "lemmy-js-client";
import {RequestState} from "@/services/HttpService";
import {Match} from "@/utils/router"


export interface IsoData<T extends RouteData = RouteData> {
    jwt?: string;
    path: string;
    routeData: T;
    siteRes?: GetSiteResponse;
    communities?: ListCommunitiesResponse,
    chatRooms?: ListUserChatRoomsResponse,
    bankAccounts?: ListBankAccountsResponse,
    myUserInfo?: MyUserInfo;
    errorPageData?: ErrorPageData;
    appUrl: string | undefined;
}

declare global {
    interface Window {
        isoData: IsoData;
        checkLazyScripts?: () => void;
    }
}

export interface InitialFetchRequest<
    P extends Record<string, string> = Record<string, never>,
    T extends object = Record<string, never>,
> {
    path: string;
    query: T;
    match: Match<P>;
    site: GetSiteResponse;
    headers: { [key: string]: string };
}

export interface IRouteProps {
    computedMatch?: Match | null;
    path?: string;
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;
}

export interface PostFormParams {
    name?: string;
    url?: string;
    body?: string;
    nsfw?: boolean;
    languageId?: number;
    communityId?: number;
    customThumbnail?: string;
    altText?: string;
}

export enum CommentViewType {
    Tree,
    Flat,
}

export enum DataType {
    Post,
    Comment,
}

export enum BanType {
    Community,
    Site,
}

export enum PersonDetailsView {
    Overview = "Overview",
    Comments = "Comments",
    Posts = "Posts",
    Saved = "Saved",
    Uploads = "Uploads",
}

export enum PurgeType {
    Person,
    Community,
    Post,
    Comment,
}

export enum VoteType {
    Upvote,
    Downvote,
}

export enum VoteContentType {
    Post,
    Comment,
}

export type CommentNodeView = CommentView & {
    personCommentMention?: PersonCommentMention;
    commentReply?: CommentReply;
};

export interface CommentNodeI {
    commentView: CommentNodeView;
    children: Array<CommentNodeI>;
    depth: number;
}

export type RouteData = Record<string, RequestState<unknown>>;

export interface Choice {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface CommunityTribute {
    key: string;
    view: CommunityView;
}

export interface ErrorPageData {
    error?: string;
    adminMatrixIds?: string[];
}

export interface PersonTribute {
    key: string;
    view: PersonView;
}

export type QueryParams<T extends Record<string, unknown>> = {
    [key in keyof T]?: string;
};

export type RouteDataResponse<T extends Record<string, unknown>> = {
    [K in keyof T]: RequestState<T[K]>;
};

export type ThemeColor =
    | "primary"
    | "secondary"
    | "light"
    | "dark"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "blue"
    | "indigo"
    | "purple"
    | "pink"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "cyan"
    | "white"
    | "gray"
    | "gray-dark";

export interface WithComment {
    comment: Comment;
    myVote?: number;
    saved: boolean;
    creatorIsModerator: boolean;
    creatorIsAdmin: boolean;
    creatorBlocked: boolean;
    creatorBannedFromCommunity: boolean;
}

export interface CrossPostParams {
    name: string;
    url?: string;
    body?: string;
    altText?: string;
    nsfw?: StringBoolean;
    languageId?: number;
    customThumbnailUrl?: string;
}

export type StringBoolean = "true" | "false";

export type ProviderToEdit = Omit<
    CreateOAuthProvider,
    "client_id" | "client_secret"
>;
