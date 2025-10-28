'use client';

import React from 'react';
import {createPortal} from 'react-dom';
import {useTranslation} from 'react-i18next';
import {UploadedFile} from "@/modules/chat/hooks/useFileUpload";
import {Paperclip, Trash2} from "lucide-react";

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void | Promise<void>;
    selectedFile: UploadedFile | null;
    onFileUpload?: (e: Event) => void;
    isDeletingFile: boolean
    onFileRemove?: () => Promise<void>
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onSubmit,
                                                             selectedFile,
                                                             onFileUpload,
                                                             isDeletingFile,
                                                             onFileRemove
                                                         }) => {
    const {t} = useTranslation();
    const handleSubmit = () => {
        onSubmit();
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center text-primary bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
                tabIndex={-1}
            >
                <h3 className="text-lg font-medium mb-4">
                    {t('profileChat.submitDeliveryTitle') || 'Submit Delivery'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    {t('profileChat.submitDeliveryMessage') || 'Attach your work file and submit for employer review.'}
                </p>
                <div className="mb-4 flex items-center gap-3">
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        onChange={(e) => onFileUpload?.(e as unknown as Event)}
                    />
                    <label
                        htmlFor="fileInput"
                        className="flex items-center gap-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                        aria-label="Attach file"
                    >
                        <Paperclip size={20} />
                        <span className="text-sm font-medium">{t('profileChat.attachFileHere')}</span>
                    </label>
                    {selectedFile && (
                        <div className="flex items-center gap-2 min-w-0">
                            <p
                                className="text-sm font-medium text-blue-900 truncate"
                                title={selectedFile.fileName}
                            >
                                {selectedFile.fileName}
                            </p>
                            <button
                                type="button"
                                onClick={onFileRemove}
                                disabled={isDeletingFile}
                                className={`text-xs ${isDeletingFile ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-800'}`}
                                aria-label="Remove attached file"
                                aria-busy={isDeletingFile}
                            >
                                <Trash2 className={`h-4 w-4 ${isDeletingFile ? 'animate-spin' : ''}`} aria-hidden="true" />
                            </button>
                        </div>

                    )}

                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        {t('global.cancel') || 'Cancel'}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-[#063a68] focus:ring-2 focus:ring-primary/50 disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={!selectedFile}
                    >
                        {t('profileChat.submitDelivery') || 'Submit Delivery'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default FileUploadModal;