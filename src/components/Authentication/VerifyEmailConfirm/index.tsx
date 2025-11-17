import {MailCheck} from "lucide-react";
import {useTranslation} from "react-i18next";

const VerifyEmailConfirm = () => {
    const {t} = useTranslation();
    return (
        <div className="text-center max-w-md mx-auto">
            <div className="my-[3rem]">
                <p className="text-text-primary text-base font-sans">
                    {t("notification.verifyEmailLinkSent")}
                </p>
                <p className="text-text-primary text-base font-sans">
                    {t("notification.checkInboxForEmail")}
                </p>
            </div>
            <MailCheck className="h-24 text-[60px] text-third flex justify-center items-center w-full"/>
        </div>
    );
};

export default VerifyEmailConfirm;
