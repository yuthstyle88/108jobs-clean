"use client";

import Modal from "@/components/ui/Modal";
import {BASE_URL} from "@/config/env";
import useNotification from "@/hooks/useNotification";
import {faFacebook, faLinkedin, faTwitter,} from "@fortawesome/free-brands-svg-icons";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePathname} from "next/navigation";
import {useTranslation} from "react-i18next";

interface ShareJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareJobModal: React.FC<ShareJobModalProps> = ({isOpen, onClose}) => {
  const {successMessage} = useNotification();
  const pathname = usePathname();
  const shareUrl = `${BASE_URL}${pathname}`;
  const {t} = useTranslation();

  const handleCopy = async() => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      successMessage(null,
        null,
        t("notification.copySuccess"));
    } catch (error) {
      console.error("Failed to copy link:",
        error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-0 w-full"
      title="Share This Job"
      closeOnOutsideClick={false}
    >
      <div className="flex gap-2 justify-between items-center pt-2 pb-12 px-4 w-full">
        <div className="flex flex-col items-center">
          <FontAwesomeIcon
            icon={faFacebook}
            className="text-[50px] text-third"
          />
          <p className="text-[14px] font-sans text-text-primary">Facebook</p>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon
            icon={faLinkedin}
            className="text-[50px] text-[#006699]"
          />
          <p className="text-[14px] font-sans text-text-primary">Linkedin</p>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon
            icon={faTwitter}
            className="text-[50px] text-[#1da1f2]"
          />
          <p className="text-[14px] font-sans text-text-primary">Twitter</p>
        </div>
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={handleCopy}
        >
          <div className="w-[50px] h-[50px] bg-[#9ba6b5] rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faLink} className="text-[22px] text-white"/>
          </div>
          <p className="text-[14px] font-sans text-text-primary">Copy Link</p>
        </div>
      </div>
    </Modal>
  );
};

export default ShareJobModal;
