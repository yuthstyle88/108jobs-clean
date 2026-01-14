import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Path,
    Post,
    Put,
    Queries,
    Route,
    Security,
    Tags,
    UploadedFile,
} from "@tsoa/runtime";
import type {
    AdminListUsersI,
    ChatHistoryQueryI,
    CategoryIdQueryI,
    DeleteImageParamsI,
    GetBankAccountsI,
    GetBillingByRoomQueryI,
    GetCommentI,
    GetCommentsI,
    GetCategoryI,
    GetCategoryPendingFollowsCountI,
    GetModlogI,
    GetPersonDetailsI,
    GetPostI,
    GetPostsI,
    GetRandomCategoryI,
    GetRegistrationApplicationI,
    GetReportCountI,
    GetSiteMetadataI,
    LastReadQueryI,
    ListCommentLikesI,
    ListCategoriesI,
    ListCategoryPendingFollowsI,
    ListCustomEmojisI,
    ListMediaI,
    ListNotificationsI,
    ListPersonContentI,
    ListPersonCreatedI,
    ListPersonHiddenI,
    ListPersonLikedI,
    ListPersonReadI,
    ListPersonSavedI,
    ListPostLikesI,
    ListRegistrationApplicationsI,
    ListReportsI,
    ListTaglinesI,
    ListUserChatRoomsQueryI, ListUserReviewsQueryI, PeerStatusQueryI,
    ResolveObjectI,
    SearchI,
    UploadImage, ListRidersQueryI,
} from "./other_types";
import {VERSION} from "./other_types";
import type {AddAdmin} from "./types/AddAdmin";
import type {AddAdminResponse} from "./types/AddAdminResponse";
import type {AddModToCategory} from "./types/AddModToCategory";
import type {AddModToCategoryResponse} from "./types/AddModToCategoryResponse";
import type {AddressResponse} from "./types/AddressResponse";
import type {AdminAllowInstanceParams} from "./types/AdminAllowInstanceParams";
import type {AdminBlockInstanceParams} from "./types/AdminBlockInstanceParams";
import type {AdminListUsers} from "./types/AdminListUsers";
import type {AdminListUsersResponse} from "./types/AdminListUsersResponse";
import type {ApproveCategoryPendingFollower} from "./types/ApproveCategoryPendingFollower";
import type {ApproveRegistrationApplication} from "./types/ApproveRegistrationApplication";
import type {AuthenticateWithOauth} from "./types/AuthenticateWithOauth";
import type {BanFromCategory} from "./types/BanFromCategory";
import type {BanFromCategoryResponse} from "./types/BanFromCategoryResponse";
import type {BanksResponse} from "./types/BankList";
import type {BanPerson} from "./types/BanPerson";
import type {BanPersonResponse} from "./types/BanPersonResponse";
import type {BlockCategory} from "./types/BlockCategory";
import type {BlockCategoryResponse} from "./types/BlockCategoryResponse";
import type {BlockPerson} from "./types/BlockPerson";
import type {BlockPersonResponse} from "./types/BlockPersonResponse";
import type {ChangePassword} from "./types/ChangePassword";
import type {CommentReportResponse} from "./types/CommentReportResponse";
import type {CommentResponse} from "./types/CommentResponse";
import type {CategoryIdQuery} from "./types/CategoryIdQuery";
import type {CategoryReportResponse} from "./types/CategoryReportResponse";
import type {CategoryResponse} from "./types/CategoryResponse";
import type {ContactForm} from "./types/ContactForm";
import type {ContactResponse} from "./types/ContactResponse";
import type {CountriesResponse} from "./types/CountriesResponse";
import type {BankAccountForm} from "./types/BankAccountForm";
import type {CreateComment} from "./types/CreateComment";
import type {CreateCommentLike} from "./types/CreateCommentLike";
import type {CreateCommentReport} from "./types/CreateCommentReport";
import type {CreateCategory} from "./types/CreateCategory";
import type {CreateCategoryReport} from "./types/CreateCategoryReport";
import type {CreateCategoryTag} from "./types/CreateCategoryTag";
import type {CreateCustomEmoji} from "./types/CreateCustomEmoji";
import type {CreateOAuthProvider} from "./types/CreateOAuthProvider";
import type {CreateOrUpdateAddress} from "./types/CreateOrUpdateAddress";
import type {CreatePost} from "./types/CreatePost";
import type {CreatePostLike} from "./types/CreatePostLike";
import type {CreatePostReport} from "./types/CreatePostReport";
import type {CreateSite} from "./types/CreateSite";
import type {CreateTagline} from "./types/CreateTagline";
import type {CustomEmojiResponse} from "./types/CustomEmojiResponse";
import type {DeleteAccount} from "./types/DeleteAccount";
import type {DeleteBankAccount} from "./types/DeleteBankAccount";
import type {DeleteComment} from "./types/DeleteComment";
import type {DeleteCategory} from "./types/DeleteCategory";
import type {DeleteCategoryTag} from "./types/DeleteCategoryTag";
import type {DeleteCustomEmoji} from "./types/DeleteCustomEmoji";
import type {DeleteImageParams} from "./types/DeleteImageParams";
import type {DeleteOAuthProvider} from "./types/DeleteOAuthProvider";
import type {DeletePost} from "./types/DeletePost";
import type {DeleteTagline} from "./types/DeleteTagline";
import type {DistinguishComment} from "./types/DistinguishComment";
import type {EditComment} from "./types/EditComment";
import type {EditCategory} from "./types/EditCategory";
import type {EditCustomEmoji} from "./types/EditCustomEmoji";
import type {EditOAuthProvider} from "./types/EditOAuthProvider";
import type {EditPost} from "./types/EditPost";
import type {EditSite} from "./types/EditSite";
import type {ExchangeKey} from "./types/ExchangeKey";
import type {ExchangeKeyResponse} from "./types/ExchangeKeyResponse";
import type {FeaturePost} from "./types/FeaturePost";
import type {FollowCategory} from "./types/FollowCategory";
import type {GenerateTotpSecretResponse} from "./types/GenerateTotpSecretResponse";
import type {BankAccountsResponse} from "./types/GetBankAccountResponse";
import type {GetCaptchaResponse} from "./types/GetCaptchaResponse";
import type {GetComment} from "./types/GetComment";
import type {GetComments} from "./types/GetComments";
import type {GetCommentsResponse} from "./types/GetCommentsResponse";
import type {GetCommentsSlimResponse} from "./types/GetCommentsSlimResponse";
import type {GetCategory} from "./types/GetCategory";
import type {GetCategoryPendingFollowsCount} from "./types/GetCategoryPendingFollowsCount";
import type {GetCategoryPendingFollowsCountResponse} from "./types/GetCategoryPendingFollowsCountResponse";
import type {GetCategoryResponse} from "./types/GetCategoryResponse";
import type {GetFederatedInstancesResponse} from "./types/GetFederatedInstancesResponse";
import type {GetModlog} from "./types/GetModlog";
import type {GetModlogResponse} from "./types/GetModlogResponse";
import type {GetPersonDetails} from "./types/GetPersonDetails";
import type {GetPersonDetailsResponse} from "./types/GetPersonDetailsResponse";
import type {GetPost} from "./types/GetPost";
import type {GetPostResponse} from "./types/GetPostResponse";
import type {GetPosts} from "./types/GetPosts";
import type {GetPostsResponse} from "./types/GetPostsResponse";
import type {GetRandomCategory} from "./types/GetRandomCategory";
import type {GetRegistrationApplication} from "./types/GetRegistrationApplication";
import type {GetReportCount} from "./types/GetReportCount";
import type {GetReportCountResponse} from "./types/GetReportCountResponse";
import type {GetSiteMetadata} from "./types/GetSiteMetadata";
import type {GetSiteMetadataResponse} from "./types/GetSiteMetadataResponse";
import type {GetSiteResponse} from "./types/GetSiteResponse";
import type {GetUnreadCountResponse} from "./types/GetUnreadCountResponse";
import type {
    GetUnreadRegistrationApplicationCountResponse
} from "./types/GetUnreadRegistrationApplicationCountResponse";
import type {HideCategory} from "./types/HideCategory";
import type {HidePost} from "./types/HidePost";
import type {IdentityCardForm} from "./types/IdentityCardForm";
import type {IdentityCardResponse} from "./types/IdentityCardResponse";
import type {ListCommentLikes} from "./types/ListCommentLikes";
import type {ListCommentLikesResponse} from "./types/ListCommentLikesResponse";
import type {ListCategories} from "./types/ListCategories";
import type {ListCategoriesResponse} from "./types/ListCategoriesResponse";
import type {ListCategoryPendingFollows} from "./types/ListCategoryPendingFollows";
import type {ListCategoryPendingFollowsResponse} from "./types/ListCategoryPendingFollowsResponse";
import type {ListCustomEmojis} from "./types/ListCustomEmojis";
import type {ListCustomEmojisResponse} from "./types/ListCustomEmojisResponse";
import type {ListLoginsResponse} from "./types/ListLoginsResponse";
import type {ListMedia} from "./types/ListMedia";
import type {ListMediaResponse} from "./types/ListMediaResponse";
import type {ListNotifications} from "./types/ListNotifications";
import type {ListNotificationsResponse} from "./types/ListNotificationsResponse";
import type {ListPersonContent} from "./types/ListPersonContent";
import type {ListPersonContentResponse} from "./types/ListPersonContentResponse";
import type {ListPersonHidden} from "./types/ListPersonHidden";
import type {ListPersonHiddenResponse} from "./types/ListPersonHiddenResponse";
import type {ListPersonLiked} from "./types/ListPersonLiked";
import type {ListPersonLikedResponse} from "./types/ListPersonLikedResponse";
import type {ListPersonRead} from "./types/ListPersonRead";
import type {ListPersonReadResponse} from "./types/ListPersonReadResponse";
import type {ListPersonCreated} from "./types/ListPersonCreated";
import type {ListPersonCreatedResponse} from "./types/ListPersonCreatedResponse";
import type {ListPersonSaved} from "./types/ListPersonSaved";
import type {ListPersonSavedResponse} from "./types/ListPersonSavedResponse";
import type {ListPostLikes} from "./types/ListPostLikes";
import type {ListPostLikesResponse} from "./types/ListPostLikesResponse";
import type {ListRegistrationApplications} from "./types/ListRegistrationApplications";
import type {ListRegistrationApplicationsResponse} from "./types/ListRegistrationApplicationsResponse";
import type {ListReports} from "./types/ListReports";
import type {ListReportsResponse} from "./types/ListReportsResponse";
import type {ListTaglines} from "./types/ListTaglines";
import type {ListTaglinesResponse} from "./types/ListTaglinesResponse";
import type {ListBankAccountsResponse} from "./types/ListBankAccountsResponse";
import type {GetBankAccounts} from "./types/GetBankAccounts";
import type {LockPost} from "./types/LockPost";
import type {Login} from "./types/Login";
import type {LoginResponse} from "./types/LoginResponse";
import type {MarkManyPostsAsRead} from "./types/MarkManyPostsAsRead";
import type {MarkNotificationAsRead} from "./types/MarkNotificationAsRead";
import type {MarkPostAsRead} from "./types/MarkPostAsRead";
import type {MyUserInfo} from "./types/MyUserInfo";
import type {OAuthProvider} from "./types/OAuthProvider";
import type {PasswordChangeAfterReset} from "./types/PasswordChangeAfterReset";
import type {PasswordReset} from "./types/PasswordReset";
import type {PostReportResponse} from "./types/PostReportResponse";
import type {PostResponse} from "./types/PostResponse";
import type {ProfileData} from "./types/ProfileData";
import type {PurgeComment} from "./types/PurgeComment";
import type {PurgeCategory} from "./types/PurgeCategory";
import type {PurgePerson} from "./types/PurgePerson";
import type {PurgePost} from "./types/PurgePost";
import type {Register} from "./types/Register";
import type {RegistrationApplicationResponse} from "./types/RegistrationApplicationResponse";
import type {RemoveComment} from "./types/RemoveComment";
import type {RemoveCategory} from "./types/RemoveCategory";
import type {RemovePost} from "./types/RemovePost";
import type {ResendVerificationEmail} from "./types/ResendVerificationEmail";
import type {ResolveCommentReport} from "./types/ResolveCommentReport";
import type {ResolveCategoryReport} from "./types/ResolveCategoryReport";
import type {ResolveObject} from "./types/ResolveObject";
import type {ResolvePostReport} from "./types/ResolvePostReport";
import type {SaveComment} from "./types/SaveComment";
import type {SavePost} from "./types/SavePost";
import type {SaveUserProfile} from "./types/SaveUserProfile";
import type {SaveUserSettings} from "./types/SaveUserSettings";
import type {Search} from "./types/Search";
import type {SearchResponse} from "./types/SearchResponse";
import type {SetDefaultBankAccount} from "./types/SetDefaultBankAccount";
import type {SiteResponse} from "./types/SiteResponse";
import type {SuccessResponse} from "./types/SuccessResponse";
import type {Tag} from "./types/Tag";
import type {TaglineResponse} from "./types/TaglineResponse";
import type {TransferCategory} from "./types/TransferCategory";
import type {UpdateAvailable} from "./types/UpdateAvailable";
import type {UpdateCategoryTag} from "./types/UpdateCategoryTag";
import type {UpdateTagline} from "./types/UpdateTagline";
import type {UpdateTerm} from "./types/UpdateTerm";
import type {UpdateTotp} from "./types/UpdateTotp";
import type {UpdateTotpResponse} from "./types/UpdateTotpResponse";
import type {UploadImageResponse} from "./types/UploadImageResponse";
import type {FileUploadResponse} from "./types/FileUploadResponse";
import type {UpsertCard} from "./types/UpsertCard";
import type {UserBlockInstanceParams} from "./types/UserBlockInstanceParams";
import type {VerifyEmail} from "./types/VerifyEmail";
import type {VisitProfileResponse} from "./types/VisitProfileResponse";
import type {ListUserChatRoomsQuery} from "./types/ListUserChatRoomsQuery";
import type {ListUserChatRoomsResponse} from "./types/ListUserChatRoomsResponse";
import type {ChatRoomId} from "./types/ChatRoomId";
import type {ChatRoomResponse} from "./types/ChatRoomResponse";
import type {CreateChatRoomRequest} from "./types/CreateChatRoomRequest";
import type {CreateInvoiceForm} from "./types/CreateInvoiceForm";
import type {CreateInvoiceResponse} from "./types/CreateInvoiceResponse";
import type {ApproveQuotationForm} from "./types/ApproveQuotationForm";
import type {WorkFlowOperationResponse} from "./types/WorkFlowOperationResponse";
import type {StartWorkflowForm} from "./types/StartWorkflowForm";
import type {SubmitStartWorkForm} from "./types/SubmitStartWorkForm";
import type {CancelJobForm} from "./types/CancelJobForm";
import type {RequestRevisionForm} from "./types/RequestRevisionForm";
import type {ApproveWorkForm} from "./types/ApproveWorkForm";
import type {UserKeysResponse} from "./types/UserKeysResponse";
import type {ChatHistoryQuery} from "./types/ChatHistoryQuery";
import type {ChatMessagesResponse} from "./types/ChatMessagesResponse";
import type {Billing} from "./types/Billing";
import type {GetBillingByRoomQuery} from "./types/GetBillingByRoomQuery";
import type {ScbQrCodeRequest, ScbQrCodeResponse} from "./types/ScbQrCode";
import type {ScbQrInquiryRequest, ScbQrInquiryResponse} from "./types/ScbQrInquiry";
import type {BillingId} from "./types/BillingId";
import type {LastReadQuery} from "./types/LastReadQuery";
import type {LastReadResponse} from "./types/LastReadResponse";
import type {PeerReadResponse} from "./types/PeerReadResponse";
import type {PeerStatusQuery} from "./types/PeerStatusQuery";
import type {SubmitUserReviewForm} from "./types/SubmitUserReviewForm";
import type {SubmitUserReviewResponse} from "./types/SubmitUserReviewResponse";
import type {ListUserReviewsResponse} from "./types/ListUserReviewsResponse";
import type {ListUserReviewsQuery} from "./types/ListUserReviewsQuery";
import {BankAccountOperationResponse} from "./types/BankAccountOperationResponse";
import {UpdateBankAccount} from "./types/UpdateBankAccount";
import {ListTopUpRequestQuery} from "./types/ListTopUpRequestQuery";
import {ListTopUpRequestResponse} from "./types/ListTopUpRequestResponse";
import {AdminTopUpWallet} from "./types/AdminTopUpWallet";
import {AdminWalletOperationResponse} from "./types/AdminWalletOperationResponse";
import {ListWithdrawRequestQuery} from "./types/ListWithdrawRequestQuery";
import {ListWithdrawRequestResponse} from "./types/ListWithdrawRequestResponse";
import {SubmitWithdrawRequest} from "./types/SubmitWithdrawRequest";
import {AdminWithdrawWallet} from "./types/AdminWithdrawWallet";
import {RejectWithdrawalRequest} from "./types/RejectWithdrawalRequest";
import {ListBankAccountQuery} from "./types/ListBankAccountQuery";
import {VerifyBankAccount} from "./types/VerifyBankAccount";
import {ListRidersQuery} from "./types/ListRidersQuery";
import {ListRidersResponse} from "./types/ListRidersResponse";
import {AdminVerifyRiderRequest} from "./types/AdminVerifyRiderRequest";

