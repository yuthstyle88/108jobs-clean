"use client";

import * as Switch from "@radix-ui/react-switch";
import {useEffect, useState} from "react";
import useNotification from "@/hooks/useNotification";
import {HttpService, REQUEST_STATE} from "@/services/HttpService";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {useTranslation} from "react-i18next";

const JobAvailable = () => {
  const {person} = useMyUser();
  const [isAvailable, setIsAvailable] = useState<boolean>(person?.available ?? true);
  const {successMessage, errorMessage} = useNotification();
  const { t } = useTranslation();
  // Sync with person.available when it changes
  useEffect(() => {
    setIsAvailable(person?.available ?? true);
  }, [person?.available]);

  // ใช้ HttpService.client เพื่อเรียก API โดยตรง
  const [isMutating, setIsMutating] = useState(false);

  const handleToggle = async (value: boolean) => {
    setIsAvailable(value);
    setIsMutating(true);
    try {
      const response = await HttpService.client.saveUserSettings({ available: value });
      if (response.state === REQUEST_STATE.SUCCESS) {
        successMessage("profile", value ? "updateAvailable" : "updateNotAvailable");
      } else {
        setIsAvailable((prev) => !prev);
        errorMessage("profile", "updateAvailableFail");
      }
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-800">{t("global.jobVailable")}</h2>
        <p className="text-sm text-gray-500">
          {t("global.toggle")}
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-700">{t("global.acptJob")}</span>
          <Switch.Root
            checked={isAvailable}
            onCheckedChange={handleToggle}
            disabled={isMutating}
            aria-label={t("global.acptJob")}
            className={`w-[42px] h-[24px] rounded-full relative transition-colors ${
              isAvailable ? "bg-primary" : "bg-gray-300"
            } ${isMutating ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
          >
            <Switch.Thumb
              className={`block w-[18px] h-[18px] bg-white rounded-full shadow-md transition-transform duration-200 ${
                isAvailable ? "translate-x-[18px]" : "translate-x-[3px]"
              }`}
            />
          </Switch.Root>
        </div>
      </div>
    </div>
  );
};

export default JobAvailable;