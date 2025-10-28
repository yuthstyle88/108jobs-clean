import {RegisterDataProps} from "@/types/register-data";
import {MailCheck} from "lucide-react";
import {getNamespace} from "@/utils/i18nHelper";
import {LanguageFile} from "@/constants/language";

interface VerificationForgotPasswordProps {
  forgotEmail?: RegisterDataProps;
}

const VerificationForgotPassword: React.FC<VerificationForgotPasswordProps> = ({
  forgotEmail,
}) => {
  const notificationLanguage = getNamespace(LanguageFile.NOTIFICATION);

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="my-[3rem]">
        <p className="text-text-primary text-base font-sans">
          {notificationLanguage?.passwordResetLinkSent}: <br/>{" "}
          {forgotEmail?.email}
        </p>
        <p className="text-text-primary text-base font-sans">
          {notificationLanguage?.checkInboxForEmail}
        </p>
      </div>
      <MailCheck className="h-24 text-[60px] text-third flex justify-center items-center w-full"/>
    </div>
  );
};

export default VerificationForgotPassword;
