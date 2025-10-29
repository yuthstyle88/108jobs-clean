"use client";
import ErrorPage from "@/app/[lang]/error";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
import {ERROR_CONSTANTS} from "@/constants/error";
import useNotification from "@/hooks/ui/useNotification";
import {HttpService,} from "@/services";
import {useEffect, useRef, useState} from "react";
import {t} from "@/utils/i18nHelper";
import {LanguageFile} from "@/constants/language";
import {REQUEST_STATE} from "@/services/HttpService";

type VerifyEmailRegisterProps = {
  code: string;
};

export const VerifyEmailRegister = ({code}: VerifyEmailRegisterProps) => {
  const {successMessage} = useNotification();
  const [apiError, setApiError] = useState<string | null>(null);
  const hasCalled = useRef(false);

  useEffect(() => {
      if (hasCalled.current) return;

      hasCalled.current = true;

      const verifyEmail = async() => {
        try {
          setApiError(null);
          const verifyRes = await HttpService.client.verifyEmail({code});
          console.log("verifyRes",
            verifyRes);

          if (verifyRes.state === REQUEST_STATE.FAILED) {
            setApiError(ERROR_CONSTANTS.CHANGE_PASSWORD_FAILED);
            return;
          }
          successMessage(null,
            null,
            t(LanguageFile.NOTIFICATION, "verifyEmailSuccess"));
          window.location.href = "/login";
        } catch (error) {
          setApiError(
            error instanceof Error
              ? error.message
              : "มีข้อผิดพลาดในการเปลี่ยนรหัสผ่านของคุณ"
          );
        }
      };

      verifyEmail();
    },
    [code]);

  return apiError ? <ErrorPage/> : <LoadingBlur text=""/>;
};
