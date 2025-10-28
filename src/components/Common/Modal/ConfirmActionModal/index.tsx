"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import {CircleAlert} from "lucide-react";
import {useTranslation} from "react-i18next";

export type ConfirmActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-0 w-full"
      closeOnOutsideClick={false}
    >
      <section className="px-[12px] w-full flex flex-col gap-6 justify-center items-center">
        <CircleAlert className="w-[56px] h-[56px] text-[#EA6357]" />
        <article className="text-center">
          {title && (
            <h1 className="text-[18px] font-medium text-text-primary">{title}</h1>
          )}
          {message && (
            <p className="text-[14px] font-sans text-text-secondary pt-3">{message}</p>
          )}
        </article>
      </section>
      <div className="flex flex-row gap-2 pt-8 w-full">
        <button
          onClick={onClose}
          className="px-10 py-3 w-full text-text-secondary font-normal rounded-md shadow-lg hover:bg-gray-100 transition duration-300"
        >
          {cancelText || t("global.buttonCancel") || "Cancel"}
        </button>
        <button
          onClick={onConfirm}
          className="px-10 py-3 w-full bg-[#EA6357] text-white font-normal rounded-md shadow-lg hover:bg-[#DE5E53] transition duration-300"
        >
          {confirmText || t("global.buttonConfirm") || "Confirm"}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmActionModal;
