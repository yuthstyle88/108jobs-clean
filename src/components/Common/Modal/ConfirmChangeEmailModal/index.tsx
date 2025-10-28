"use client";
import LoadingCircle from "@/components/Common/Loading/LoadingCircle";
import Modal from "@/components/ui/Modal";
import {zodResolver} from "@hookform/resolvers/zod";
import {Mail} from "lucide-react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {useTranslation} from "react-i18next";

const changePasswordSchema = (t: (key: string, options?: any) => string) => z
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

interface ConfirmChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmChange: () => void;
}


const ConfirmChangeEmailModal: React.FC<ConfirmChangeEmailModalProps> = ({
  isOpen,
  onClose,
  handleConfirmChange
}) => {
  const {t} = useTranslation();
  const {
    reset,
    formState: {isSubmitting},
  } = useForm({
    resolver: zodResolver(changePasswordSchema(t)),
    mode: "onChange",
  });

  const handleCloseModal = () => {
    reset();
    onClose();
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="max-w-md p-0 w-full"
      closeOnOutsideClick={false}
    >
      <section className="px-[12px] w-full flex flex-col gap-8 justify-center items-center">
        <Mail className="w-[60px] h-[60px] text-third"/>
        <article>
          <h1 className="text-base font-bold text-text-primary text-center">
            {t("profileContact.emailChangeTitle")}
          </h1>
          <p className="text-[14px] font-sans text-text-secondary text-center">
            {t("profileContact.emailChangeDescription")}
          </p>
        </article>
      </section>
      <div className="flex flex-row gap-2 justify-end items-end pt-8 w-full">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="px-3 py-2 cursor-pointer w-fit text-text-secondary rounded-md font-semibold hover:bg-gray-200 transition duration-300 "
        >
          {isSubmitting ? <LoadingCircle/> : t("global.buttonCancel")}
        </button>
        <button
          onClick={handleConfirmChange}
          disabled={isSubmitting}
          className="px-3 py-2 cursor-pointer w-fit bg-primary text-white font-normal rounded-md shadow-lg hover:bg-[#063a68] transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <LoadingCircle/> : t("global.buttonConfirm")}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmChangeEmailModal;
