'use client';

import Image from 'next/image';
import {useTranslation} from 'react-i18next';
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {X} from 'lucide-react';

interface PortfolioImageModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onImageChange: (e: ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => Promise<void>
    onConfirm: () => Promise<void>;
    initialImage: string | null;
    error: string | null;
    imageTitle: string;
    onTitleChange: (val: string) => void;
}

export default function PortfolioImageModal({
                                                title,
                                                isOpen,
                                                onClose,
                                                onImageChange,
                                                onConfirm,
                                                initialImage,
                                                error,
                                                imageTitle,
                                                onTitleChange,
                                            }: PortfolioImageModalProps) {
    const {t} = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(initialImage || null);

    // Handle file selection and preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            onImageChange(e);
        }
    };

    // Handle drag-and-drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setPreviewImage(null);
        onImageChange(e);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // Trigger file input click
    const handleSelectFile = () => {
        fileInputRef.current?.click();
    };

    // Handle modal close
    const handleClose = () => {
        setPreviewImage(initialImage || null);
        fileInputRef.current!.value = '';
        onClose();
    };


    useEffect(() => {
        setPreviewImage(initialImage || null);
    }, [initialImage]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                    aria-label={t('common.close') || 'Close'}
                >
                    <X className="w-6 h-6"/>
                </button>

                <h2 className="text-lg font-medium text-text-primary mb-4">{t(title) || title}</h2>

                <div
                    className="w-full h-48 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    onClick={handleSelectFile}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {previewImage ? (
                        <Image
                            src={previewImage}
                            alt={t('profileInfo.preview') || 'Image preview'}
                            width={192}
                            height={192}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <span className="text-gray-500 text-sm">
                            {t('profileInfo.selectImage') || 'Select or drag an image'}
                        </span>
                    )}
                </div>

                <input
                    type="text"
                    value={imageTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder={t('profileInfo.imageTitle') || 'Enter image title'}
                    className="w-full mt-4 border p-2 rounded text-primary"
                />

                {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={handleClose} className="px-4 py-2 text-gray-600 border rounded-lg">
                        {t('profileInfo.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!!error}
                        className={`px-4 py-2 rounded-lg text-white
                        ${error ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary'}`}
                    >
                        {title}
                    </button>
                </div>
            </div>
        </div>
    );
}