"use client";
import LoadingCircle from "@/components/Common/Loading/LoadingCircle";
import Modal from "@/components/ui/Modal";
import {ERROR_CONSTANTS} from "@/constants/error";
import {zodResolver} from "@hookform/resolvers/zod";
import {Mailbox} from "lucide-react";
import {useEffect, useRef, useState} from "react";
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

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmChange: () => void;
  resendDelay?: number;
  onBack?: () => void;
  onVerifySuccess?: () => void;
  formEmail?: string;
}

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({
  isOpen,
  onClose,
  handleConfirmChange,
  resendDelay = 60,
  formEmail,
}) => {
  const {t} = useTranslation();
  const {reset} = useForm({
    resolver: zodResolver(changePasswordSchema(t)),
    mode: "onChange",
  });

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(resendDelay);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendAgain, setIsSendAgain] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetCode = () => {
    setCode(Array(6).fill(""));
    inputRefs.current[0]?.focus();
  };

  useEffect(() => {
      if (!isOpen) return;

      setTimeLeft(resendDelay);
      setIsResendDisabled(true);

      const timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer);
              setIsResendDisabled(false);
              return 0;
            }
            return prevTime - 1;
          });
        },
        1000);

      return () => clearInterval(timer);
    },
    [isOpen, resendDelay]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0,
      1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async() => {
    setCodeError(null);
    setApiError(null);
    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      setCodeError(ERROR_CONSTANTS.INVALID_CODE);
      resetCode();
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/auth/verify-change-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: enteredCode,
          }),
        });

      const data = await response.json();

      if (!response.ok) {
        if (data.fieldErrors?.code) {
          setCodeError(data.fieldErrors.code);
        } else if (data.error) {
          setApiError(data.error);
        } else {
          setApiError(t("contact.invalidOrExpiredCode"));
        }
        resetCode();
        return;
      }
      resetCode();
      handleConfirmChange();
    } catch (error) {
      console.error("Verification error:",
        error);
      setApiError(ERROR_CONSTANTS.SERVER_ERROR);
      resetCode();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async() => {
    if (isResendDisabled) return;

    try {
      setIsSendAgain(true);
      const response = await fetch("/api/auth/resend-change-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formEmail,
          }),
        });

      const result = await response.json();

      if (!response.ok) {
        if (result.error) {
          setCodeError(ERROR_CONSTANTS.LIMIT_SEND_EMAIL);
        }
        return;
      }
      setTimeLeft(resendDelay);
      setIsResendDisabled(true);
    } catch (error) {
      console.error("Verification error:",
        error);
      setApiError(ERROR_CONSTANTS.SERVER_ERROR);
    } finally {
      setIsSendAgain(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="max-w-md p-0 w-full"
      closeOnOutsideClick={false}
    >
      <section className="px-[12px] w-full flex flex-col gap-8 justify-center items-center">
        <Mailbox className="w-[60px] h-[60px] text-third"/>
        <article>
          <h1 className="text-base font-bold text-text-primary text-center">
            {t("contact.emailVerificationTitle")}
          </h1>
          <p className="text-[14px] font-sans text-text-secondary text-center">
            {t("contact.emailVerificationDescription")}
            <br/> {formEmail}
          </p>
        </article>
      </section>
      <div className="text-center max-w-md mx-auto my-[2rem]">
        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              value={code[index]}
              onChange={(e) => handleInputChange(index,
                e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[index] && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              className={`text-text-primary w-12 h-12 text-center border rounded ${
                codeError ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-blue-500`}
              maxLength={1}
              disabled={isSubmitting}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {codeError && (
          <div className="text-red-600 text-sm mb-4">{codeError}</div>
        )}
      </div>
      <div className="flex flex-row gap-4 justify-end items-center pt-5 w-full">
        <button
          onClick={handleResend}
          disabled={isResendDisabled}
          className={`text-gray-500 text-sm hover:text-primary transition-colors ${
            isResendDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSendAgain ? `${t("contact.resendCode")}...` : t("contact.resendCode")}
          {isResendDisabled ? `(${timeLeft})` : ""}
        </button>
        <button
          onClick={handleVerify}
          className={`w-fit px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-lg hover:bg-[#063a68] transition duration-300 ${
            isSubmitting || code.join("").length !== 6
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={code.join("").length !== 6 || isSubmitting}
        >
          {isSubmitting ? <LoadingCircle/> : t("contact.verifyButton")}
        </button>
      </div>
      {apiError && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm mt-4">
          {apiError}
        </div>
      )}
    </Modal>
  );
};

export default ChangeEmailModal;
