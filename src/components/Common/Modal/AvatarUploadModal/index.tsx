"use client";
import {Image, Upload} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import ImageEditor from "../../../AvatarEditor";
import Modal from "../../../ui/Modal";
import {uploadSelectedImage} from "@/utils/helpers";
import Loading from "@/components/Common/Loading/Loading"; // นำเข้า helper ฟังก์ชัน upload
import {useTranslation} from "react-i18next";

interface ImageUploadModalProps {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    onImageUpload: (imageUrl: string) => void; // Callback เมื่ออัปโหลดสำเร็จ
    uploadImage: (payload: { image: File }) => Promise<any>; // ฟังก์ชัน API upload
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
                                                               isOpen,
                                                               title,
                                                               onClose,
                                                               onImageUpload,
                                                               uploadImage,
                                                           }) => {
    const {t} = useTranslation();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับ loading
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load image from localStorage if available when modal opens
    useEffect(() => {
            if (isOpen) {
                const tempImageData = localStorage.getItem("tempImageData");
                if (tempImageData) {
                    setSelectedImage(tempImageData);
                    localStorage.removeItem("tempImageData"); // Clear after loading
                }
            } else {
                // Reset selected image when modal closes
                setSelectedImage(null);
                setLoading(false); // Reset loading ด้วย
            }
        },
        [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
            // Reset input value after reading
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleSelectFile = () => {
        fileInputRef.current?.click();
    };

    const handleChangeImage = () => {
        localStorage.setItem("changingImage",
            "true");
        onClose();
        setTimeout(() => {
                const uploadBtn = document.getElementById("uploadProfileImageBtn");
                if (uploadBtn) {
                    uploadBtn.click();
                }
            },
            300);
    };

    const handleSaveImage = async (canvas: HTMLCanvasElement) => {
        setLoading(true); // เปิด Loading ระหว่างอัปโหลด
        try {
            const imageUrl = await uploadSelectedImage(
                canvas.toDataURL("image/png"), // ส่งข้อมูลภาพ Base64
                uploadImage // ฟังก์ชัน API
            );
            onImageUpload(imageUrl); // Callback ให้ Component แม่ทราบผลลัพธ์
            onClose();
        } catch (error) {
            console.error("Image upload failed:",
                error);
        } finally {
            setLoading(false); // ปิด Loading ไม่ว่าจะแสดงผลสำเร็จหรือ error ก็ตาม
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title || t("uploadInstruction.title")}
            className="max-w-md w-full"
        >
            <div className="space-y-4">
                {!selectedImage ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <div className="bg-gray-100 rounded-full p-4">
                            <Image className="h-12 w-12 text-gray-400" aria-label="User profile icon"/>
                        </div>
                        <p className="text-gray-600 text-center">
                            {t("uploadInstruction.uploadInstruction")}
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={handleSelectFile}
                            className="flex items-center space-x-2 bg-third hover:bg-[#063a68]"
                        >
                            <Upload className="h-4 w-4"/>
                            <span>{t("uploadInstruction.selectImage")}</span>
                        </button>
                    </div>
                ) : (
                    <div>
                        <ImageEditor
                            imageSrc={selectedImage}
                            onSave={handleSaveImage}
                            onChangeImage={handleChangeImage}
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                )}
            </div>

            {/* แสดงสถานะ Loading */}
            {loading && (
                <Loading/>
            )}
        </Modal>
    );
};

export default ImageUploadModal;