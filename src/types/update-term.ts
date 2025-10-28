export type UpdateDataProps = {
  email: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
  role: "Employer" | "Freelancer";
};


