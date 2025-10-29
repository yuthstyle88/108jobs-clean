"use client";

import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";
import useNotification from "@/hooks/useNotification";
import {useTranslation} from "react-i18next";
import {useHttpPost} from "@/hooks/useHttpPost";
import {REQUEST_STATE} from "@/services/HttpService";
import {useUserStore} from "@/store/useUserStore";

const JobAvailable = () => {
  const { person, setPerson } = useUserStore();
  const {successMessage, errorMessage} = useNotification();
  const { execute: saveUserSettings } = useHttpPost("saveUserSettings");
  const { t } = useTranslation();

  // ใช้ HttpService.client เพื่อเรียก API โดยตรง
  const [isMutating, setIsMutating] = useState(false);

  const handleToggle = async (value: boolean) => {
    const prevPerson = person ?? null;
    // snapshot old value
    const prev = person?.available ?? true;

    // optimistic update to the store so all pages reflect immediately
    if (prevPerson) {
      setPerson({ ...prevPerson, available: value });
    }
    setIsMutating(true);
    try {
      const response = await saveUserSettings({ available: value });
      if (response.state === REQUEST_STATE.SUCCESS) {
        successMessage("profile", value ? "updateAvailable" : "updateNotAvailable");
      } else {
        // revert store
        if (prevPerson) {
          setPerson({ ...prevPerson, available: prev });
        }
        errorMessage("profile", "updateAvailableFail");
      }
    } catch (e) {
      if (prevPerson) {
        setPerson({ ...prevPerson, available: prev });
      }
      errorMessage("profile", "updateAvailableFail");
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
            checked={Boolean(person?.available)}
            onCheckedChange={(checked) => handleToggle(Boolean(checked))}
            disabled={isMutating}
            aria-label={t("global.acptJob")}
            className={`relative w-[42px] h-[24px] rounded-full transition-colors bg-gray-300 data-[state=checked]:bg-primary ${
              isMutating ? "opacity-50 pointer-events-none" : "cursor-pointer"
            }`}
          >
            <Switch.Thumb
              className={`block w-[18px] h-[18px] bg-white rounded-full shadow-md transition-transform duration-200 translate-x-[3px] data-[state=checked]:translate-x-[21px]`}
            />
          </Switch.Root>
        </div>
      </div>
    </div>
  );
};

export default JobAvailable;