enum HttpType {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE",
}

type RequestOptions = Pick<RequestInit, "signal">;

/**
 * Helps build lemmy HTTP requests.
 */
@Route("api/v4")
export class LemmyHttp extends Controller {
    #apiUrl: string;
    #headers: { [key: string]: string } = {};
    #fetchFunction: typeof fetch = fetch.bind(globalThis);

    /**
     * Generates a new instance of LemmyHttp.
     * @param baseUrl the base url, without the vX version: https://lemmy.ml -> goes to https://lemmy.ml/api/vX
     * @param headers optional headers. Should contain `x-real-ip` and `x-forwarded-for` .
     */
    constructor(
        baseUrl: string,
        options?: {
            fetchFunction?: typeof fetch;
            headers?: { [key: string]: string };
        },
    ) {
        super();
        this.#apiUrl = `${baseUrl.replace(/\/+$/, "")}/api/${VERSION}`;

        if (options?.headers) {
            this.#headers = options.headers;
        }
        if (options?.fetchFunction) {
            this.#fetchFunction = options.fetchFunction;
        }
    }

    /**
     * @summary Gets the site, and your profile data.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/site")
    @Tags("Site")
    async getSite(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, GetSiteResponse>(
            HttpType.Get,
            "/site",
            {},
            options,
        );
    }

    /**
     * @summary Create your site.
     */
    @Security("bearerAuth")
    @Post("/site")
    @Tags("Site")
    async createSite(
        @Body() form: CreateSite,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateSite, SiteResponse>(
            HttpType.Post,
            "/site",
            form,
            options,
        );
    }

