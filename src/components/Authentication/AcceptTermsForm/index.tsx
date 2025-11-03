"use client";
import LoadingCircle from "@/components/Common/Loading/LoadingCircle";
import {CustomInput} from "@/components/ui/InputField";
/* เพิ่ม hook */
import {useHttpPost} from "@/hooks/api/http/useHttpPost";
import {HttpService, UserService} from "@/services";
import {isSuccess, REQUEST_STATE} from "@/services/HttpService"; // เพิ่ม import นี้
import {RegisterOAuthFormData} from "@/types/formTypes/RegisterOAuth";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {useTranslation} from "react-i18next";

type UpdateTermsFormProps = {
  title?: string;
};

export const AcceptTermsForm = ({ title }: UpdateTermsFormProps) => {
  const {t} = useTranslation();

  const UpdateSchema = z
  .object({
    email: z.string().email(t("authen.invalidEmail")),
    password: z.string().min(6, t("authen.passwordMin6")),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true),
    privacyAccepted: z.boolean().refine((val) => val === true),
  })
  .refine((data) => data.password === data.confirmPassword,
    {
      message: t("authen.notMatchPassword"),
      path: ["confirmPassword"],
    });

  type UpdateFormDataType = z.infer<typeof UpdateSchema>;
  const resolver = zodResolver(UpdateSchema);
  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
  } = useForm<RegisterOAuthFormData>({
    resolver,
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

useEffect(() => {
  (async () => {
    try {
      const pending = sessionStorage.getItem('pendingLogin');
      if (pending) {
        const parsed = JSON.parse(pending);
        let token: string | undefined;
        if (typeof parsed === 'string') token = parsed;
        if (token) await HttpService.client.setHeaders({Authorization: `Bearer ${token}`});
        // Do not remove here; onSubmit will remove after successful login
      }
      // HttpService.client.setBaseUrl(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080');
    } catch (e) {
      console.warn('[AcceptTermsForm] init failed', e);
    }
  })();
}, []);
  const {
    state: updateState,            // ดูสถานะการยิง API
    execute: updateTerm,           // ฟังก์ชันยิง API
  } = useHttpPost("updateTerm");

  const [apiError, setApiError] = useState<string | null>(null);
  useEffect(() => {
      try {
        // Try getting email from URL query string first
        const params = new URLSearchParams(window.location.search);
        const urlEmail = params.get('email');

        // Fallback to stored user info if URL param not found
        const email = urlEmail ?? "";

        if (email) {
          setValue('email', email);
        }
      } catch (error) {
        console.error('System Error: ', error);
      }
    },
    [setValue]);


  const onSubmit = async(data: UpdateFormDataType) => {
    setApiError(null);

    /* payload ตามที่ backend ต้องการ */
    const payload = {
      email: data.email,
      password: data.password,
      passwordVerify: data.confirmPassword,
      termsAccepted: data.termsAccepted,
    };

    const res = await updateTerm(payload);

    if (isSuccess(res)) {
      // 1) ให้ server เซ็ตคุกกี้ให้เสร็จก่อน (Safari ชอบยกเลิก request ถ้า redirect ทันที)
      setIsRedirecting(true);
      try {
        const pending = sessionStorage.getItem('pendingLogin');
        if (pending) {
          const parsed = JSON.parse(pending);
          await UserService.Instance.login({ res: parsed });
          sessionStorage.removeItem('pendingLogin');
        } else {
          await UserService.Instance.login({ res: res.data });
        }
        // รอ microtask เล็กน้อยให้ Set-Cookie/IO จบก่อน (ช่วย Safari)
        await new Promise((r) => setTimeout(r, 150));
        // ใช้ replace เพื่อลดโอกาสย้อนกลับหน้าเดิมและให้ middleware เห็นคุกกี้แน่
        window.location.replace("/");
      } catch (e) {
        console.error('Login redirect error:', e);
        // fallback
        window.location.href = "/";
      }
    } else if (res.state === REQUEST_STATE.FAILED) {
      setApiError(res.err.message ?? "Error: Accept form failed. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative">
      {/* Overlay loading ระหว่างกำลัง redirect หลัง login สำเร็จ */}
      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-lg flex items-center gap-3">
            <LoadingCircle />
            <span className="text-sm text-text-primary">{t("global.labelSignInButton")}...</span>
          </div>
        </div>
      )}

      <CustomInput
        label={t("authen.labelEmail")}
        required={true}
        name="email"
        register={register("email")}
        error={errors.email?.message}
        placeholder={t("authen.placeholderEmail")}
        readonly
        type="email"
      />

      <CustomInput
        label={t("authen.labelPassword")}
        required={true}
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
        required={true}
        name="confirmPassword"
        type="password"
        register={register("confirmPassword")}
        error={errors.confirmPassword?.message}
        placeholder={t("authen.placeholderConfirmPassword")}
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="termsAccepted"
            {...register("termsAccepted")}
            className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
          />
          <label
            htmlFor="termsAccepted"
            className="text-sm text-text-primary text-gray-500 font-sans"
          >
            {t("authen.checkboxTermsConditions")}{" "}
            <Link
              prefetch={false}
              href="/content/terms"
              className="text-text-primary underline"
            >
              {t("authen.checkboxTermsConditionsRedirect")}
            </Link>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="privacyAccepted"
            {...register("privacyAccepted")}
            className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
          />
          <label
            htmlFor="privacyAccepted"
            className="text-sm text-text-primary text-gray-500  font-sans"
          >
            {t("authen.checkboxTermsConditions")}{" "}
            <Link
              prefetch={false}
              href="/content/privacy"
              className="text-text-primary underline"
            >
              {t("authen.checkboxPrivacyPolicyRedirect")}
            </Link>
          </label>
        </div>
      </div>

      {apiError && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
          {apiError}
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          className="submit-button py-3"
          disabled={
            updateState.state === "loading" ||          // กดซ้ำไม่ได้
            !!errors.confirmPassword ||
            !watch("termsAccepted") ||
            !watch("privacyAccepted")
          }
        >
          {updateState.state === "loading" ? (
            <LoadingCircle/>
          ) : (
            t("authen.linkCreateAccount")
          )}
        </button>
      </div>
    </form>
  );
};