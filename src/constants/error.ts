import {t} from "@/utils/i18nHelper";
import {LanguageFile} from "@/constants/language";

export const ERROR_REGISTER = {
  emailAlreadyExists: "EMAIL_ALREADY_EXISTS",
  databaseError: "DATABASE_ERROR",
  rateLimitError: "RATE_LIMIT_ERROR",
};

export const ERROR_VERIFY_EMAIL = {
  verificationCodeExpired: "VERIFICATION_CODE_EXPIRED",
  invalidVerificationCode: "INVALID_VERIFICATION_CODE",
};

export const ERROR_VERIFY_PASSWORD = {
  invalidPassword: "INVALID_PASSWORD",
  invalidCredentials: "INVALID_CREDENTIALS",
};

export const ERROR_CONSTANTS = {
  EMAIL_EXIST: () => t(LanguageFile.ERROR, "emailExists"),
  EMAIL_VERIFIED: () => t(LanguageFile.ERROR, "emailVerified"),
  EMAIL_REQUIRED: () => t(LanguageFile.ERROR, "emailRequired"),
  USERNAME_EXIST: () => t(LanguageFile.ERROR, "usernameExists"),
  INVALID_CODE: () => t(LanguageFile.ERROR, "invalidCode"),
  SERVER_ERROR: () => t(LanguageFile.ERROR, "serverError"),
  RESEND_FAILED: () => t(LanguageFile.ERROR, "resendFailed"),
  LIMIT_SEND_EMAIL: () => t(LanguageFile.ERROR, "limitSendEmail"),
  EMAIL_NOT_EXIST: () => t(LanguageFile.ERROR, "emailNotExist"),
  INVALID_PASSWORD: () => t(LanguageFile.ERROR, "invalidPassword"),
  INVALID_OLD_PASSWORD: () => t(LanguageFile.ERROR, "invalidOldPassword"),
  CHANGE_PASSWORD_FAILED: () => t(LanguageFile.ERROR, "changePasswordFailed"),
  CAPTCHA_WRONG: () => t(LanguageFile.ERROR, "captchaWrong"),
  USERNAME_INVALID: () => t(LanguageFile.ERROR, "usernameInvalid"),
};
