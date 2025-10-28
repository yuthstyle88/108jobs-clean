export type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  promotionalAccepted?: boolean;
  captchaUuid?: string;
  captchaAnswer: string;
};