// utils/validation/addressSchema.ts
import { z } from "zod";
import {getNamespace} from "@/utils/i18nHelper";
import {LanguageFile} from "@/constants/language";

export const addressSchema = (namespace = LanguageFile.SELLER_CONTACT_INFO) => {
  const translations = getNamespace(namespace);

  return z
  .object({
    country: z.string(),
    province: z.string().optional(),
    districtOrSubdistrict: z.string().optional(),
    subdistrictOrDistrict: z.string().optional(),
    zipCode: z.string().optional(),
    addressDetails: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.country === "Thailand") {
      if (!data.province?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["province"],
          message: translations.pleaseSpecifyProvince || "กรุณาระบุจังหวัด"
        });
      }
      if (!data.districtOrSubdistrict?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["districtOrSubdistrict"],
          message: translations.pleaseSpecifyDistrict || "กรุณาระบุอำเภอ/เขต"
        });
      }
      if (!data.subdistrictOrDistrict?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["subdistrictOrDistrict"],
          message: translations.pleaseSpecifySubdistrict || "กรุณาระบุตำบล/แขวง"
        });
      }
      if (!data.zipCode?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["zipCode"],
          message: translations.pleaseSpecifyZipCode || "กรุณาระบุรหัสไปรษณีย์"
        });
      }
      if (!data.addressDetails?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["addressDetails"],
          message: translations.pleaseSpecifyAddressDetails || "กรุณาระบุรายละเอียดที่อยู่"
        });
      }
    } else {
      if (!data.country?.trim() || data.country === "Foreign") {
        ctx.addIssue({
          code: "custom",
          path: ["country"],
          message: translations.pleaseSelectCountry || "กรุณาเลือกประเทศ"
        });
      }
    }
  });
};

export type AddressFormData = z.infer<ReturnType<typeof addressSchema>>;
