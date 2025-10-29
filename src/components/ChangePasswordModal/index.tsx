"use client";
import useNotification from "@/hooks/ui/useNotification";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import LoadingCircle from "../Common/Loading/LoadingCircle";
import {CustomInput} from "../ui/InputField";
import Modal from "../ui/Modal";
import {useTranslation} from "react-i18next";
import {useHttpPost} from "@/hooks/api/http/useHttpPost";
import {REQUEST_STATE} from "@/services/HttpService";

interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                 }) => {
    const {t} = useTranslation();

    const schema = useMemo(() => {
            return z
                .object({
                    oldPassword: z
                        .string()
                        .min(
                            6,
                            t("profileInfo.passwordMinLengthError")
                        ),
                    newPassword: z
                        .string()
                        .min(
                            6,
                            t("profileInfo.passwordMinLengthError")
                        ),
                    confirmPassword: z.string(),
                })
                .refine((data) => data.newPassword === data.confirmPassword,
                    {
                        message: t("profileInfo.passwordMismatchError"),
                        path: ["confirmPassword"],
                    });
        },
        [t]);

    type ChangePasswordFormData = z.infer<typeof schema>;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const {
        execute: changePassword,
    } = useHttpPost("changePassword");

    const {successMessage} = useNotification();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const handleCloseModal = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: ChangePasswordFormData) => {
        setApiError(null);

        const res = await changePassword({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            newPasswordVerify: data.confirmPassword,
        });

        if (res.state === REQUEST_STATE.FAILED) {
            const msg =
                res.err?.name === "incorrectLogin"
                    ? t("profileInfo.incorrectOldPassword")
                    : t("profileInfo.changePasswordError");
            setApiError(msg);
            return;
        }

        if (res.state === REQUEST_STATE.SUCCESS) {
            successMessage(null, null, t("notification.changePasswordSuccess"));
            reset();
            onClose();
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            title={t("profileInfo.password")}
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
                    placeholder={t("profileInfo.passwordPlaceholder")}
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

export default PasswordChangeModal;