    /**
     * @summary Edit your site.
     */
    @Security("bearerAuth")
    @Put("/site")
    @Tags("Site")
    async editSite(@Body() form: EditSite, @Inject() options?: RequestOptions) {
        return this.#wrapper<EditSite, SiteResponse>(
            HttpType.Put,
            "/site",
            form,
            options,
        );
    }

    /**
     * @summary Leave the Site admins.
     */
    @Security("bearerAuth")
    @Post("/admin/leave")
    @Tags("Admin")
    async leaveAdmin(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, GetSiteResponse>(
            HttpType.Post,
            "/admin/leave",
            {},
            options,
        );
    }

    /**
     * @summary Generate a TOTP / two-factor secret.
     *
     * Generate a TOTP / two-factor secret.
     * Afterwards you need to call `/account/auth/totp/update` with a valid token to enable it.
     */
    @Security("bearerAuth")
    @Post("/account/auth/totp/generate")
    @Tags("Account")
    async generateTotpSecret(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, GenerateTotpSecretResponse>(
            HttpType.Post,
            "/account/auth/totp/generate",
            {},
            options,
        );
    }

    /**
     * @summary Get data of current profile.
     */
    @Security("bearerAuth")
    @Get("/account")
    @Tags("Account")
    async getMyUser(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, MyUserInfo>(
            HttpType.Get,
            "/account",
            {},
            options,
        );
    }

    /**
     * @summary Get data of current profile.
     */
    @Security("bearerAuth")
    @Get("/account/profile")
    @Tags("Account")
    async getProfile(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, ProfileData>(
            HttpType.Get,
            "/account/profile",
            {},
            options,
        );
    }

    /**
     * @summary Get data of current profile.
     */
    @Security("bearerAuth")
    @Get("/account/profile/countries")
    @Tags("Account")
    async getCountries(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, CountriesResponse>(
            HttpType.Get,
            "/account/profile/countries",
            {},
            options,
        );
    }

    /**
     * @summary List banks.
     */
    @Security("bearerAuth")
    @Get("/account/banks")
    @Tags("Account")
    async listBanks(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, BanksResponse>(
            HttpType.Get,
            "/account/banks",
            {},
            options,
        );
    }

    /**
     * @summary Export a backup of your profile settings.
     *
     * Export a backup of your profile settings, including your saved content,
     * followed categories, and blocks.
     */
    @Security("bearerAuth")
    @Get("/account/settings/export")
    @Tags("Account")
    async exportSettings(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, string>(
            HttpType.Get,
            "/account/settings/export",
            {},
            options,
        );
    }

    /**
     * @summary Import a backup of your profile settings.
     */
    @Security("bearerAuth")
    @Post("/account/settings/import")
    @Tags("Account")
    async importSettings(@Body() form: any, @Inject() options?: RequestOptions) {
        return this.#wrapper<object, SuccessResponse>(
            HttpType.Post,
            "/account/settings/import",
            form,
            options,
        );
    }

    /**
     * @summary List login tokens for your profile
     */
    @Security("bearerAuth")
    @Get("/account/list-logins")
    @Tags("Account")
    async listLogins(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, ListLoginsResponse>(
            HttpType.Get,
            "/account/list-logins",
            {},
            options,
        );
    }

    /**
     * @summary Returns an error message if your auth token is invalid
     */
    @Security("bearerAuth")
    @Get("/account/validate-auth")
    @Tags("Account")
    async validateAuth(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, SuccessResponse>(
            HttpType.Get,
            "/account/validate-auth",
            {},
            options,
        );
    }

    /**
     * @summary List all the media for your account.
     */
    @Security("bearerAuth")
    @Get("/account/media/list")
    @Tags("Account", "Media")
    async listMedia(
        @Queries() form: ListMediaI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListMedia, ListMediaResponse>(
            HttpType.Get,
            "/account/media/list",
            form,
            options,
        );
    }

    /**
     * @summary Delete media for your account.
     */
    @Security("bearerAuth")
    @Delete("/account/media")
    @Tags("Account", "Media")
    async deleteMedia(
        @Queries() form: DeleteImageParamsI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DeleteImageParams, SuccessResponse>(
            HttpType.Delete,
            "/account/media",
            form,
            options,
        );
    }

    /**
     * @summary Delete any media. (Admin only)
     */
    @Security("bearerAuth")
    @Delete("/image")
    @Tags("Admin", "Media")
    async deleteMediaAdmin(
        @Queries() form: DeleteImageParamsI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DeleteImageParams, SuccessResponse>(
            HttpType.Delete,
            "/image",
            form,
            options,
        );
    }

    /**
     * @summary List all the media known to your instance.
     */
    @Security("bearerAuth")
    @Get("/image/list")
    @Tags("Admin", "Media")
    async listMediaAdmin(
        @Queries() form: ListMediaI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListMedia, ListMediaResponse>(
            HttpType.Get,
            "/image/list",
            form,
            options,
        );
    }

    /**
     * @summary List all wallet topups (admin view).
     */
    @Security("bearerAuth")
    @Get("/admin/wallet/top-ups")
    @Tags("Admin", "TopUpRequests")
    async adminListTopUpRequests(
        @Queries() form: ListTopUpRequestQuery = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListTopUpRequestQuery, ListTopUpRequestResponse>(
            HttpType.Get,
            "/admin/wallet/top-ups",
            form,
            options,
        );
    }

    /**
     * @summary List all wallet WithdrawalRequests (admin view).
     */
    @Security("bearerAuth")
    @Get("/admin/wallet/withdraw-requests")
    @Tags("Admin", "WithdrawalRequests")
    async adminListWithdrawRequests(
        @Queries() form: ListWithdrawRequestQuery = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListWithdrawRequestQuery, ListWithdrawRequestResponse>(
            HttpType.Get,
            "/admin/wallet/withdraw-requests",
            form,
            options,
        );
    }

    /**
     * @summary List all BankAccounts (admin view).
     */
    @Security("bearerAuth")
    @Get("/admin/bank-account/list")
    @Tags("Admin", "BankAccounts")
    async adminListBankAccounts(
        @Queries() form: ListBankAccountQuery = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListBankAccountQuery, ListBankAccountsResponse>(
            HttpType.Get,
            "/admin/bank-account/list",
            form,
            options,
        );
    }

    /**
     * Admin top up
     */
    @Security("bearerAuth")
    @Post("/admin/bank-account/verify")
    @Tags("Admin", "Top-up")
    async adminVerifyBankAccount(
        @Body() form: VerifyBankAccount,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<VerifyBankAccount, SuccessResponse>(
            HttpType.Post,
            "/admin/bank-account/verify",
            form,
            options,
        );
    }


    /**
     * Admin top up
     */
    @Security("bearerAuth")
    @Post("/admin/wallet/top-up")
    @Tags("Admin", "Top-up")
    async adminTopUpWallet(
        @Body() form: AdminTopUpWallet,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<AdminTopUpWallet, AdminWalletOperationResponse>(
            HttpType.Post,
            "/admin/wallet/top-up",
            form,
            options,
        );
    }

    /**
     * Admin withdraws coin for user
     */
    @Security("bearerAuth")
    @Post("/admin/wallet/withdraw")
    @Tags("Admin", "Withdraw")
    async adminWithdrawWallet(
        @Body() form: AdminWithdrawWallet,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<AdminWithdrawWallet, AdminWalletOperationResponse>(
            HttpType.Post,
            "/admin/wallet/withdraw",
            form,
            options,
        );
    }

    /**
     * Admin withdraws coin for user
     */
    @Security("bearerAuth")
    @Post("/admin/wallet/withdraw-requests/reject")
    @Tags("Admin", "Withdraw")
    async adminRejectWithdrawRequest(
        @Body() form: RejectWithdrawalRequest,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<RejectWithdrawalRequest, SuccessResponse>(
            HttpType.Post,
            "/admin/wallet/withdraw-requests/reject",
            form,
            options,
        );
    }

    /**
     * @summary Enable / Disable TOTP / two-factor authentication.
     *
     * To enable, you need to first call `/account/auth/totp/generate` and then pass a valid token to this.
     *
     * Disabling is only possible if 2FA was previously enabled. Again it is necessary to pass a valid token.
     */
    @Security("bearerAuth")
    @Post("/account/auth/totp/update")
    @Tags("Account")
    async updateTotp(
        @Body() form: UpdateTotp,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<UpdateTotp, UpdateTotpResponse>(
            HttpType.Post,
            "/account/auth/totp/update",
            form,
            options,
        );
    }

    /**
     * @summary Get the modlog.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/modlog")
    @Tags("Miscellaneous")
    async getModlog(
        @Queries() form: GetModlogI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetModlog, GetModlogResponse>(
            HttpType.Get,
            "/modlog",
            form,
            options,
        );
    }

    /**
     * @summary Search lemmy. If `search-term` is a url it also attempts to fetch it, just like `resolve-object`.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/search")
    @Tags("Miscellaneous")
    async search(@Queries() form: SearchI, @Inject() options?: RequestOptions) {
        return this.#wrapper<Search, SearchResponse>(
            HttpType.Get,
            "/search",
            form,
            options,
        );
    }

    /**
     * @summary Fetch a non-local / federated object.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/resolve-object")
    @Tags("Miscellaneous")
    async resolveObject(
        @Queries() form: ResolveObjectI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ResolveObject, SearchResponse>(
            HttpType.Get,
            "/resolve-object",
            form,
            options,
        );
    }

    /**
     * @summary Create a new category.
     */
    @Security("bearerAuth")
    @Post("/category")
    @Tags("Category")
    async createCategory(
        @Body() form: CreateCategory,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateCategory, CategoryResponse>(
            HttpType.Post,
            "/category",
            form,
            options,
        );
    }

    /**
     * @summary Get / fetch a category.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/category")
    @Tags("Category")
    async getCategory(
        @Queries() form: GetCategoryI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetCategory, GetCategoryResponse>(
            HttpType.Get,
            "/category",
            form,
            options,
        );
    }

    /**
     * @summary Edit a category.
     */
    @Security("bearerAuth")
    @Put("/category")
    @Tags("Category")
    async editCategory(
        @Body() form: EditCategory,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<EditCategory, CategoryResponse>(
            HttpType.Put,
            "/category",
            form,
            options,
        );
    }

    /**
     * @summary List categories, with various filters.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/category/list")
    @Tags("Category")
    async listCategories(
        @Queries() form: ListCategoriesI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListCategories, ListCategoriesResponse>(
            HttpType.Get,
            "/category/list",
            form,
            options,
        );
    }

    /**
     * @summary List categories, with various filters.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/category/list/children")
    @Tags("Category")
    async listChildrenCategories(
        @Queries() form: ListCategoriesI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListCategories, ListCategoriesResponse>(
            HttpType.Get,
            "/category/list/children",
            form,
            options,
        );
    }

    /**
     * @summary Follow / subscribe to a category.
     */
    @Security("bearerAuth")
    @Post("/category/follow")
    @Tags("Category")
    async followCategory(
        @Body() form: FollowCategory,
        @Inject() @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<FollowCategory, CategoryResponse>(
            HttpType.Post,
            "/category/follow",
            form,
            options,
        );
    }

    /**
     * @summary Get a category's pending follows count.
     */
    @Security("bearerAuth")
    @Get("/category/pending-follows/count")
    @Tags("Category")
    async getCategoryPendingFollowsCount(
        @Queries() form: GetCategoryPendingFollowsCountI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<
            GetCategoryPendingFollowsCount,
            GetCategoryPendingFollowsCountResponse
        >(HttpType.Get, "/category/pending-follows/count", form, options);
    }

    /**
     * @summary Get a category's pending followers.
     */
    @Security("bearerAuth")
    @Get("/category/pending-follows/list")
    @Tags("Category")
    async listCategoryPendingFollows(
        @Queries() form: ListCategoryPendingFollowsI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<
            ListCategoryPendingFollows,
            ListCategoryPendingFollowsResponse
        >(HttpType.Get, "/category/pending-follows/list", form, options);
    }

    /**
     * @summary Approve a category pending follow request.
     */
    @Security("bearerAuth")
    @Post("/category/pending-follows/approve")
    @Tags("Category")
    async approveCategoryPendingFollow(
        @Body() form: ApproveCategoryPendingFollower,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ApproveCategoryPendingFollower, SuccessResponse>(
            HttpType.Post,
            "/category/pending-follows/approve",
            form,
            options,
        );
    }

    /**
     * @summary Block a category.
     */
    @Security("bearerAuth")
    @Post("/account/block/category")
    @Tags("Account", "Category")
    async blockCategory(
        @Body() form: BlockCategory,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<BlockCategory, BlockCategoryResponse>(
            HttpType.Post,
            "/account/block/category",
            form,
            options,
        );
    }

    /**
     * @summary Delete a category.
     */
    @Security("bearerAuth")
    @Post("/category/delete")
    @Tags("Category")
    async deleteCategory(
        @Body() form: DeleteCategory,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DeleteCategory, CategoryResponse>(
            HttpType.Post,
            "/category/delete",
            form,
            options,
        );
    }

    /**
     * @summary Hide a category from public / "All" view. Admins only.
     */
    @Security("bearerAuth")
    @Put("/category/hide")
    @Tags("Category", "Admin")
    async hideCategory(
        @Body() form: HideCategory,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<HideCategory, SuccessResponse>(
            HttpType.Put,
            "/category/hide",
            form,
            options,
        );
    }

    /**
     * @summary A moderator remove for a category.
     */
    @Security("bearerAuth")
    @Post("/category/remove")
    @Tags("Category", "Moderator")
    async removeCategory(
        @Body() form: RemoveCategory,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<RemoveCategory, CategoryResponse>(
            HttpType.Post,
            "/category/remove",
            form,
            options,
        );
    }

    /**
     * @summary Transfer your category to an existing moderator.
     */
    @Security("bearerAuth")
    @Post("/category/transfer")
    @Tags("Category", "Moderator")
    async transferCategory(
        @Body() form: TransferCategory,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<TransferCategory, GetCategoryResponse>(
            HttpType.Post,
            "/category/transfer",
            form,
            options,
        );
    }

    /**
     * @summary Ban a profile from a category.
     */
    @Security("bearerAuth")
    @Post("/category/ban-profile")
    @Tags("Category", "Moderator")
    async banFromCategory(
        @Body() form: BanFromCategory,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<BanFromCategory, BanFromCategoryResponse>(
            HttpType.Post,
            "/category/ban-profile",
            form,
            options,
        );
    }

    /**
     * @summary Add a moderator to your category.
     */
    @Security("bearerAuth")
    @Post("/category/mod")
    @Tags("Category", "Moderator")
    async addModToCategory(
        @Body() form: AddModToCategory,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<AddModToCategory, AddModToCategoryResponse>(
            HttpType.Post,
            "/category/mod",
            form,
            options,
        );
    }

    /**
     * @summary Get a random category.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/category/random")
    @Tags("Category")
    async getRandomCategory(
        @Queries() form: GetRandomCategoryI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetRandomCategory, CategoryResponse>(
            HttpType.Get,
            "/category/random",
            form,
            options,
        );
    }

    /**
     * @summary Create a report for a category.
     */
    @Security("bearerAuth")
    @Post("/category/report")
    @Tags("Category")
    async createCategoryReport(
        @Body() form: CreateCategoryReport,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateCategoryReport, CategoryReportResponse>(
            HttpType.Post,
            "/category/report",
            form,
            options,
        );
    }

    /**
     * @summary Resolve a report for a private message.
     */
    @Security("bearerAuth")
    @Put("/category/report/resolve")
    @Tags("Category", "Admin")
    async resolveCategoryReport(
        @Body() form: ResolveCategoryReport,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ResolveCategoryReport, CategoryReportResponse>(
            HttpType.Put,
            "/category/report/resolve",
            form,
            options,
        );
    }

    /**
     * @summary Create a post.
     */
    @Security("bearerAuth")
    @Post("/post")
    @Tags("Post")
    async createPost(
        @Body() form: CreatePost,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreatePost, PostResponse>(
            HttpType.Post,
            "/post",
            form,
            options,
        );
    }

    /**
     * @summary Get / fetch a post.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/post")
    @Tags("Post")
    async getPost(
        @Queries() form: GetPostI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetPost, GetPostResponse>(
            HttpType.Get,
            "/post",
            form,
            options,
        );
    }

    /**
     * @summary Edit a post.
     */
    @Security("bearerAuth")
    @Put("/post")
    @Tags("Post")
    async editPost(@Body() form: EditPost, @Inject() options?: RequestOptions) {
        return this.#wrapper<EditPost, PostResponse>(
            HttpType.Put,
            "/post",
            form,
            options,
        );
    }

    /**
     * @summary Delete a post.
     */
    @Security("bearerAuth")
    @Post("/post/delete")
    @Tags("Post")
    async deletePost(
        @Body() form: DeletePost,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DeletePost, PostResponse>(
            HttpType.Post,
            "/post/delete",
            form,
            options,
        );
    }

    /**
     * @summary A moderator remove for a post.
     */
    @Security("bearerAuth")
    @Post("/post/remove")
    @Tags("Post", "Moderator")
    async removePost(
        @Body() form: RemovePost,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<RemovePost, PostResponse>(
            HttpType.Post,
            "/post/remove",
            form,
            options,
        );
    }

    /**
     * @summary Mark a post as read.
     */
    @Security("bearerAuth")
    @Post("/post/mark-as-read")
    @Tags("Post")
    async markPostAsRead(
        @Body() form: MarkPostAsRead,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<MarkPostAsRead, PostResponse>(
            HttpType.Post,
            "/post/mark-as-read",
            form,
            options,
        );
    }

    /**
     * @summary Mark multiple posts as read.
     */
    @Security("bearerAuth")
    @Post("/post/mark-as-read/many")
    @Tags("Post")
    async markManyPostAsRead(
        @Body() form: MarkManyPostsAsRead,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<MarkManyPostsAsRead, SuccessResponse>(
            HttpType.Post,
            "/post/mark-as-read/many",
            form,
            options,
        );
    }

    /**
     * @summary Hide a post from list views.
     */
    @Security("bearerAuth")
    @Post("/post/hide")
    @Tags("Post")
    async hidePost(@Body() form: HidePost, @Inject() options?: RequestOptions) {
        return this.#wrapper<HidePost, SuccessResponse>(
            HttpType.Post,
            "/post/hide",
            form,
            options,
        );
    }

    /**
     * @summary A moderator can lock a post ( IE disable new comments ).
     */
    @Security("bearerAuth")
    @Post("/post/lock")
    @Tags("Post")
    async lockPost(@Body() form: LockPost, @Inject() options?: RequestOptions) {
        return this.#wrapper<LockPost, PostResponse>(
            HttpType.Post,
            "/post/lock",
            form,
            options,
        );
    }

    /**
     * @summary A moderator can feature a category post ( IE stick it to the top of a category ).
     */
    @Security("bearerAuth")
    @Post("/post/feature")
    @Tags("Post", "Moderator")
    async featurePost(
        @Body() form: FeaturePost,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<FeaturePost, PostResponse>(
            HttpType.Post,
            "/post/feature",
            form,
            options,
        );
    }

    /**
     * @summary Get / fetch posts, with various filters.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/post/list")
    @Tags("Post")
    async getPosts(
        @Queries() form: GetPostsI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetPosts, GetPostsResponse>(
            HttpType.Get,
            "/post/list",
            form,
            options,
        );
    }

    /**
     * @summary Like / vote on a post.
     */
    @Security("bearerAuth")
    @Post("/post/like")
    @Tags("Post")
    async likePost(
        @Body() form: CreatePostLike,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreatePostLike, PostResponse>(
            HttpType.Post,
            "/post/like",
            form,
            options,
        );
    }

    /**
     * @summary List a post's likes. Admin-only.
     */
    @Security("bearerAuth")
    @Get("/post/like/list")
    @Tags("Post", "Admin")
    async listPostLikes(
        @Queries() form: ListPostLikesI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListPostLikes, ListPostLikesResponse>(
            HttpType.Get,
            "/post/like/list",
            form,
            options,
        );
    }

    /**
     * @summary Save a post.
     */
    @Security("bearerAuth")
    @Put("/post/save")
    @Tags("Post")
    async savePost(@Body() form: SavePost, @Inject() options?: RequestOptions) {
        return this.#wrapper<SavePost, PostResponse>(
            HttpType.Put,
            "/post/save",
            form,
            options,
        );
    }

    /**
     * @summary Report a post.
     */
    @Security("bearerAuth")
    @Post("/post/report")
    @Tags("Post")
    async createPostReport(
        @Body() form: CreatePostReport,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreatePostReport, PostReportResponse>(
            HttpType.Post,
            "/post/report",
            form,
            options,
        );
    }

    /**
     * @summary Resolve a post report. Only a mod can do this.
     */
    @Security("bearerAuth")
    @Put("/post/report/resolve")
    @Tags("Post", "Moderator")
    async resolvePostReport(
        @Body() form: ResolvePostReport,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ResolvePostReport, PostReportResponse>(
            HttpType.Put,
            "/post/report/resolve",
            form,
            options,
        );
    }

    /**
     * @summary Fetch metadata for any given site.
     */
    @Security("bearerAuth")
    @Get("/post/site-metadata")
    @Tags("Miscellaneous", "Post")
    async getSiteMetadata(
        @Queries() form: GetSiteMetadataI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetSiteMetadata, GetSiteMetadataResponse>(
            HttpType.Get,
            "/post/site-metadata",
            form,
            options,
        );
    }

    /**
     * @summary Create a comment.
     */
    @Security("bearerAuth")
    @Post("/comment")
    @Tags("Comment")
    async createComment(
        @Body() form: CreateComment,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateComment, CommentResponse>(
            HttpType.Post,
            "/comment",
            form,
            options,
        );
    }

    /**
     * @summary Edit a comment.
     */
    @Security("bearerAuth")
    @Put("/comment")
    @Tags("Comment")
    async editComment(
        @Body() form: EditComment,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<EditComment, CommentResponse>(
            HttpType.Put,
            "/comment",
            form,
            options,
        );
    }

    /**
     * @summary Delete a comment.
     */
    @Security("bearerAuth")
    @Post("/comment/delete")
    @Tags("Comment")
    async deleteComment(
        @Body() form: DeleteComment,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DeleteComment, CommentResponse>(
            HttpType.Post,
            "/comment/delete",
            form,
            options,
        );
    }

    /**
     * @summary A moderator remove for a comment.
     */
    @Security("bearerAuth")
    @Post("/comment/remove")
    @Tags("Comment", "Moderator")
    async removeComment(
        @Body() form: RemoveComment,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<RemoveComment, CommentResponse>(
            HttpType.Post,
            "/comment/remove",
            form,
            options,
        );
    }

    /**
     * @summary Like / vote on a comment.
     */
    @Security("bearerAuth")
    @Post("/comment/like")
    @Tags("Comment")
    async likeComment(
        @Body() form: CreateCommentLike,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateCommentLike, CommentResponse>(
            HttpType.Post,
            "/comment/like",
            form,
            options,
        );
    }

    /**
     * @summary List a comment's likes. Admin-only.
     */
    @Security("bearerAuth")
    @Get("/comment/like/list")
    @Tags("Comment", "Admin")
    async listCommentLikes(
        @Queries() form: ListCommentLikesI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListCommentLikes, ListCommentLikesResponse>(
            HttpType.Get,
            "/comment/like/list",
            form,
            options,
        );
    }

    /**
     * @summary Save a comment.
     */
    @Security("bearerAuth")
    @Put("/comment/save")
    @Tags("Comment")
    async saveComment(
        @Body() form: SaveComment,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<SaveComment, CommentResponse>(
            HttpType.Put,
            "/comment/save",
            form,
            options,
        );
    }

    /**
     * @summary Distinguishes a comment (speak as moderator)
     */
    @Security("bearerAuth")
    @Post("/comment/distinguish")
    @Tags("Comment", "Moderator")
    async distinguishComment(
        @Body() form: DistinguishComment,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DistinguishComment, CommentResponse>(
            HttpType.Post,
            "/comment/distinguish",
            form,
            options,
        );
    }

    /**
     * @summary Get / fetch comments.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/comment/list")
    @Tags("Comment")
    async getComments(
        @Queries() form: GetCommentsI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetComments, GetCommentsResponse>(
            HttpType.Get,
            "/comment/list",
            form,
            options,
        );
    }

    /**
     * @summary Get / fetch comments, but without the post or category.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/comment/list/slim")
    @Tags("Comment")
    async getCommentsSlim(
        @Queries() form: GetCommentsI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetComments, GetCommentsSlimResponse>(
            HttpType.Get,
            "/comment/list/slim",
            form,
            options,
        );
    }

    /**
     * @summary Get / fetch comment.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/comment")
    @Tags("Comment")
    async getComment(
        @Queries() form: GetCommentI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetComment, CommentResponse>(
            HttpType.Get,
            "/comment",
            form,
            options,
        );
    }

    /**
     * @summary Report a comment.
     */
    @Security("bearerAuth")
    @Post("/comment/report")
    @Tags("Comment")
    async createCommentReport(
        @Body() form: CreateCommentReport,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateCommentReport, CommentReportResponse>(
            HttpType.Post,
            "/comment/report",
            form,
            options,
        );
    }

    /**
     * @summary Resolve a comment report. Only a mod can do this.
     */
    @Security("bearerAuth")
    @Put("/comment/report/resolve")
    @Tags("Comment", "Moderator")
    async resolveCommentReport(
        @Body() form: ResolveCommentReport,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ResolveCommentReport, CommentReportResponse>(
            HttpType.Put,
            "/comment/report/resolve",
            form,
            options,
        );
    }

    /**
     * @summary Register a new profile.
     */
    @Post("/account/auth/register")
    @Tags("Account")
    async register(@Body() form: Register, @Inject() options?: RequestOptions) {
        return this.#wrapper<Register, LoginResponse>(
            HttpType.Post,
            "/account/auth/register",
            form,
            options,
        );
    }

    /**
     * @summary Log into lemmy.
     */
    @Post("/account/auth/login")
    @Tags("Account")
    async login(@Body() form: Login, @Inject() options?: RequestOptions) {
        return this.#wrapper<Login, LoginResponse>(
            HttpType.Post,
            "/account/auth/login",
            form,
            options,
        );
    }

    /**
     * @summary Exchange public key.
     */
    @Security("bearerAuth")
    @Post("/account/auth/exchange-public-key")
    @Tags("Account")
    async exchangePublicKey(
        @Body() form: ExchangeKey,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ExchangeKey, ExchangeKeyResponse>(
            HttpType.Post,
            "/account/auth/exchange-public-key",
            form,
            options,
        );
    }

    /**
     * @summary Log into lemmy.
     */
    @Post("/account/auth/update-term")
    @Tags("Account")
    async updateTerm(
        @Body() form: UpdateTerm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<UpdateTerm, LoginResponse>(
            HttpType.Post,
            "/account/auth/update-term",
            form,
            options,
        );
    }

    /**
     * @summary Invalidate the currently used auth token.
     */
    @Security("bearerAuth")
    @Post("/account/auth/logout")
    @Tags("Account")
    async logout(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, SuccessResponse>(
            HttpType.Post,
            "/account/auth/logout",
            {},
            options,
        );
    }

    /**
     * @summary Get the details for a person.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/person")
    @Tags("Person")
    async getPersonDetails(
        @Queries() form: GetPersonDetailsI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetPersonDetails, GetPersonDetailsResponse>(
            HttpType.Get,
            "/person",
            form,
            options,
        );
    }

    /**
     * @summary List the content for a person.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/person/content")
    @Tags("Person")
    async listPersonContent(
        @Queries() form: ListPersonContentI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListPersonContent, ListPersonContentResponse>(
            HttpType.Get,
            "/person/content",
            form,
            options,
        );
    }

    /**
     * @summary Ban a person from your site.
     */
    @Security("bearerAuth")
    @Post("/admin/ban")
    @Tags("Admin")
    async banPerson(@Body() form: BanPerson, @Inject() options?: RequestOptions) {
        return this.#wrapper<BanPerson, BanPersonResponse>(
            HttpType.Post,
            "/admin/ban",
            form,
            options,
        );
    }

    /**
     * @summary Get a list of users.
     */
    @Security("bearerAuth")
    @Get("/admin/users")
    @Tags("Admin", "Miscellaneous")
    async listUsers(
        @Queries() form: AdminListUsersI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<AdminListUsers, AdminListUsersResponse>(
            HttpType.Get,
            "/admin/users",
            form,
            options,
        );
    }

    /**
     * @summary Block a person.
     */
    @Security("bearerAuth")
    @Post("/account/block/person")
    @Tags("Account")
    async blockPerson(
        @Body() form: BlockPerson,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<BlockPerson, BlockPersonResponse>(
            HttpType.Post,
            "/account/block/person",
            form,
            options,
        );
    }

    /**
     * @summary Fetch a Captcha.
     */
    @Get("/account/auth/get-captcha")
    @Tags("Account")
    async getCaptcha(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, GetCaptchaResponse>(
            HttpType.Get,
            "/account/auth/get-captcha",
            {},
            options,
        );
    }

    /**
     * @summary Delete your account.
     */
    @Security("bearerAuth")
    @Post("/account/delete")
    @Tags("Account")
    async deleteAccount(
        @Body() form: DeleteAccount,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DeleteAccount, SuccessResponse>(
            HttpType.Post,
            "/account/delete",
            form,
            options,
        );
    }

    /**
     * @summary Reset your password.
     */
    @Security("bearerAuth")
    @Post("/account/auth/password-reset")
    @Tags("Account")
    async passwordReset(
        @Body() form: PasswordReset,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<PasswordReset, SuccessResponse>(
            HttpType.Post,
            "/account/auth/password-reset",
            form,
            options,
        );
    }

    /**
     * @summary Change your password from an email / token based reset.
     */
    @Security("bearerAuth")
    @Post("/account/auth/password-change")
    @Tags("Account")
    async passwordChangeAfterReset(
        @Body() form: PasswordChangeAfterReset,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<PasswordChangeAfterReset, SuccessResponse>(
            HttpType.Post,
            "/account/auth/password-change",
            form,
            options,
        );
    }

    /**
     * @summary Get bank account.
     */
    @Get("/account/bank-account")
    @Tags("Account")
    async getBankAccount(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, BankAccountsResponse>(
            HttpType.Get,
            "/account/bank-account",
            {},
            options,
        );
    }

    /**
     * @summary Set Default Bank Account.
     */
    @Security("bearerAuth")
    @Put("/account/bank-account/default")
    @Tags("Bank")
    async setDefaultBankAccount(
        @Body() form: SetDefaultBankAccount,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<SetDefaultBankAccount, SuccessResponse>(
            HttpType.Put,
            "/account/bank-account/default",
            form,
            options,
        );
    }

    /**
     * @summary Create new bank account.
     */
    @Security("bearerAuth")
    @Post("/account/bank-account")
    @Tags("Account")
    async createBankAccount(
        @Body() form: BankAccountForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<BankAccountForm, BankAccountOperationResponse>(
            HttpType.Post,
            "/account/bank-account",
            form,
            options,
        );
    }

    /**
     * @summary update bank account.
     */
    @Security("bearerAuth")
    @Post("/account/bank-account")
    @Tags("Account")
    async updateBankAccount(
        @Body() form: UpdateBankAccount,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<UpdateBankAccount, BankAccountOperationResponse>(
            HttpType.Put,
            "/account/bank-account",
            form,
            options,
        );
    }

    /**
     * @summary Delete bank account.
     */
    @Security("bearerAuth")
    @Post("/account/bank-account/delete")
    @Tags("Account")
    async deleteBankAccount(
        @Body() form: DeleteBankAccount,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DeleteBankAccount, SuccessResponse>(
            HttpType.Post,
            "/account/bank-account/delete",
            form,
            options,
        );
    }

    /**
     * @summary List user bank accounts
     */
    @Security("bearerAuth")
    @Get("/account/bank-account")
    @Tags("Account")
    async listUserBankAccounts(
        @Queries() form: GetBankAccountsI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetBankAccounts, ListBankAccountsResponse>(
            HttpType.Get,
            "/account/bank-account",
            form,
            options,
        );
    }

    /**
     * @summary Mark all replies as read.
     */
    @Security("bearerAuth")
    @Post("/account/mark-as-read/all")
    @Tags("Account")
    async markAllNotificationsAsRead(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, SuccessResponse>(
            HttpType.Post,
            "/account/mark-as-read/all",
            {},
            options,
        );
    }

    /**
     * @summary Mark a comment as read.
     */
    @Security("bearerAuth")
    @Post("/account/mark-as-read")
    @Tags("Account")
    async markNotificationAsRead(
        @Body() form: MarkNotificationAsRead,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<MarkNotificationAsRead, SuccessResponse>(
            HttpType.Post,
            "/account/mark-as-read",
            form,
            options,
        );
    }

    /**
     * @summary Save your profile settings.
     */
    @Security("bearerAuth")
    @Put("/account/settings/save")
    @Tags("Account")
    async saveUserSettings(
        @Body() form: SaveUserSettings,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<SaveUserSettings, SuccessResponse>(
            HttpType.Put,
            "/account/settings/save",
            form,
            options,
        );
    }

    /**
     * @summary Save your profile settings.
     */
    @Security("bearerAuth")
    @Put("/account/settings/update-profile")
    @Tags("Account")
    async updateProfile(
        @Body() form: SaveUserProfile,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<SaveUserProfile, MyUserInfo>(
            HttpType.Put,
            "/account/settings/update-profile",
            form,
            options,
        );
    }

    /**
     * @summary Save your profile settings.
     */
    @Security("bearerAuth")
    @Post("/account/update-address")
    @Tags("Account")
    async updateAddress(
        @Body() form: CreateOrUpdateAddress,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateOrUpdateAddress, AddressResponse>(
            HttpType.Post,
            "/account/update-address",
            form,
            options,
        );
    }

    /**
     * @summary Save your profile settings.
     */
    @Security("bearerAuth")
    @Put("/account/update-contact")
    @Tags("Account")
    async updateContact(
        @Body() form: ContactForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ContactForm, ContactResponse>(
            HttpType.Put,
            "/account/update-contact",
            form,
            options,
        );
    }

    /**
     * @summary Save your profile settings.
     */
    @Security("bearerAuth")
    @Put("/account/update-identity-card")
    @Tags("Account")
    async updateIdentityCard(
        @Body() form: IdentityCardForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<IdentityCardForm, IdentityCardResponse>(
            HttpType.Put,
            "/account/update-identity-card",
            form,
            options,
        );
    }

    /**
     * @summary Save your profile settings.
     */
    @Security("bearerAuth")
    @Put("/profile/available")
    @Tags("Account")
    async updateAvailable(
        @Body() form: UpdateAvailable,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<UpdateAvailable, SuccessResponse>(
            HttpType.Put,
            "/profile/available",
            form,
            options,
        );
    }

    /**
     * @summary Save your profile settings.
     */
    @Security("bearerAuth")
    @Put("/account/upsert-card")
    @Tags("Account")
    async upsertCard(
        @Body() form: UpsertCard,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<UpsertCard, SuccessResponse>(
            HttpType.Put,
            "/account/upsert-card",
            form,
            options,
        );
    }

    /**
     * @summary Change your profile password.
     */
    @Security("bearerAuth")
    @Put("/account/auth/change-password")
    @Tags("Account")
    async changePassword(
        @Body() form: ChangePassword,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ChangePassword, LoginResponse>(
            HttpType.Put,
            "/account/auth/change-password",
            form,
            options,
        );
    }

    /**
     * @summary Get counts for your reports.
     */
    @Security("bearerAuth")
    @Get("/account/report-count")
    @Tags("Account")
    async getReportCount(
        @Queries() form: GetReportCountI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetReportCount, GetReportCountResponse>(
            HttpType.Get,
            "/account/report-count",
            form,
            options,
        );
    }

    /**
     * @summary Get your unread counts.
     */
    @Security("bearerAuth")
    @Get("/account/unread-count")
    @Tags("Account")
    async getUnreadCount(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, GetUnreadCountResponse>(
            HttpType.Get,
            "/account/unread-count",
            {},
            options,
        );
    }

    /**
     * @summary Get your inbox (replies, comment mentions, post mentions, and messages)
     */
    @Security("bearerAuth")
    @Get("/account/notifications")
    @Tags("Account")
    async listNotifications(
        @Queries() form: ListNotificationsI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListNotifications, ListNotificationsResponse>(
            HttpType.Get,
            "/account/notifications",
            form,
            options,
        );
    }

    /**
     * @summary Resend a verification email.
     */
    @Post("/account/auth/resend-verification-email")
    @Tags("Account")
    async resendVerificationEmail(
        @Body() form: ResendVerificationEmail,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ResendVerificationEmail, SuccessResponse>(
            HttpType.Post,
            "/account/auth/resend-verification-email",
            form,
            options,
        );
    }

    /**
     * @summary submit user review.
     */
    @Post("/reviews")
    @Tags("Reviews")
    async submitUserReview(
        @Body() form: SubmitUserReviewForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<SubmitUserReviewForm, SubmitUserReviewResponse>(
            HttpType.Post,
            "/reviews",
            form,
            options,
        );
    }

    /**
     * @summary List user reviews
     */
    @Security("bearerAuth")
    @Get("/reviews")
    @Tags("Reviews")
    async listUserReviews(
        @Queries() form: ListUserReviewsQueryI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListUserReviewsQuery, ListUserReviewsResponse>(
            HttpType.Get,
            "/reviews",
            form,
            options,
        );
    }

    /**
     * @summary send a verification email.
     */
    @Post("/account/auth/verify-email")
    @Tags("Account")
    async verifyEmail(
        @Body() form: VerifyEmail,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<VerifyEmail, LoginResponse>(
            HttpType.Post,
            "/account/auth/verify-email",
            form,
            options,
        );
    }

    /**
     * @summary List your saved content.
     */
    @Security("bearerAuth")
    @Get("/account/saved")
    @Tags("Account")
    async listPersonSaved(
        @Queries() form: ListPersonSavedI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListPersonSaved, ListPersonSavedResponse>(
            HttpType.Get,
            "/account/saved",
            form,
            options,
        );
    }

    /**
     * @summary List your created content.
     */
    @Security("bearerAuth")
    @Get("/account/created")
    @Tags("Account")
    async listPersonCreated(
        @Queries() form: ListPersonCreatedI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListPersonCreated, ListPersonCreatedResponse>(
            HttpType.Get,
            "/account/created",
            form,
            options,
        );
    }

    /**
     * @summary List your read content.
     */
    @Security("bearerAuth")
    @Get("/account/read")
    @Tags("Account")
    async listPersonRead(
        @Queries() form: ListPersonReadI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListPersonRead, ListPersonReadResponse>(
            HttpType.Get,
            "/account/read",
            form,
            options,
        );
    }

    /**
     * @summary List your hidden content.
     */
    @Security("bearerAuth")
    @Get("/account/hidden")
    @Tags("Account")
    async listPersonHidden(
        @Queries() form: ListPersonHiddenI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListPersonHidden, ListPersonHiddenResponse>(
            HttpType.Get,
            "/account/hidden",
            form,
            options,
        );
    }

    /**
     * @summary List your liked content.
     */
    @Security("bearerAuth")
    @Get("/account/liked")
    @Tags("Account")
    async listPersonLiked(
        @Queries() form: ListPersonLikedI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListPersonLiked, ListPersonLikedResponse>(
            HttpType.Get,
            "/account/liked",
            form,
            options,
        );
    }

    /**
     * @summary Add an admin to your site.
     */
    @Security("bearerAuth")
    @Post("/admin/add")
    @Tags("Admin")
    async addAdmin(@Body() form: AddAdmin, @Inject() options?: RequestOptions) {
        return this.#wrapper<AddAdmin, AddAdminResponse>(
            HttpType.Post,
            "/admin/add",
            form,
            options,
        );
    }

    /**
     * @summary Get the unread registration applications count.
     */
    @Security("bearerAuth")
    @Get("/admin/registration-application/count")
    @Tags("Admin")
    async getUnreadRegistrationApplicationCount(
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<object, GetUnreadRegistrationApplicationCountResponse>(
            HttpType.Get,
            "/admin/registration-application/count",
            {},
            options,
        );
    }

    /**
     * @summary List the registration applications.
     */
    @Security("bearerAuth")
    @Get("/admin/registration-application/list")
    @Tags("Admin")
    async listRegistrationApplications(
        @Queries() form: ListRegistrationApplicationsI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<
            ListRegistrationApplications,
            ListRegistrationApplicationsResponse
        >(HttpType.Get, "/admin/registration-application/list", form, options);
    }

    /**
     * @summary Approve a registration application
     */
    @Security("bearerAuth")
    @Put("/admin/registration-application/approve")
    @Tags("Admin")
    async approveRegistrationApplication(
        @Body() form: ApproveRegistrationApplication,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<
            ApproveRegistrationApplication,
            RegistrationApplicationResponse
        >(HttpType.Put, "/admin/registration-application/approve", form, options);
    }

    /**
     * @summary Get the application a profile submitted when they first registered their account
     */
    @Security("bearerAuth")
    @Get("/admin/registration-application")
    @Tags("Admin")
    async getRegistrationApplication(
        @Queries() form: GetRegistrationApplicationI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<
            GetRegistrationApplication,
            RegistrationApplicationResponse
        >(HttpType.Get, "/admin/registration-application", form, options);
    }

    /**
     * @summary Purge / Delete a person from the database.
     */
    @Security("bearerAuth")
    @Post("/admin/purge/person")
    @Tags("Admin")
    async purgePerson(
        @Body() form: PurgePerson,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<PurgePerson, SuccessResponse>(
            HttpType.Post,
            "/admin/purge/person",
            form,
            options,
        );
    }

    /**
     * @summary Purge / Delete a category from the database.
     */
    @Security("bearerAuth")
    @Post("/admin/purge/category")
    @Tags("Admin")
    async purgeCategory(
        @Body() form: PurgeCategory,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<PurgeCategory, SuccessResponse>(
            HttpType.Post,
            "/admin/purge/category",
            form,
            options,
        );
    }

    /**
     * @summary Purge / Delete a post from the database.
     */
    @Security("bearerAuth")
    @Post("/admin/purge/post")
    @Tags("Admin")
    async purgePost(@Body() form: PurgePost, @Inject() options?: RequestOptions) {
        return this.#wrapper<PurgePost, SuccessResponse>(
            HttpType.Post,
            "/admin/purge/post",
            form,
            options,
        );
    }

    /**
     * @summary Purge / Delete a comment from the database.
     */
    @Security("bearerAuth")
    @Post("/admin/purge/comment")
    @Tags("Admin")
    async purgeComment(
        @Body() form: PurgeComment,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<PurgeComment, SuccessResponse>(
            HttpType.Post,
            "/admin/purge/comment",
            form,
            options,
        );
    }

    /**
     * @summary Create a new custom emoji.
     */
    @Security("bearerAuth")
    @Post("/custom-emoji")
    @Tags("CustomEmoji")
    async createCustomEmoji(
        @Body() form: CreateCustomEmoji,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateCustomEmoji, CustomEmojiResponse>(
            HttpType.Post,
            "/custom-emoji",
            form,
            options,
        );
    }

    /**
     * @summary Edit an existing custom emoji.
     */
    @Security("bearerAuth")
    @Put("/custom-emoji")
    @Tags("CustomEmoji")
    async editCustomEmoji(
        @Body() form: EditCustomEmoji,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<EditCustomEmoji, CustomEmojiResponse>(
            HttpType.Put,
            "/custom-emoji",
            form,
            options,
        );
    }

    /**
     * @summary Delete a custom emoji.
     */
    @Security("bearerAuth")
    @Post("/custom-emoji/delete")
    @Tags("CustomEmoji")
    async deleteCustomEmoji(
        @Body() form: DeleteCustomEmoji,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DeleteCustomEmoji, SuccessResponse>(
            HttpType.Post,
            "/custom-emoji/delete",
            form,
            options,
        );
    }

    /**
     * @summary List custom emojis
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/custom-emoji/list")
    @Tags("CustomEmoji")
    async listCustomEmojis(
        @Queries() form: ListCustomEmojisI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListCustomEmojis, ListCustomEmojisResponse>(
            HttpType.Get,
            "/custom-emoji/list",
            form,
            options,
        );
    }

    /**
     * @summary Create a new tagline
     */
    @Security("bearerAuth")
    @Post("/admin/tagline")
    @Tags("Admin", "Tagline")
    async createTagline(
        @Body() form: CreateTagline,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateTagline, TaglineResponse>(
            HttpType.Post,
            "/admin/tagline",
            form,
            options,
        );
    }

    /**
     * @summary Edit an existing tagline
     */
    @Security("bearerAuth")
    @Put("/admin/tagline")
    @Tags("Admin", "Tagline")
    async editTagline(
        @Body() form: UpdateTagline,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<UpdateTagline, TaglineResponse>(
            HttpType.Put,
            "/admin/tagline",
            form,
            options,
        );
    }

    /**
     * @summary Delete a tagline
     */
    @Security("bearerAuth")
    @Post("/admin/tagline/delete")
    @Tags("Admin", "Tagline")
    async deleteTagline(
        @Body() form: DeleteTagline,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DeleteTagline, SuccessResponse>(
            HttpType.Post,
            "/admin/tagline/delete",
            form,
            options,
        );
    }

    /**
     * @summary List taglines.
     */
    @Security("bearerAuth")
    @Security({})
    @Get("/admin/tagline/list")
    @Tags("Admin", "Tagline")
    async listTaglines(
        @Queries() form: ListTaglinesI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListTaglines, ListTaglinesResponse>(
            HttpType.Get,
            "/admin/tagline/list",
            form,
            options,
        );
    }

    /**
     * @summary List rider profile (admin only).
     */
    @Security("bearerAuth")
    @Get("/admin/riders/list")
    @Tags("Riders")
    async adminListRiders(
        @Queries() form: ListRidersQueryI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListRidersQuery, ListRidersResponse>(
            HttpType.Get,
            "/admin/riders/list",
            form,
            options,
        );
    }

    /**
     * @summary Admin verify rider
     */
    @Security("bearerAuth")
    @Post("/admin/riders/verify")
    @Tags("Admin", "Riders")
    async adminVerifyRider(
        @Body() form: AdminVerifyRiderRequest,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<AdminVerifyRiderRequest, SuccessResponse>(
            HttpType.Post,
            "/admin/riders/verify",
            form,
            options,
        );
    }

    /**
     * @summary Create a category post tag.
     */
    @Security("bearerAuth")
    @Post("/category/tag")
    @Tags("Category")
    createCategoryTag(
        @Body() form: CreateCategoryTag,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateCategoryTag, Tag>(
            HttpType.Post,
            "/category/tag",
            form,
            options,
        );
    }

    /**
     * @summary Update a category post tag.
     */
    @Security("bearerAuth")
    @Put("/category/tag")
    @Tags("Category")
    updateCategoryTag(
        @Body() form: UpdateCategoryTag,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<UpdateCategoryTag, Tag>(
            HttpType.Put,
            "/category/tag",
            form,
            options,
        );
    }

    /**
     * @summary Delete a post tag in a category.
     */
    @Security("bearerAuth")
    @Delete("/category/tag")
    @Tags("Category")
    deleteCategoryTag(
        @Body() form: DeleteCategoryTag,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DeleteCategoryTag, Tag>(
            HttpType.Delete,
            "/category/tag",
            form,
            options,
        );
    }

    /**
     * @summary Create a new oauth providers method
     */
    @Security("bearerAuth")
    @Post("/oauth-providers")
    @Tags("Miscellaneous", "OAuth")
    async createOAuthProvider(
        @Body() form: CreateOAuthProvider,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateOAuthProvider, OAuthProvider>(
            HttpType.Post,
            "/oauth-providers",
            form,
            options,
        );
    }

    /**
     * @summary Edit an existing oauth providers method
     */
    @Security("bearerAuth")
    @Put("/oauth-providers")
    @Tags("Miscellaneous", "OAuth")
    async editOAuthProvider(
        @Body() form: EditOAuthProvider,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<EditOAuthProvider, OAuthProvider>(
            HttpType.Put,
            "/oauth-providers",
            form,
            options,
        );
    }

    /**
     * @summary Delete an oauth providers method
     */
    @Security("bearerAuth")
    @Post("/oauth-providers/delete")
    @Tags("Miscellaneous", "OAuth")
    async deleteOAuthProvider(
        @Body() form: DeleteOAuthProvider,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<DeleteOAuthProvider, SuccessResponse>(
            HttpType.Post,
            "/oauth-providers/delete",
            form,
            options,
        );
    }

    /**
     * @summary Authenticate with OAuth
     */
    @Security("bearerAuth")
    @Post("/oauth/authenticate")
    @Tags("Miscellaneous", "OAuth")
    async authenticateWithOAuth(
        @Body() form: AuthenticateWithOauth,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<AuthenticateWithOauth, LoginResponse>(
            HttpType.Post,
            "/oauth/authenticate",
            form,
            options,
        );
    }

    /**
     * @summary Fetch federated instances.
     */
    @Get("/federated-instances")
    @Tags("Miscellaneous")
    async getFederatedInstances(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, GetFederatedInstancesResponse>(
            HttpType.Get,
            "/federated-instances",
            {},
            options,
        );
    }

    /**
     * @summary List profile reports.
     */
    @Security("bearerAuth")
    @Get("/report/list")
    @Tags("Admin")
    async listReports(
        @Queries() form: ListReportsI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListReports, ListReportsResponse>(
            HttpType.Get,
            "/report/list",
            form,
            options,
        );
    }

    /**
     * @summary Block an instance as profile.
     */
    @Security("bearerAuth")
    @Post("/account/block/instance")
    @Tags("Account")
    async userBlockInstance(
        @Body() form: UserBlockInstanceParams,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<UserBlockInstanceParams, SuccessResponse>(
            HttpType.Post,
            "/account/block/instance",
            form,
            options,
        );
    }

    /**
     * @summary Globally block an instance as admin.
     */
    @Security("bearerAuth")
    @Post("/admin/instance/block")
    @Tags("Admin")
    async adminBlockInstance(
        @Body() form: AdminBlockInstanceParams,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<AdminBlockInstanceParams, SuccessResponse>(
            HttpType.Post,
            "/admin/instance/block",
            form,
            options,
        );
    }

    /**
     * @summary Globally allow an instance as admin.
     */
    @Security("bearerAuth")
    @Post("/admin/instance/allow")
    @Tags("Admin")
    async adminAllowInstance(
        @Body() form: AdminAllowInstanceParams,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<AdminAllowInstanceParams, SuccessResponse>(
            HttpType.Post,
            "/admin/instance/allow",
            form,
            options,
        );
    }


    /**
     * @summary Visit profile
     */
    @Get("/account/profile")
    @Tags("Account")
    async visitProfile(
        @Path() username: string,
        @Inject() options?: RequestOptions
    ) {
        return this.#wrapper<object, VisitProfileResponse>(
            HttpType.Get,
            `/account/profile/${username}`,
            {},
            options
        );
    }

    /**
     * @summary Upload new profile avatar.
     */
    @Security("bearerAuth")
    @Post("/account/avatar")
    @Tags("Account", "Media")
    async uploadUserAvatar(
        @UploadedFile() image: UploadImage,
        @Inject() options?: RequestOptions,
    ): Promise<UploadImageResponse> {
        return this.#upload("/account/avatar", image, options);
    }

    /**
     * @summary Delete the profile avatar.
     */
    @Security("bearerAuth")
    @Delete("/account/avatar")
    @Tags("Account", "Media")
    async deleteUserAvatar(
        @Inject() options?: RequestOptions,
    ): Promise<SuccessResponse> {
        return this.#wrapper<object, SuccessResponse>(
            HttpType.Delete,
            "/account/avatar",
            {},
            options,
        );
    }

    /**
     * @summary Upload new profile banner.
     */
    @Security("bearerAuth")
    @Post("/account/banner")
    @Tags("Account", "Media")
    async uploadUserBanner(
        @UploadedFile() image: UploadImage,
        @Inject() options?: RequestOptions,
    ): Promise<UploadImageResponse> {
        return this.#upload("/account/banner", image, options);
    }

    /**
     * @summary Upload a file to user account.
     */
    @Security("bearerAuth")
    @Post("/account/files")
    @Tags("Account", "Media")
    async uploadFile(
        @UploadedFile() image: UploadImage,
        @Inject() options?: RequestOptions,
    ): Promise<FileUploadResponse> {
        return this.#upload<FileUploadResponse>("/account/files", image, options);
    }

    /**
     * @summary Delete a previously uploaded user file by filename.
     */
    @Security("bearerAuth")
    @Delete("/account/files/{filename}")
    @Tags("Account", "Media")
    async deleteFile(
        @Path() filename: string,
        @Inject() options?: RequestOptions,
    ): Promise<SuccessResponse> {
        return this.#wrapper<object, SuccessResponse>(
            HttpType.Delete,
            `/account/files/${filename}`,
            {},
            options,
        );
    }

    /**
     * @summary Delete the profile banner.
     */
    @Security("bearerAuth")
    @Delete("/account/banner")
    @Tags("Account", "Media")
    async deleteUserBanner(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, SuccessResponse>(
            HttpType.Delete,
            "/account/banner",
            {},
            options,
        );
    }

    /**
     * @summary Upload new category icon.
     */
    @Security("bearerAuth")
    @Post("/category/icon")
    @Tags("Category", "Media")
    async uploadCategoryIcon(
        @Queries() query: CategoryIdQueryI,
        @UploadedFile() image: UploadImage,
        @Inject() options?: RequestOptions,
    ): Promise<UploadImageResponse> {
        return this.#uploadWithQuery("/category/icon", query, image, options);
    }

    /**
     * @summary Delete the category icon.
     */
    @Security("bearerAuth")
    @Delete("/category/icon")
    @Tags("Category", "Media")
    async deleteCategoryIcon(
        @Body() form: CategoryIdQuery,
        @Inject() options?: RequestOptions,
    ): Promise<SuccessResponse> {
        return this.#wrapper<CategoryIdQuery, SuccessResponse>(
            HttpType.Delete,
            "/category/icon",
            form,
            options,
        );
    }

    /**
     * @summary Upload new category banner.
     */
    @Security("bearerAuth")
    @Post("/category/banner")
    @Tags("Category", "Media")
    async uploadCategoryBanner(
        @Queries() query: CategoryIdQueryI,
        @UploadedFile() image: UploadImage,
        @Inject() options?: RequestOptions,
    ): Promise<UploadImageResponse> {
        return this.#uploadWithQuery("/category/banner", query, image, options);
    }

    /**
     * @summary Delete the category banner.
     */
    @Security("bearerAuth")
    @Delete("/category/banner")
    @Tags("Category", "Media")
    async deleteCategoryBanner(
        @Body() form: CategoryIdQuery,
        @Inject() options?: RequestOptions,
    ): Promise<SuccessResponse> {
        return this.#wrapper<CategoryIdQuery, SuccessResponse>(
            HttpType.Delete,
            "/category/banner",
            form,
            options,
        );
    }

    /**
     * @summary Upload new site icon.
     */
    @Security("bearerAuth")
    @Post("/site/icon")
    @Tags("Site", "Media")
    async uploadSiteIcon(
        @UploadedFile() image: UploadImage,
        @Inject() options?: RequestOptions,
    ): Promise<UploadImageResponse> {
        return this.#upload("/site/icon", image, options);
    }

    /**
     * @summary Delete the site icon.
     */
    @Security("bearerAuth")
    @Delete("/site/icon")
    @Tags("Site", "Media")
    async deleteSiteIcon(
        @Inject() options?: RequestOptions,
    ): Promise<SuccessResponse> {
        return this.#wrapper<object, SuccessResponse>(
            HttpType.Delete,
            "/site/icon",
            {},
            options,
        );
    }

    /**
     * @summary Upload new site banner.
     */
    @Security("bearerAuth")
    @Post("/site/banner")
    @Tags("Site", "Media")
    async uploadSiteBanner(
        @UploadedFile() image: UploadImage,
        @Inject() options?: RequestOptions,
    ): Promise<UploadImageResponse> {
        return this.#upload("/site/banner", image, options);
    }

    /**
     * @summary Delete the site banner.
     */
    @Security("bearerAuth")
    @Delete("/site/banner")
    @Tags("Site", "Media")
    async deleteSiteBanner(
        @Inject() options?: RequestOptions,
    ): Promise<SuccessResponse> {
        return this.#wrapper<object, SuccessResponse>(
            HttpType.Delete,
            "/site/banner",
            {},
            options,
        );
    }

    /**
     * @summary Upload an image to the server.
     */
    @Security("bearerAuth")
    @Post("/image")
    @Tags("Media")
    async uploadImage(
        @UploadedFile() image: UploadImage,
        @Inject() options?: RequestOptions,
    ): Promise<UploadImageResponse> {
        return this.#upload("/image", image, options);
    }

    /**
     * @summary Health check for image functionality
     */
    @Get("/image/health")
    @Tags("Media")
    async imageHealth(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, SuccessResponse>(
            HttpType.Get,
            "/image/health",
            {},
            options,
        );
    }

    /**
     * Mark donation dialog as shown, so it isn't displayed anymore.
     */
    @Security("bearerAuth")
    @Post("/profile/donation-dialog-shown")
    @Tags("Miscellaneous")
    donationDialogShown(@Inject() options?: RequestOptions) {
        return this.#wrapper<object, SuccessResponse>(
            HttpType.Post,
            "/profile/donation-dialog-shown",
            {},
            options,
        );
    }

    /**
     * @summary Create SCB QR Code.
     */
    @Security("bearerAuth")
    @Post("/scb/qrcode/create")
    @Tags("SCB")
    async createScbQrCode(
        @Body() form: ScbQrCodeRequest,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ScbQrCodeRequest, ScbQrCodeResponse>(
            HttpType.Post,
            "/scb/qrcode/create",
            form,
            options,
        );
    }

    /**
     * @summary Inquire SCB QR Code transaction status.
     */
    @Security("bearerAuth")
    @Post("/scb/inquire")
    @Tags("SCB")
    async inquireScbQrCode(
        @Body() form: ScbQrInquiryRequest,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ScbQrInquiryRequest, ScbQrInquiryResponse>(
            HttpType.Post,
            "/scb/inquire",
            form,
            options,
        );
    }

    /**
     * @summary Create an invoice / quotation for a job.
     */
    @Security("bearerAuth")
    @Post("/account/services/create-invoice")
    @Tags("Billing")
    async createInvoice(
        @Body() form: CreateInvoiceForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateInvoiceForm, CreateInvoiceResponse>(
            HttpType.Post,
            "/account/services/create-invoice",
            form,
            options,
        );
    }

    /**
     * @summary Approve quotation and convert to order.
     */
    @Security("bearerAuth")
    @Post("/account/services/approve-quotation")
    @Tags("Billing")
    async approveQuotation(
        @Body() form: ApproveQuotationForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ApproveQuotationForm, WorkFlowOperationResponse>(
            HttpType.Post,
            "/account/services/approve-quotation",
            form,
            options,
        );
    }

    /**
     * @summary Submit a withdrawal request
     */
    @Security("bearerAuth")
    @Post("/account/wallet/withdraw-requests")
    @Tags("Wallet")
    async submitWithdraw(
        @Body() form: SubmitWithdrawRequest,
        @Inject() options?: RequestOptions
    ) {
        return this.#wrapper<SubmitWithdrawRequest, SuccessResponse>(
            HttpType.Post,
            "/account/wallet/withdraw-requests",
            form,
            options
        );
    }

    /**
     * @summary Get billing by comment id.
     */
    @Security("bearerAuth")
    @Get("/account/services/billing/by-room")
    @Tags("Billing")
    async getBillingByRoom(
        @Queries() form: GetBillingByRoomQueryI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<GetBillingByRoomQuery, Billing>(
            HttpType.Get,
            "/account/services/billing/by-room",
            form,
            options,
        );
    }

    /**
     * @summary Get wallet top-ups for a user.
     */
    @Security("bearerAuth")
    @Get("/account/wallet/top-ups")
    @Tags("TopUpRequests")
    async listTopUpRequests(
        @Queries() form: ListTopUpRequestQuery,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListTopUpRequestQuery, ListTopUpRequestResponse>(
            HttpType.Get,
            "/account/wallet/top-ups",
            form,
            options,
        );
    }

    /**
     * @summary Get wallet withdraw-requests for a user.
     */
    @Security("bearerAuth")
    @Get("/account/wallet/withdraw-requests")
    @Tags("WithdrawRequests")
    async listWithdrawRequests(
        @Queries() form: ListWithdrawRequestQuery,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListWithdrawRequestQuery, ListWithdrawRequestResponse>(
            HttpType.Get,
            "/account/wallet/withdraw-requests",
            form,
            options,
        );
    }


    /**
     * @summary Get a Billing by ID.
     */
    @Security("bearerAuth")
    @Get("/account/services/billing/{id}")
    @Tags("Chat", "Billing")
    async getBillingById(
        @Path() id: BillingId,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<object, Billing>(
            HttpType.Get,
            `/account/services/billing/${id}`,
            {},
            options,
        );
    }

    /**
     * @summary Start or initialize a workflow for a post/sequence in a chat room.
     */
    @Security("bearerAuth")
    @Post("/account/services/start-workflow")
    @Tags("Services")
    async startWorkflow(
        @Body() form: StartWorkflowForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<StartWorkflowForm, WorkFlowOperationResponse>(
            HttpType.Post,
            "/account/services/start-workflow",
            form,
            options,
        );
    }

    /**
     * @summary Submit completed work (freelancer starts work).
     */
    @Security("bearerAuth")
    @Post("/account/services/start-work")
    @Tags("Services")
    async submitStartWork(
        @Body() form: SubmitStartWorkForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<SubmitStartWorkForm, WorkFlowOperationResponse>(
            HttpType.Post,
            "/account/services/start-work",
            form,
            options,
        );
    }

    /**
     * @summary Submit work (freelancer finishes work by submitting their project).
     */
    @Security("bearerAuth")
    @Post("/account/services/submit-work")
    @Tags("Services")
    async submitWork(
        @Body() form: SubmitStartWorkForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<SubmitStartWorkForm, WorkFlowOperationResponse>(
            HttpType.Post,
            "/account/services/submit-work",
            form,
            options,
        );
    }

    /**
     * @summary Request revision on a submitted work (employer requests changes from freelancer).
     */
    @Security("bearerAuth")
    @Post("/account/services/request-revision")
    @Tags("Services")
    async requestRevision(
        @Body() form: RequestRevisionForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<RequestRevisionForm, WorkFlowOperationResponse>(
            HttpType.Post,
            "/account/services/request-revision",
            form,
            options,
        );
    }

    /**
     * @summary Approve work and release payment (employer approves).
     */
    @Security("bearerAuth")
    @Post("/account/services/approve-work")
    @Tags("Services")
    async approveWork(
        @Body() form: ApproveWorkForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ApproveWorkForm, WorkFlowOperationResponse>(
            HttpType.Post,
            "/account/services/approve-work",
            form,
            options,
        );
    }

    /**
     * @summary Cancel a workflow job.
     */
    @Security("bearerAuth")
    @Post("/account/services/cancel-job")
    @Tags("Services")
    async cancelJob(
        @Body() form: CancelJobForm,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CancelJobForm, WorkFlowOperationResponse>(
            HttpType.Post,
            "/account/services/cancel-job",
            form,
            options,
        );
    }

    /**
     * @summary Create a chat room.
     */
    @Security("bearerAuth")
    @Post("/chat/rooms")
    @Tags("Chat", "Room")
    async createChatRoom(
        @Body() form: CreateChatRoomRequest,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<CreateChatRoomRequest, ChatRoomResponse>(
            HttpType.Post,
            "/chat/rooms",
            form,
            options,
        );
    }

    /**
     * @summary Get a list of chat rooms.
     */
    @Security("bearerAuth")
    @Get("/chat/rooms")
    @Tags("Chat", "Room")
    async listChatRooms(
        @Queries() form: ListUserChatRoomsQueryI = {},
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ListUserChatRoomsQuery, ListUserChatRoomsResponse>(
            HttpType.Get,
            "/chat/rooms",
            form,
            options,
        );
    }

    /**
     * @summary Fetch chat history for a room.
     */
    @Security("bearerAuth")
    @Get("/chat/history")
    @Tags("Chat")
    async getChatHistory(
        @Queries() form: ChatHistoryQueryI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<ChatHistoryQuery, ChatMessagesResponse>(
            HttpType.Get,
            "/chat/history",
            form,
            options,
        );
    }

    /**
     * @summary Fetch last read for a user of a room.
     */
    @Security("bearerAuth")
    @Get("/chat/last-read")
    @Tags("Chat")
    async getLastRead(
        @Queries() form: LastReadQueryI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<LastReadQuery, LastReadResponse>(
            HttpType.Get,
            "/chat/last-read",
            form,
            options,
        );
    }

    /**
     * @summary Fetch last read for a user of a room.
     */
    @Security("bearerAuth")
    @Get("/chat/get-peer-status")
    @Tags("Chat")
    async getPeerStatus(
        @Queries() form: PeerStatusQueryI,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<PeerStatusQuery, PeerReadResponse>(
            HttpType.Get,
            "/chat/get-peer-status",
            form,
            options,
        );
    }

    /**
     * @summary Get a chat room by ID.
     */
    @Security("bearerAuth")
    @Get("/chat/rooms/{id}")
    @Tags("Chat", "Room")
    async getChatRoom(
        @Path() id: ChatRoomId,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<object, ChatRoomResponse>(
            HttpType.Get,
            `/chat/rooms/${id}`,
            {},
            options,
        );
    }

    /**
     * @summary Get a user's published public keys.
     */
    @Security("bearerAuth")
    @Get("/users/{id}/keys")
    @Tags("User")
    async getUserKey(
        @Path() id: number,
        @Inject() options?: RequestOptions,
    ) {
        return this.#wrapper<object, UserKeysResponse>(
            HttpType.Get,
            `/users/${id}/keys`,
            {},
            options,
        );
    }

    /**
     * Set the headers (can be used to set the auth header)
     */
    setHeaders(headers: { [key: string]: string }) {
        this.#headers = headers;
    }

    #buildFullUrl(endpoint: string) {
        return `${this.#apiUrl}${endpoint}`;
    }

    async #upload<ResponseType>(
        path: string,
        {image}: UploadImage,
        options?: RequestOptions,
    ): Promise<ResponseType> {
        const isFileUpload = path.includes("/account/files") || path.includes("/chat/files");
        const fieldName = isFileUpload ? "file" : "images[]";
        const formData = createFormData(image, fieldName);

        const response = await this.#fetchFunction(this.#buildFullUrl(path), {
            ...options,
            method: HttpType.Post,
            body: formData as unknown as BodyInit,
            headers: this.#headers,
        });
        return response.json();
    }

    async #uploadWithQuery<QueryType extends object, ResponseType>(
        path: string,
        query: QueryType,
        {image}: UploadImage,
        options?: RequestOptions,
    ): Promise<ResponseType> {
        const qs = encodeGetParams(query);
        return this.#upload<ResponseType>(
            qs ? `${path}?${qs}` : path,
            {image},
            options,
        );
    }

    async #wrapper<BodyType extends object, ResponseType>(
        type_: HttpType,
        endpoint: string,
        form: BodyType,
        options: RequestOptions | undefined,
    ): Promise<ResponseType> {
        let response: Response;
        if (type_ === HttpType.Get) {
            const qs = encodeGetParams(form as object);
            const getUrl = qs ? `${this.#buildFullUrl(endpoint)}?${qs}` : this.#buildFullUrl(endpoint);
            response = await this.#fetchFunction(getUrl, {
                ...options,
                method: HttpType.Get,
                headers: this.#headers,
            });
        } else {
            response = await this.#fetchFunction(this.#buildFullUrl(endpoint), {
                ...options,
                method: type_,
                headers: {
                    "Content-Type": "application/json",
                    ...this.#headers,
                },
                body: JSON.stringify(form),
            });
        }

        let json: any | undefined = undefined;

        try {
            json = await response.json();
        } catch {
            throw new LemmyError(response.statusText);
        }

        if (!response.ok) {
            throw new LemmyError(json.error ?? response.statusText, json.message);
        } else {
            return json;
        }
    }
}

function encodeGetParams<BodyType extends object>(p: BodyType): string {
    return Object.entries(p)
        .filter(kv => kv[1] !== undefined && kv[1] !== null)
        .map(kv => kv.map(encodeURIComponent).join("="))
        .join("&");
}

function createFormData(image: File | Buffer, fieldName: string = "images[]"): FormData {
    const formData = new FormData();

    if (image instanceof File) {
        formData.append(fieldName, image);
    } else {
        const isUploadFile = fieldName === "uploadFile";
        const mime = isUploadFile ? "application/octet-stream" : "image/jpeg";
        const blob = new Blob([Buffer.isBuffer(image) ? new Uint8Array(image) : (image as unknown as ArrayBuffer)], {type: mime});
        const filename = isUploadFile ? "file.bin" : "image.jpg";
        formData.append(fieldName, blob, filename);
    }

    return formData;
}

/**
 * A Lemmy error type.
 *
 * The name is the i18n translatable error code.
 * The msg is either an empty string, or extra non-translatable info.
 */
export class LemmyError extends Error {
    constructor(name: string, msg?: string) {
        super(msg ?? "");
        this.name = name;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, LemmyError.prototype);
    }
}
