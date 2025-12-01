"use client";

import React, {useState, useEffect} from "react";
import {AdminLayout} from "@/modules/admin/components/layout/AdminLayout";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import {useHttpPost} from "@/hooks/api/http/useHttpPost";
import {isSuccess} from "@/services/HttpService";
import {toast} from "sonner";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload, faGlobe} from "@fortawesome/free-solid-svg-icons";
import {useSiteStore} from "@/store/useSiteStore";

export default function SiteAppearancePage() {
    const {setSiteRes} = useSiteStore();
    const {data: siteData, isMutating: loadingSite, execute: refetch} = useHttpGet("getSite");
    const {execute: uploadIcon, isMutating: uploadingIcon} = useHttpPost("uploadSiteIcon");
    const {execute: uploadBanner, isMutating: uploadingBanner} = useHttpPost("uploadSiteBanner");

    const [iconFile, setIconFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const siteName = siteData?.siteView?.site?.name || "Your Site";

    useEffect(() => {
        if (!siteData?.siteView?.site) return;

        const { icon, banner } = siteData.siteView.site;
        if (icon) setIconPreview(icon);
        if (banner) setBannerPreview(banner);
    }, [siteData]);

    const handleFileChange = (
        type: "icon" | "banner",
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image must be under 10MB");
            return;
        }

        if (type === "icon") {
            setIconFile(file);
        } else {
            setBannerFile(file);
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            if (type === "icon") setIconPreview(result);
            else setBannerPreview(result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async (type: "icon" | "banner") => {
        const file = type === "icon" ? iconFile : bannerFile;
        if (!file) {
            toast.error(`Please select a ${type === "icon" ? "logo" : "banner"} first`);
            return;
        }

        const execute = type === "icon" ? uploadIcon : uploadBanner;

        const res = await execute({ image: file });

        if (isSuccess(res) && res.data?.images?.[0]?.imageUrl) {
            toast.success(`${type === "icon" ? "Logo" : "Banner"} updated successfully!`);
            await refetch();
            setSiteRes(siteData);
            if (type === "icon") setIconFile(null);
            else setBannerFile(null);
        } else {
            toast.error(`Failed to upload ${type === "icon" ? "logo" : "banner"}`);
        }
    };

    if (loadingSite) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="bg-[#F6F9FE] min-h-screen py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <FontAwesomeIcon icon={faGlobe} className="text-3xl text-primary"/>
                            <h1 className="text-3xl font-bold text-gray-900">Site Appearance</h1>
                        </div>

                        <p className="text-gray-600 mb-10">
                            Update your site's logo and hero banner. These will appear on the homepage and across the
                            platform.
                        </p>

                        {/* Site Logo */}
                        <div className="mb-12">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Site Logo (Recommended: 512×512px,
                                PNG/SVG)</h2>
                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Current Logo</label>
                                    <div
                                        className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center">
                                        {iconPreview ? (
                                            <Image
                                                src={iconPreview}
                                                alt="Current site logo"
                                                width={160}
                                                height={160}
                                                className="rounded-lg object-contain max-h-40"
                                            />
                                        ) : (
                                            <p className="text-gray-500">No logo set</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Upload New
                                        Logo</label>
                                    <div className="space-y-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange("icon", e)}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                                        />
                                        {iconFile && (
                                            <button
                                                onClick={() => handleUpload("icon")}
                                                disabled={uploadingIcon}
                                                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 disabled:opacity-70 transition"
                                            >
                                                <FontAwesomeIcon icon={faUpload}/>
                                                {uploadingIcon ? "Uploading..." : "Upload New Logo"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="my-12 border-gray-200"/>

                        {/* Hero Banner */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Hero Banner (Recommended: 1920×1080px or larger, JPG/PNG)
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Current
                                        Banner</label>
                                    <div
                                        className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden">
                                        {bannerPreview ? (
                                            <div className="relative aspect-video">
                                                <Image
                                                    src={bannerPreview}
                                                    alt="Current hero banner"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                                                <div className="absolute bottom-6 left-6 text-white">
                                                    <h3 className="text-3xl font-bold">{siteName}</h3>
                                                    <p className="text-lg opacity-90">Welcome to your marketplace</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-64 flex items-center justify-center">
                                                <p className="text-gray-500">No banner set</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Upload New
                                        Banner</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange("banner", e)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                                    />
                                    {bannerFile && (
                                        <button
                                            onClick={() => handleUpload("banner")}
                                            disabled={uploadingBanner}
                                            className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 disabled:opacity-70 transition"
                                        >
                                            <FontAwesomeIcon icon={faUpload}/>
                                            {uploadingBanner ? "Uploading Banner..." : "Upload New Banner"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-500 text-center">
                                Changes take effect immediately across the site.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}