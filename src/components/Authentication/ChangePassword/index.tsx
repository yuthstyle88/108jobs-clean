"use client";
import LoadingCircle from "@/components/Common/Loading/LoadingCircle";
import {CustomInput} from "@/components/ui/InputField";
import {ERROR_CONSTANTS} from "@/constants/error";
import {useHttpPost} from "@/hooks/useHttpPost";
import useNotification from "@/hooks/useNotification";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {useTranslation} from "react-i18next";
import {REQUEST_STATE} from "@/services/HttpService"; // ★ เพิ่ม

type ChangePasswordProps = {token: string};

export const ChangePassword = ({token}: ChangePasswordProps) => {
  const {t} = useTranslation();

  /* -------- schema & form -------------------------------------- */
  const changePasswordSchema = z
  .object({
    password: z.string().min(6,
      t("authen.passwordMin6")),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword,
    {
      message: t("authen.notMatchPassword"),
      path: ["confirmPassword"],
    });

  type FormData = z.infer<typeof changePasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  /* -------- http hook ------------------------------------------ */
  const {
    state: changeState,
    execute: passwordChange,
  } = useHttpPost("passwordChangeAfterReset");

  /* -------- UI states ------------------------------------------ */
  const {successMessage} = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /* -------- submit --------------------------------------------- */
  const onSubmit = async(data: FormData) => {
    setApiError(null);

    const res = await passwordChange({
      token,
      password: data.password,
      passwordVerify: data.confirmPassword,
    });

    if (res.state === REQUEST_STATE.FAILED) {
      setApiError(ERROR_CONSTANTS.CHANGE_PASSWORD_FAILED);
      return;
    }

    if (res.state === REQUEST_STATE.SUCCESS) {
      successMessage(null,
        null,
        t("authen.changePasswordSuccess"));
      window.location.href = "/login";
    }
  };

  /* -------- render --------------------------------------------- */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-text-primary text-gray-500 text-sm font-sans">
        {t("authen.newPasswordRequirements")}
      </p>

      {errors.root && (
        <p className="text-red-500 text-sm text-center mb-4">
          {errors.root.message}
        </p>
      )}

      <CustomInput
        label={t("authen.labelPassword")}
        name="password"
        type="password"
        register={register("password")}
        error={errors.password?.message}
        placeholder={t("authen.placeholderPassword")}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
      />

      <CustomInput
        label={t("authen.labelConfirmPassword")}
        name="confirmPassword"
        type="password"
        register={register("confirmPassword")}
        error={errors.confirmPassword?.message}
        placeholder={t("authen.placeholderConfirmPassword")}
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      {apiError && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm mt-4">
          {apiError}
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          disabled={changeState.state === "loading"}
          className="submit-button py-3"
        >
          {changeState.state === "loading" ? (
            <LoadingCircle/>
          ) : (
           t("authen.confirmButton")
          )}
        </button>
      </div>
    </form>
  );
};