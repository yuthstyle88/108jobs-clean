import {MailCheck} from "lucide-react";
import {t} from "@/utils/i18nHelper";
import {LanguageFile} from "@/constants/language";

const VerifyEmailConfirm = () => {
  return (
    <div className="text-center max-w-md mx-auto">
      <div className="my-[3rem]">
        <p className="text-text-primary text-base font-sans">
          {t(LanguageFile.NOTIFICATION, "verifyEmailLinkSent")}
        </p>
        <p className="text-text-primary text-base font-sans">
          {t(LanguageFile.NOTIFICATION, "checkInboxForEmail")}
        </p>
      </div>
      <MailCheck className="h-24 text-[60px] text-third flex justify-center items-center w-full"/>
    </div>
  );
};

export default VerifyEmailConfirm;
