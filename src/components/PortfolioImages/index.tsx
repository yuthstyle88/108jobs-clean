'use client';

import Image from 'next/image';
import {useTranslation} from 'react-i18next';
import {ChevronLeft, ChevronRight, Edit, Trash} from 'lucide-react';
import PortfolioImageModal from '@/components/Common/Modal/PortfolioImageModal';
import {usePortfolioImagesForm} from '@/hooks/forms/usePortfolioImagesForm';
import {useState} from 'react';
import FullScreenImageModal from "@/components/Common/Modal/FullScreenImageModal";
import {useUserStore} from "@/store/useUserStore";

export default function PortfolioImages() {
    const {t} = useTranslation();
    const {person, setPerson} = useUserStore();
    const {
        fields,
        remove,
        edit,
        newImage,
        setNewImage,
        editingImage,
        setEditingImage,
        selectedPortfolioImage,
        setSelectedPortfolioImage,
        isPortfolioImageModalOpen,
        handleSelectPortfolioFile,
        handlePortfolioFileChange,
        closePortfolioImageModal,
        portfolioFileInputRef,
        currentImageIndex,
        handleNextImage,
        handlePrevImage,
        imagesPerPage,
        uploadError,
        confirmAddImage,
        confirmUpdateImage,
        isSubmitting,
    } = usePortfolioImagesForm({person: person ?? undefined, imagesPerPage: 3, setPerson});

    // State for full-screen image modal
    const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);
    const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(null);

    // Handler for clicking an image to show full-screen
    const onImageClick = (imageUrl: string) => {
        setFullScreenImageUrl(imageUrl);
        setIsFullScreenModalOpen(true);
    };

    return (
        <div className="border border-border-primary rounded-lg bg-white py-6 mb-8">
            <div className="border-b border-border-primary px-6">
                <h2 className="text-[16px] font-medium mb-2 text-text-primary">
                    {t('profileInfo.sectionPortfolioImages')}
                </h2>
                <p className="text-gray-600 mb-6 text-[14px] font-sans">
                    {t('profileInfo.subtitlePortfolioImages')}
                </p>
            </div>

            <div className="px-6">
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        {editingImage ? t('profileInfo.editImage') : t('profileInfo.addImage')}
                    </h3>
                    <div className="relative flex items-start space-x-4">
                        <div className="flex-1 max-w-md">
                            <div
                                className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-between px-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <input
                                    type="file"
                                    ref={portfolioFileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePortfolioFileChange}
                                    disabled={isSubmitting}
                                />
                                <span className="text-gray-500 text-sm truncate">
                                    {selectedPortfolioImage
                                        ? t('profileInfo.imageSelected')
                                        : t('profileInfo.selectImage')}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleSelectPortfolioFile}
                                    className="flex items-center justify-center bg-primary rounded-full p-2 hover:bg-[#063a68] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    <svg
                                        className="w-4 h-4 text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                                    </svg>
                                </button>
                            </div>
                            {uploadError && <p className="text-red-600 text-sm mt-2">{uploadError}</p>}
                        </div>
                    </div>
                    {editingImage && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingImage(null);
                                setNewImage({title: ''});
                                setSelectedPortfolioImage(null);
                            }}
                            className="mt-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            disabled={isSubmitting}
                        >
                            {t('profileInfo.cancel')}
                        </button>
                    )}
                </div>
                <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fields.slice(currentImageIndex, currentImageIndex + imagesPerPage).map((item) => (
                            <div
                                key={item.id}
                                className="h-48 rounded-lg flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
                                onClick={() => onImageClick(item.imageUrl)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && onImageClick(item.imageUrl)}
                                aria-label={`View ${item.title} in full screen`}
                            >
                                {item.imageUrl ? (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title ?? ''}
                                        width={300}
                                        height={200}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        loading="lazy"
                                        className="w-full h-36 object-cover rounded-t-lg"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-36 bg-gray-100 flex items-center justify-center rounded-t-lg">
                                        <span className="text-gray-500 text-sm">
                                            {t('portfolioImages.noImage') || 'No image available'}
                                        </span>
                                    </div>
                                )}
                                <div className="p-2 text-center w-full">
                                    <p className="text-gray-700 text-sm font-medium">{item.title}</p>
                                    <div className="flex justify-center gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                edit(item);
                                            }}
                                            className="p-1 text-primary hover:text-blue-800"
                                            disabled={isSubmitting}
                                        >
                                            <Edit className="w-5 h-5"/>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                remove(item.id);
                                            }}
                                            className="p-1 text-red-600 hover:text-red-800"
                                            disabled={isSubmitting}
                                        >
                                            <Trash className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {fields.length > imagesPerPage && (
                        <>
                            <button
                                type="button"
                                onClick={handlePrevImage}
                                disabled={currentImageIndex === 0 || isSubmitting}
                                className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-white backdrop-blur-sm transition-all duration-200 ${
                                    currentImageIndex === 0 || isSubmitting
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:backdrop-blur-none hover:bg-[#063a68]'
                                }`}
                            >
                                <ChevronLeft className="w-6 h-6"/>
                            </button>
                            <button
                                type="button"
                                onClick={handleNextImage}
                                disabled={currentImageIndex + imagesPerPage >= fields.length || isSubmitting}
                                className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-white backdrop-blur-sm transition-all duration-200 ${
                                    currentImageIndex + imagesPerPage >= fields.length || isSubmitting
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:backdrop-blur-none hover:bg-[#063a68]'
                                }`}
                            >
                                <ChevronRight className="w-6 h-6"/>
                            </button>
                        </>
                    )}
                </div>
            </div>
            <PortfolioImageModal
                title={editingImage ? t('profileInfo.editImage') : t('profileInfo.addImage')}
                isOpen={isPortfolioImageModalOpen}
                onClose={closePortfolioImageModal}
                onImageChange={handlePortfolioFileChange}
                onConfirm={editingImage ? confirmUpdateImage : confirmAddImage}
                initialImage={selectedPortfolioImage}
                error={uploadError}
                imageTitle={newImage.title}
                onTitleChange={(val) => setNewImage({title: val})}
            />
            <FullScreenImageModal
                isOpen={isFullScreenModalOpen}
                imageUrl={fullScreenImageUrl}
                onClose={() => {
                    setIsFullScreenModalOpen(false);
                    setFullScreenImageUrl(null);
                }}
            />
        </div>
    );
}