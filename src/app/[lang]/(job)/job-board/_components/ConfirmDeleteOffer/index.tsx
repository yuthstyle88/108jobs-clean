"use client";
import LoadingCircle from "@/components/Common/Loading/LoadingCircle";
import Modal from "@/components/ui/Modal";
import {Trash2} from "lucide-react";

interface ConfirmDeleteOfferProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmChange: () => void;
  isDeleteLoading: boolean;
}

const ConfirmDeleteOffer: React.FC<ConfirmDeleteOfferProps> = ({
  isDeleteLoading,
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
        <Trash2 className="w-[65px] h-[65px] text-[#EA6357]"/>
        <article className="text-center">
          <h1 className="text-[18px] font-medium text-text-primary">
            Confirm Proposal Deletion
          </h1>
        </article>
      </section>
      <div className="flex flex-row gap-2 pt-8 w-full">
        <button
          onClick={onClose}
          className="px-10 py-3 w-full text-text-secondary font-normal rounded-md shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmChange}
          className="px-10 py-3 w-full bg-[#EA6357] text-white font-normal rounded-md shadow-lg hover:bg-[#DE5E53] transition duration-300"
        >
          {isDeleteLoading ? <LoadingCircle/> : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteOffer;
