"use client";
import Modal from "@/components/ui/Modal";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import TermsAndCondition from "./components/TermsAndCondition";
import LoadingCircle from "../../Loading/LoadingCircle";
import {getNamespace} from "@/utils/i18nHelper";
import {LanguageFile} from "@/constants/language";
import {useEffect} from "react";

interface ConfirmTermsFreelancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmChange: () => void;
  isLoading?: boolean;
}

const signUpSchema = z.object({
  termsAccepted: z.literal(true),
  privacyAccepted: z.literal(true),
  promotionalAccepted: z.boolean().optional(),
});

const ConfirmTermsFreelancerModal: React.FC<
  ConfirmTermsFreelancerModalProps
> = ({isOpen, onClose, handleConfirmChange, isLoading}) => {
  const termLanguage = getNamespace(LanguageFile.TERMS_AND_CONDITIONS);

  const {watch, register, reset} = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  useEffect(() => {
      if (!isOpen) {
        reset();
      }
    },
    [isOpen, reset]);


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[520px] p-0 w-full"
      title={termLanguage?.confirmFreelancerRegistrationTitle}
      closeOnOutsideClick={false}
    >
      <section className="px-[12px] w-full flex flex-col gap-3 justify-center">
        <p className="text-sm text-text-primary font-semibold">
          {termLanguage?.termsTitle}
        </p>
        <div className="border-1 border-border-primary p-3 rounded-lg text-[12px] list-decimal max-h-[280px] overflow-auto">
          <TermsAndCondition/>
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="termsAccepted"
              {...register("termsAccepted")}
              className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
            />
            <label
              htmlFor="termsAccepted"
              className="text-[12px] text-text-primary font-sans"
            >
              {termLanguage?.termsAcceptance}
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
              className="text-[12px] text-text-primary font-sans"
            >
              {termLanguage?.privacyAcceptance}
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="promotionalAccepted"
              {...register("promotionalAccepted")}
              className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
            />
            <label
              htmlFor="promotionalAccepted"
              className="text-[12px] text-text-primary font-sans"
            >
              {termLanguage?.marketingOptIn}
            </label>
          </div>
        </div>
      </section>
      <div className="flex flex-row gap-2 justify-end items-end pt-4 mt-4 w-full border-t-1 border-border-secondary">
        <button
          onClick={handleConfirmChange}
          disabled={!watch("termsAccepted") || !watch("privacyAccepted")}
          className="px-3 py-2 cursor-pointer w-full bg-primary text-white font-normal rounded-md shadow-lg hover:bg-[#063a68] transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingCircle/> : termLanguage?.freelancerSignup}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmTermsFreelancerModal;
