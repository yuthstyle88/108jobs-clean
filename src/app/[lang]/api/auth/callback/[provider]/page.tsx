"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {toast} from "sonner"; // หรือไลบรารีที่คุณใช้สำหรับ toast notifications
// Note: E2EE key exchange imports removed to prevent pairing on login
import {UserService} from "@/services";
import {HttpService} from "@/services/HttpService";
import {useTranslation} from "react-i18next";
import {LoginResponse} from "lemmy-js-client";

// ฟังก์ชันสำหรับดึงค่า query parameters
function useOAuthCallbackQueryParams() {
  const searchParams = useSearchParams();
  return {
    code: searchParams.get("code") || undefined,
    state: searchParams.get("state") || undefined,
  };
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const {code, state} = useOAuthCallbackQueryParams();
  const {t} = useTranslation();

  useEffect(() => {
      console.log("EEEE loginRes:",);

      async function handleOAuth() {
        try {
          // ดึงข้อมูล state จาก localStorage
          const localOAuthState = JSON.parse(
            localStorage.getItem("oauthState") || "{}"
          );

          // ตรวจสอบความถูกต้องของ OAuth state
          if (
            !(
              state &&
              code &&
              localOAuthState?.state &&
              localOAuthState?.oauthProviderId &&
              localOAuthState?.expiresAt &&
              state === localOAuthState.state
            ) ||
            localOAuthState.expiresAt < Date.now()
          ) {

            // OAuth ล้มเหลวหรือหมดอายุ
            toast.error(t("notification.oauthVerificationFailed"));
            router.replace("/login");
            return;
          }

          // เรียก API เพื่อยืนยันตัวตนด้วย OAuth
          const loginRes = await HttpService.client.authenticateWithOAuth({
            code,
            oauthProviderId: localOAuthState.oauthProviderId,
            redirectUri: localOAuthState.redirectUri,
            answer: localOAuthState.answer,
          });
          console.log("loginRes:",
            loginRes);
          if (loginRes.state === "success") {

            if (loginRes.data.jwt) {
              // Login สำเร็จ
              await handleLoginSuccess(loginRes.data,
                localOAuthState.prev);
            } else {
              // ไม่มี JWT แต่มีการตอบกลับอื่นๆ
              if (loginRes.data.verifyEmailSent) {
                toast.info(t("notification.verificationEmailSent"));
              }
              if (loginRes.data.registrationCreated) {
                toast.info(t("notification.registrationRequestSubmitted"));
              }
              router.push("/login");
              return
            }
          } else if (loginRes.state === "failed") {
            // จัดการกับข้อผิดพลาด
            let errRedirect = "/login";

            switch (loginRes.err.message) {
              case "registrationUsernameRequired":
              case "registrationApplicationAnswerRequired":
                errRedirect = `/signup?ssoProviderId=${localOAuthState.oauthProviderId}`;
                toast.error(loginRes.err.message);
                break;
              case "registrationApplicationIsPending":
                toast.error(t("notification.registrationRequestProcessing"));
                break;
              case "registrationDenied":
              case "oauthAuthorizationInvalid":
              case "oauthLoginFailed":
              case "oauthRegistrationClosed":
              case "emailAlreadyExists":
              case "usernameAlreadyExists":
              case "noEmailSetup":
                toast.error(loginRes.err.message);
                break;
              default:
                toast.error(t("notification.invalidLoginOccurred"));
                break;
            }

            router.push(errRedirect);
          }
        } catch (error) {
          console.error("OAuth error:",
            error);
          toast.error(t("notification.loginError"));
          router.replace("/login");
        }
      }

      handleOAuth().then(r => console.log("login success"));
    },
    [code, state, router]);

  return null
}

// ฟังก์ชันช่วยจัดการการเข้าสู่ระบบที่สำเร็จ
async function handleLoginSuccess(loginData: LoginResponse, prev?: string) {
  try {
    UserService.Instance.login({
      res: loginData,
    });

    // Skip E2EE key exchange during login to avoid unintended pairing on login.
    // If needed, the key exchange will be performed lazily when entering chat.
    // (Previously performed an ECDH exchange here and stored sharedKey.)
    if (prev) {
      window.location.href = prev;
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }

    // อัปเดตข้อมูลการแจ้งเตือนและข้อความที่ยังไม่ได้อ่าน (ถ้ามี)
    // UnreadCounterService.Instance.updateAll();
  } catch (error) {
    console.error("Login success handler error:",
      error);
    // ถ้าเกิดข้อผิดพลาด นำทางไปยังหน้าหลัก
    window.location.href = "/";
  }
}