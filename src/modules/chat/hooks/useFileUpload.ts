'use client';

import { useCallback, useState } from 'react';
import { REQUEST_STATE } from '@/services/HttpService';
import { useHttpPost } from '@/hooks/useHttpPost';

export type UploadedFile = { fileUrl: string; fileType: string; fileName: string } | null;

// Define interface for opts to satisfy Next.js serialization requirements
interface UseFileUploadProps {
    setError: (msg: string | null) => void;
    t: (k: string) => string | undefined;
}

export const useFileUpload = (opts: UseFileUploadProps) => {
    const { setError, t } = opts;
    const [selectedFile, setSelectedFile] = useState<UploadedFile>(null);
    const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);

    const { execute: uploadFile } = useHttpPost('uploadFile');
    const { execute: deleteFile } = useHttpPost('deleteFile');

    const handleFileUpload = useCallback(
        async (e: Event) => {
            try {
                const input = e.target as HTMLInputElement | null;
                const file = (input?.files && input.files[0]) || (e as any).dataTransfer?.files?.[0];
                if (!file) {
                    setError(t('upload.noFile') || 'No file selected');
                    return null;
                }

                const maxSizeMb = 25;
                if (file.size > maxSizeMb * 1024 * 1024) {
                    setError((t as any)('upload.fileTooLarge', { maxSize: maxSizeMb }) || `File too large. Max ${maxSizeMb}MB`);
                    return null;
                }
                const fileType = file.type || 'application/octet-stream';

                setError(null);

                // Pass file as UploadImage interface
                const res = await uploadFile({ image: file });
                if (res.state !== REQUEST_STATE.SUCCESS) {
                    const msg = t('upload.error') || 'Failed to upload file';
                    setError(msg);
                    return null;
                }

                const data: any = res.data;
                const uploaded: UploadedFile = {
                    fileUrl: String(data?.url || ''),
                    fileType,
                    fileName: String(data?.filename || file.name || 'file'),
                };

                if (!uploaded.fileUrl) {
                    setError(t('upload.error') || 'Failed to upload file');
                    return null;
                }

                setSelectedFile(uploaded);
                if (input) input.value = '';
                return uploaded;
            } catch (err) {
                setError(t('upload.error') || 'Failed to upload file. Please try again later');
                console.error('File upload error:', err); // Debug
                return null;
            }
        },
        [setError, t, uploadFile],
    );

    const handleRemoveSelectedFile = useCallback(
        async () => {
            if (!selectedFile || isDeletingFile) return;

            try {
                setIsDeletingFile(true);
                setError(null);

                // Pass fileName directly as a string
                const res = await deleteFile(selectedFile.fileName);
                if (res.state !== REQUEST_STATE.SUCCESS) {
                    const msg = t('upload.deleteError') || 'Failed to delete file';
                    setError(msg);
                    return;
                }

                setSelectedFile(null);
                console.log('File deleted successfully:', { fileName: selectedFile.fileName }); // Debug
            } catch (err) {
                setError(t('upload.deleteError') || 'Failed to delete file');
                console.error('File delete error:', err); // Debug
            } finally {
                setIsDeletingFile(false);
            }
        },
        [isDeletingFile, selectedFile, setError, t, deleteFile],
    );

    return {
        selectedFile,
        setSelectedFile,
        isDeletingFile,
        handleFileUpload,
        handleRemoveSelectedFile,
    } as const;
};