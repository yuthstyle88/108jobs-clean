"use client";

import {ProfileImage} from "@/constants/images";
import {useDateOptions} from "@/hooks/useDateOptions";
import {Trash2} from "lucide-react";
import Image from "next/image";
import {useRef} from "react";
import {useImagePreviewOnly} from "../hooks/useImagePreviewOnly";
import {usePersonalInfoForm} from "../hooks/usePersonalInfoForm";
import {InputError} from "@/components/ui/InputError";
import ErrorModal from "@/components/ui/ErrorModal";
import {useHttpPost} from "@/hooks/useHttpPost";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {useTranslation} from "react-i18next";
import {REQUEST_STATE} from "@/services/HttpService";

const IdCard = () => {

  const {execute: uploadImage, isMutating: isUploadMuting} =
    useHttpPost("uploadImage");

  const {profileState, card} = useMyUser();

  const { t } = useTranslation();

  const {days, months, years} = useDateOptions();
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const {
    file: frontFile,
    previewUrl: frontPreview,
    handleSelectImage: handleSelectFront,
    setPreviewUrl: setSelectedFront,
  } = useImagePreviewOnly(profileState === REQUEST_STATE.SUCCESS ? (card as any)?.frontCard : undefined);

  const {
    file: backFile,
    previewUrl: backPreview,
    handleSelectImage: handleSelectBack,
    setPreviewUrl: setSelectedBack,
  } = useImagePreviewOnly(profileState === REQUEST_STATE.SUCCESS ? (card as any)?.backCard : undefined);

  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isUpdateMuting,
    onSubmit,
  } = usePersonalInfoForm(
    card as any,
    frontFile,
    backFile,
    frontPreview,
    backPreview,
    uploadImage,
    setSelectedFront,
    setSelectedBack
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-1 border-border-primary bg-white rounded-md shadow-sm overflow-hidden"
    >
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-[16px] font-medium mb-2 text-text-primary">
          {t("sellerPersonalInfo.idInfoTitle")}
        </h2>
        <p className="text-gray-600 mb-6 text-[14px] font-sans">{t("sellerPersonalInfo.idInfoDescription")}</p>
      </div>

      <div className="p-6">
        <div className="pb-2">
          {errors.root && <ErrorModal message={errors.root.message}/>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* ID front */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h4 className="text-sm font-medium mb-1 text-text-primary">
              {t("sellerPersonalInfo.frontIdImage")}
            </h4>
            <p className="text-xs text-gray-500 mb-3">{t("sellerPersonalInfo.imageHint")}</p>
            <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3">
              {frontPreview ? (
                <>
                  <Image
                    src={frontPreview}
                    alt="ID front"
                    className="w-full h-60 object-contain"
                    width={500}
                    height={500}
                  />
                  <button
                    onClick={() => setSelectedFront("")}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-90"
                  >
                    <Trash2 className="h-5 w-5"/>
                  </button>
                </>
              ) : (
                <Image
                  src={ProfileImage.frontCard}
                  alt="ID back"
                  className="w-full h-60 object-contain"
                  width={500}
                  height={500}
                />
              )}
            </div>
            <input
              type="file"
              ref={frontInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleSelectFront(file);
              }}
            />
            <button
              type="button"
              onClick={() => frontInputRef.current?.click()}
              className="w-full py-2 text-primary border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {frontPreview ? t("sellerPersonalInfo.changeImage") : t("sellerPersonalInfo.changeImage")}
            </button>
          </div>

          {/* ID back */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h4 className="text-sm font-medium mb-1 text-text-primary">
              {t("sellerPersonalInfo.backIdImage")}
            </h4>
            <p className="text-xs text-gray-500 mb-3">{t("sellerPersonalInfo.imageHint")}</p>
            <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3">
              {backPreview ? (
                <>
                  <Image
                    src={backPreview}
                    alt="ID back"
                    className="w-full h-60 object-contain"
                    width={500}
                    height={500}
                  />
                  <button
                    onClick={() => setSelectedBack("")}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-90"
                  >
                    <Trash2 className="h-5 w-5"/>
                  </button>
                </>
              ) : (
                <Image
                  src={ProfileImage.backCard}
                  alt="ID back"
                  className="w-full h-60 object-contain"
                  width={500}
                  height={500}
                />
              )}
            </div>
            <input
              type="file"
              ref={backInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleSelectBack(file);
              }}
            />
            <button
              type="button"
              onClick={() => backInputRef.current?.click()}
              className="w-full py-2 text-primary border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {backPreview ? t("sellerPersonalInfo.changeImage") :  t("sellerPersonalInfo.changeImage")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("sellerPersonalInfo.firstName")}
            </label>
            <input
              {...register("name")}
              className="text-text-primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <InputError message={errors.name?.message}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
               {t("sellerPersonalInfo.lastName")}
            </label>
            <input
              {...register("surname")}
              className="text-text-primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <InputError message={errors.surname?.message}/>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("sellerPersonalInfo.idNumber")}
          </label>
          <input
            {...register("cardNumber")}
            className="text-text-primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <InputError message={errors.cardNumber?.message}/>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("sellerPersonalInfo.dateOfBirth")}
          </label>
          <div className="grid grid-cols-3 gap-4">
            <select
              {...register("birthDay")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-text-primary"
            >
              <option disabled value="Day">
                {t("profileInfo.day")}
              </option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              {...register("birthMonth")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-text-primary"
            >
              <option disabled value="Month">
                {t("profileInfo.month")}
              </option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              {...register("birthYear")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-text-primary"
            >
              <option disabled value="Year">
                {t("profileInfo.year")}
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <InputError
            message={
              errors.birthDay?.message ||
              errors.birthMonth?.message ||
              errors.birthYear?.message
            }
          />
        </div>
     
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isUpdateMuting || isUploadMuting}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-[#063a68] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting || isUpdateMuting || isUploadMuting ? (
              <span>{t("global.buttonSave")}...</span>
            ) : (
              t("global.buttonSave")
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default IdCard;
