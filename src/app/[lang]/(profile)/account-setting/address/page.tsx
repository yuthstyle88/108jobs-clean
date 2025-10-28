"use client";
import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import ProvinceSelect from "@/components/ThaiAddress/ProvinceSelect";
import DistrictSelect from "@/components/ThaiAddress/DistrictSelect";
import SubdistrictSelect from "@/components/ThaiAddress/SubdistrictSelect";
import {useDistricts, useProvinces, useSubdistricts} from "@/hooks/useThaiGeography";
import useNotification from "@/hooks/useNotification";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {HttpService, REQUEST_STATE} from "@/services/HttpService";
import {CreateOrUpdateAddress} from "lemmy-js-client";

const createAddressSchema = (t: any) =>
    z.object({
        addressLine1: z.string().min(1, t("address.addressLine1Required")),
        addressLine2: z.string().optional(),
        subdistrict: z.string().min(1, t("address.subdistrictRequired")),
        district: z.string().min(1, t("address.districtRequired")),
        province: z.string().min(1, t("address.provinceRequired")),
        postalCode: z.string().min(1, t("address.postalCodeRequired")),
        countryId: z.string().min(1, t("address.countryRequired")),
        isDefault: z.boolean().optional(),
    });

export default function Address() {
    const {t} = useTranslation();
    const {successMessage} = useNotification();
    const {address, profileState} = useMyUser();
    const [apiError, setApiError] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    const addressSchema = createAddressSchema(t);
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        mode: "onChange",
        defaultValues: {
            addressLine1: "",
            addressLine2: "",
            subdistrict: "",
            district: "",
            province: "",
            postalCode: "",
            countryId: "TH",
            isDefault: false,
        },
    });

    const [provinceCode, setProvinceCode] = useState<string | undefined>(undefined);
    const [districtCode, setDistrictCode] = useState<string | undefined>(undefined);
    const [subdistrictCode, setSubdistrictCode] = useState<string | undefined>(undefined);

    const {options: provinceOptions, loading: loadingProv, raw: provinceRaw} = useProvinces();
    const {options: districtOptions, loading: loadingDist} = useDistricts(provinceCode);
    const {options: subdistrictOptions, loading: loadingSub, raw: subdistrictRaw} = useSubdistricts(districtCode);

    // Initialize form with address data from useMyUser
    useEffect(() => {
        if (profileState !== "success" || !address || isReady || loadingProv || !provinceRaw.length) return;

        const provinceCodeFound = String(address.province || "");
        const districtCodeFound = String(address.district || "");
        const subdistrictCodeFound = String(address.subdistrict || "");

        // Set form values with codes
        reset({
            addressLine1: address.addressLine1 || "",
            addressLine2: address.addressLine2 || "",
            subdistrict: subdistrictCodeFound,
            district: districtCodeFound,
            province: provinceCodeFound,
            postalCode: address.postalCode || "",
            countryId: address.countryId || "TH",
            isDefault: address.isDefault || false,
        });

        setProvinceCode(provinceCodeFound || undefined);
        setDistrictCode(districtCodeFound || undefined);
        setSubdistrictCode(subdistrictCodeFound || undefined);
        setIsReady(true);
    }, [profileState, address, isReady, reset, provinceRaw, loadingProv]);

    // Reset district and subdistrict when province changes
    useEffect(() => {
        if (!provinceCode || provinceCode !== address?.province) {
            setDistrictCode(undefined);
            setSubdistrictCode(undefined);
            setValue("district", "", {shouldValidate: true});
            setValue("subdistrict", "", {shouldValidate: true});
            setValue("postalCode", "", {shouldValidate: true});
        }
    }, [provinceCode, setValue]);

    // Reset subdistrict when district changes  
    useEffect(() => {
        if (!districtCode) {
            setSubdistrictCode(undefined);
            setValue("subdistrict", "", {shouldValidate: true});
            setValue("postalCode", "", {shouldValidate: true});
        }
    }, [districtCode, setValue]);

    const onSubmitAddress = useCallback(
        async (data: CreateOrUpdateAddress) => {
            try {
                setApiError(null);

                const payload: CreateOrUpdateAddress = {
                    addressLine1: data.addressLine1,
                    addressLine2: data.addressLine2 || undefined,
                    subdistrict: subdistrictCode || "",
                    district: districtCode || "",
                    province: provinceCode || "",
                    postalCode: data.postalCode,
                    countryId: data.countryId,
                    isDefault: data.isDefault || false,
                };

                const addressRes = await HttpService.client.updateAddress(payload);

                switch (addressRes.state) {
                    case REQUEST_STATE.SUCCESS: {
                        successMessage("profile", "update");
                        break;
                    }
                    case REQUEST_STATE.FAILED: {
                        setApiError(t(`address.${addressRes.err.name}`) || t("address.updateFailed"));
                        break;
                    }
                }
            } catch (error) {
                setApiError(t("address.updateFailed"));
            }
        },
        [t, successMessage, provinceCode, districtCode, subdistrictCode]
    );

    const isFormValid = !errors.addressLine1 && !errors.province && !errors.district && !errors.subdistrict && !errors.postalCode;

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmitAddress)}
                className="bg-white rounded-xl font-sans shadow-lg border border-gray-200"
            >
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-[16px] font-medium mb-2 text-text-primary">{t("address.addressTitleHeading")}</h2>
                    <p className="text-gray-600 mb-6 text-[14px] font-sans">{t("address.addressSubheading")}</p>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                    {apiError && (
                        <div className="md:col-span-2 bg-red-50 text-red-600 text-sm font-sans p-4 rounded-lg">
                            {apiError}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("address.country")}</label>
                        <select
                            {...register("countryId")}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                                errors.countryId ? "border-red-500" : "border-gray-300"
                            }`}
                        >
                            <option value="TH">{t("address.thaiCountryLabel")}</option>
                            <option value="VN">{t("address.vietnamCountryLabel")}</option>
                        </select>
                        {errors.countryId && (
                            <p className="text-red-500 text-xs font-sans mt-1.5">{errors.countryId.message}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2">{t("address.addressLine1Label")}</label>
                        <input
                            {...register("addressLine1")}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                                errors.addressLine1 ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder={t("address.addressLine1Placeholder")}
                        />
                        {errors.addressLine1 && (
                            <p className="text-red-500 text-xs font-sans mt-1.5">{errors.addressLine1.message}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2">{t("address.addressLine2Label")}</label>
                        <input
                            {...register("addressLine2")}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            placeholder={t("address.addressLine2Placeholder")}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("address.provinceDistrictSubdistrict")}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <ProvinceSelect
                                    value={provinceCode}
                                    options={provinceOptions}
                                    loading={loadingProv}
                                    onChange={(v) => {
                                        setProvinceCode(v);
                                        setValue("province", v || "", {shouldValidate: true});
                                    }}
                                    placeholder={t("address.provincePlaceholder")}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                />
                                {errors.province && (
                                    <p className="text-red-500 text-xs font-sans mt-1.5">{errors.province.message}</p>
                                )}
                            </div>
                            <div>
                                <DistrictSelect
                                    value={districtCode}
                                    options={districtOptions}
                                    loading={loadingDist}
                                    disabled={!provinceCode}
                                    onChange={(v) => {
                                        setDistrictCode(v);
                                        setValue("district", v || "", {shouldValidate: true});
                                    }}
                                    placeholder={t("address.districtPlaceholder")}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                />
                                {errors.district && (
                                    <p className="text-red-500 text-xs font-sans mt-1.5">{errors.district.message}</p>
                                )}
                            </div>
                            <div>
                                <SubdistrictSelect
                                    value={subdistrictCode}
                                    options={subdistrictOptions}
                                    loading={loadingSub}
                                    disabled={!districtCode}
                                    onChange={(v) => {
                                        setSubdistrictCode(v);
                                        setValue("subdistrict", v || "", {shouldValidate: true});
                                        const found = subdistrictRaw?.find((s) => String(s.subdistrictCode) === String(v));
                                        setValue("postalCode", found?.postalCode ? String(found.postalCode) : "", {
                                            shouldValidate: true,
                                        });
                                    }}
                                    placeholder={t("address.subdistrictPlaceholder")}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                />
                                {errors.subdistrict && (
                                    <p className="text-red-500 text-xs font-sans mt-1.5">{errors.subdistrict.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2">{t("address.postalCodeLabel")}</label>
                        <input
                            {...register("postalCode")}
                            readOnly
                            className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                                errors.postalCode ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder={t("address.postalCodePlaceholder")}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="inline-flex items-center gap-3">
                            <input
                                type="checkbox"
                                {...register("isDefault")}
                                className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{t("address.setDefaultAddress")}</span>
                        </label>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !isFormValid}
                        className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                            isSubmitting || !isFormValid
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-primary hover:bg-[#063a68] active:bg-blue-800 shadow-md hover:shadow-lg"
                        }`}
                    >
                        {isSubmitting ? t("address.isSavingButtonLabel") : t("address.saveAddressButtonLabel")}
                    </button>
                </div>
            </form>
        </>
    );
}