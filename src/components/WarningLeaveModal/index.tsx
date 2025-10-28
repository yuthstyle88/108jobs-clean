"use client";

import Modal from "@/components/ui/Modal";
import {CircleAlert} from "lucide-react";

interface WarningLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmChange: () => void;
}

const WarningLeaveModal: React.FC<WarningLeaveModalProps> = ({
  isOpen,
  onClose,
  handleConfirmChange,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-0 w-full"
      closeOnOutsideClick={false}
    >
      <section className="px-[12px] w-full flex flex-col gap-8 justify-center items-center">
        <CircleAlert className="w-[65px] h-[65px] text-red-500"/>
        <article>
          <h1 className="text-[18px] font-medium text-text-primary text-center">
            You haven&apos;t saved your changes yet.
          </h1>
          <p className="text-[14px] font-sans text-text-secondary text-center pt-3">
            Please save before leaving this page to avoid losing your data.
          </p>
        </article>
      </section>
      <div className="flex flex-row gap-2 justify-end items-end pt-8 w-full">
        <button
          onClick={onClose}
          className="px-6 py-3 cursor-pointer w-fit text-gray-600 font-normal hover:text-gray-700 transition duration-300"
        >
          Continue Editing
        </button>
        <button
          onClick={handleConfirmChange}
          className="px-10 py-3 cursor-pointer w-fit bg-red-500 text-white font-normal rounded-md shadow hover:bg-red-600 transition duration-300"
        >
          Leave
        </button>
      </div>
    </Modal>
  );
};

export default WarningLeaveModal;
