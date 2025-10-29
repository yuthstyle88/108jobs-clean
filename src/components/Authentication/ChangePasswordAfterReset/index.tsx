"use client";
import LoadingCircle from "@/components/Common/Loading/LoadingCircle";
import {CustomInput} from "@/components/ui/InputField";
import {ERROR_CONSTANTS} from "@/constants/error";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {useHttpPost} from "@/hooks/useHttpPost"; // ★ เพิ่ม
import useNotification from "@/hooks/useNotification";
import {REQUEST_STATE} from "@/services/HttpService";

type ChangePasswordProps = {token: string};

export const ChangePasswordAfterReset = ({token}: ChangePasswordProps) => {
  const authen = getNamespace(LanguageFile.AUTHEN);

  /* ---------- schema & form ------------------------------------ */
  const schema = z
  .object({
    password: z.string().min(6,
      authen?.passwordMin6),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword,
    {
      message: authen?.notMatchPassword,
      path: ["confirmPassword"],
    });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  /* ---------- http hook ---------------------------------------- */
  const {
    state: changeState,
    execute: passwordChangeAfterReset,
  } = useHttpPost("passwordChangeAfterReset");

  /* ---------- UI states ---------------------------------------- */
  const {successMessage} = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const notificationLanguage = getNamespace(LanguageFile.NOTIFICATION);

  /* ---------- submit ------------------------------------------- */
  const onSubmit = async(data: FormData) => {
    setApiError(null);

    const res = await passwordChangeAfterReset({
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
        notificationLanguage?.changePasswordSuccess);
      window.location.href = "/login";
    }
  };

  /* ---------- render ------------------------------------------- */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-text-primary text-sm font-sans">
        Create a new password. Your password must be at least 8 characters long
        and contain a mix of letters and numbers.
      </p>

      {errors.root && (
        <p className="text-red-500 text-sm text-center mb-4">
          {errors.root.message}
        </p>
      )}

      <CustomInput
        label={authen?.labelPassword}
        name="password"
        type="password"
        register={register("password")}
        error={errors.password?.message}
        placeholder={authen?.placeholderPassword}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
      />

      <CustomInput
        label={authen?.labelConfirmPassword}
        name="confirmPassword"
        type="password"
        register={register("confirmPassword")}
        error={errors.confirmPassword?.message}
        placeholder={authen?.placeholderConfirmPassword}
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
            authen?.confirmButton
          )}
        </button>
      </div>
    </form>
  );
};