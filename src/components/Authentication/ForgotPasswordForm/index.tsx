"use client";
import LoadingCircle from "@/components/Common/Loading/LoadingCircle";
import {CustomInput} from "@/components/ui/InputField";
import {ERROR_CONSTANTS} from "@/constants/error";
import {LanguageFile} from "@/constants/language";
import {getNamespace, t} from "@/utils/i18nHelper";
import {RegisterDataProps} from "@/types/register-data";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {useHttpPost} from "@/hooks/useHttpPost";
import {isSuccess} from "@/services/HttpService";

type VerifyForgotPasswordProps = {
  switchToVerifyForgotPassword: () => void;
  setForgotEmail: (data: RegisterDataProps) => void;
};

export const ForgotPasswordForm = ({
  switchToVerifyForgotPassword,
  setForgotEmail,
}: VerifyForgotPasswordProps) => {
  const authen = getNamespace(LanguageFile.AUTHEN);

  /* -------- schema & react-hook-form ---------------------------- */
  const forgotPasswordSchema = z.object({
    email: z.string().min(4,
      authen?.placeholderEmailPhone),
  });
  type VerifyForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<VerifyForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  /* -------- http hook ------------------------------------------ */
  // ประกาศ hook ไว้ด้านบนของคอมโพเนนต์
  const {
    state: resetState,
    execute: resetPassword,
  } = useHttpPost("passwordReset");

  /* -------- local state ---------------------------------------- */
  const [apiError, setApiError] = useState<string | null>(null);

  /* -------- submit --------------------------------------------- */
  const onSubmit = async(data: VerifyForgotPasswordFormData) => {
    setApiError(null);
    try {
      const res = await resetPassword({email: data.email});

      if (!isSuccess(res)) {
        setApiError(ERROR_CONSTANTS.EMAIL_NOT_EXIST);
        return;
      }

      // สำเร็จ
      setForgotEmail(data);
      switchToVerifyForgotPassword();
    } catch (error) {
      console.error("Password reset error:",
        error);
      setApiError(
        error instanceof Error
          ? error.message
          : t(LanguageFile.ERROR,
            "passwordResetFailed"),
      );
    }
  };

  /* -------- render --------------------------------------------- */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-sm text-gray-600 mb-6">
        {authen?.verificationMessage}
      </div>

      <CustomInput
        label={authen?.labelContactEmailPhone}
        name="email"
        register={register("email")}
        error={errors.email?.message}
        placeholder={authen?.placeholderEmailPhone}
      />

      {apiError && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm mt-4">
          {apiError}
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          className="submit-button py-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingCircle/> : authen?.sendCodeButton}
        </button>
      </div>
    </form>
  );
};