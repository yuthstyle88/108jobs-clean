'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';

interface FullScreenImageModalProps {
    isOpen: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

export default function FullScreenImageModal({ isOpen, imageUrl, onClose }: FullScreenImageModalProps) {
    const { t } = useTranslation();
    const [headerHeight, setHeaderHeight] = useState(80); // Fallback height

    useEffect(() => {
        const header = document.querySelector('header') || document.querySelector('nav');
        if (header) {
            setHeaderHeight(header.offsetHeight);
        }
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        },
        [onClose],
    );

    if (!isOpen || !imageUrl) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-75"
            role="dialog"
            aria-modal="true"
            aria-label={t('profileInfo.fullScreenModal') || 'Full screen image'}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div
                className="relative max-w-[90vw]"
                style={{ maxHeight: `calc(90vh - ${headerHeight}px)`, marginTop: `${headerHeight}px` }}
            >
                <Image
                    src={imageUrl}
                    alt={t('profileInfo.fullScreenImage') || 'Full screen image'}
                    width={1200}
                    height={800}
                    sizes="90vw"
                    className="object-contain max-w-full"
                    style={{ maxHeight: `calc(90vh - ${headerHeight}px)` }}
                />
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-600 transition-colors"
                    aria-label={t('common.close') || 'Close'}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}