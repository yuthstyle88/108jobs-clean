"use client";
import {ERROR_CONSTANTS} from "@/constants/error";
import useNotification from "@/hooks/ui/useNotification";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import LoadingCircle from "../../Loading/LoadingCircle";
import {CustomInput} from "../../../ui/InputField";
import Modal from "../../../ui/Modal";
import {useTranslation} from "react-i18next";
import * as z from "zod";


interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {t} = useTranslation();

  const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6,
      t("authen.passwordMin6")),
    newPassword: z.string().min(6,
      t("authen.passwordMin6")),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword,
    {
      message: t("authen.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });
  type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: {errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const {successMessage} = useNotification();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleCloseModal = () => {
    reset();
    onClose();
  }

  const onSubmit = async(data: ChangePasswordFormData) => {
    try {
      setApiError(null);

      const response = await fetch("/api/auth/update-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
          }),
        });

      const result = await response.json();

      if (!response.ok) {
        if (result.fieldErrors?.oldPassword) {
          setError("oldPassword",
            {
              type: "manual",
              message: result.fieldErrors.oldPassword,
            });
        }
        if (result.error && !result.fieldErrors?.oldPassword) {
          setApiError(ERROR_CONSTANTS.CHANGE_PASSWORD_FAILED);
        }
        return;
      }
      reset();
      onClose();
      successMessage("profile",
        "changePassword");
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : ERROR_CONSTANTS.CHANGE_PASSWORD_FAILED
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={t("profileInfo.sectionPassword")}
      className="max-w-md w-full"
      closeOnOutsideClick={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomInput
          label={t("profileInfo.oldPassword")}
          name="oldPassword"
          type="password"
          register={register("oldPassword")}
          error={errors.oldPassword?.message}
          placeholder={t("profileInfo.passwordPlaceholder")}
          showPassword={showOldPassword}
          toggleShowPassword={() => setShowOldPassword(!showOldPassword)}
        />
        <CustomInput
          label={t("profileInfo.newPassword")}
          name="newPassword"
          type="password"
          register={register("newPassword")}
          error={errors.newPassword?.message}
          placeholder={t("profileInfo.passwordPlaceholder")}
          showPassword={showNewPassword}
          toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
        />

        <CustomInput
          label={t("profileInfo.confirmPasswordLabel")}
          name="confirmPassword"
          type="password"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          placeholder={t("profileInfo.confirmPasswordPlaceholder")}
          showPassword={showConfirmPassword}
          toggleShowPassword={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
        />

        {apiError && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm mt-4">
            {apiError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button py-2"
        >
          {isSubmitting ? <LoadingCircle/> : t("profileInfo.submitButton")}
        </button>
      </form>
    </Modal>
  );
};

export default ConfirmModal;