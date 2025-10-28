import en from "@/assets/icons/en.svg";
import th from "@/assets/icons/th.svg";
import vn from "@/assets/icons/vn.svg";

export enum LanguageFile {
  GLOBAL = "global",
  AUTHEN = "authen",
  HOME = "home",
  COINS = "profileCoins",
  BASIC_INFO = "profileInfo",
  CONTACT = "profileContact",
  MANAGE = "consentManage",
  INDIVIDUAL = "profileIndividual",
  COMPANY = "profileCompany",
  CHAT = "profileChat",
  APPLY_FREELANCER = "profileApply",
  COUPON = "profileCoupon",
  CONSENT = "profileData",
  JOB_BOARD = "profileJob",
  REWARD = "profilePoint",
  ACCOUNT_NAVBAR = "profileNavbar",
  ERROR = "error",
  NOT_FOUND = "notFound",
  SELLER_OVERVIEW = "seller",
  SELLER_PROJECT_MANAGEMENT = "sellerProjectManagement",
  SELLER_ACCOUNT_STATISTICS = "sellerAccountStatistics",
  SELLER_MY_SERVICE = "sellerMyService",
  SELLER_WITHDRAWAL = "sellerWithdrawal",
  SELLER_CREATE_JOBS = "manageProductCreate",
  SELLER_FREELANCER_PROFILE = "sellerProfile",
  SELLER_PERSONAL_INFO = "sellerPersonalInfo",
  SELLER_CONTACT_INFO = "sellerContactInfo",
  SELLER_BANK_ACCOUNT = "sellerBankAccount",
  SELLER_COMMITMENT_LETTER = "sellerCommitmentLetter",
  SELLER_DOCUMENT_INFO = "sellerDocumentInfo",
  BREAD_CRUMB = "breadcrumb",
  GO_TO_PROFILE = "profile",
  PROFILE_USER_EDIT = "userEdit",
  COMMISSION = "commission",
  APPLY_FREELANCER_SUCCESS = "freelancerRegistration",
  JOB_BOARD_CREATE = "createJob",
  APPLY_TO_BE_FREELANCER = "employeeRegister",
  NOTIFICATIONS = "notifications",
  NOTIFICATION = "notification",
  JOB_CARD = "jobCard",
  JOB_CATEGORY = "jobCategory",
  JOB_DETAIL = "jobDetail",
  TERMS_AND_CONDITIONS = "terms",
  CATEGORY_FOOTER = "categoryFooter",
  CONTRACT_FORM = "contractForm",
  AVATAR_UPLOAD = "avatarUpload",
  BUSINESS = "business",
}


export const LANGUAGES = {
  th: {code: "th", label: "Thailand", flag: th, numericCode: 66},
  en: {code: "en", label: "English", flag: en, numericCode: 1},
  vi: {code: "vi", label: "Vietnam", flag: vn, numericCode: 84},
};

export const VALID_LANGUAGES = ["th", "vi", "en"];
export const LANGUAGE_COOKIE = "current-language";