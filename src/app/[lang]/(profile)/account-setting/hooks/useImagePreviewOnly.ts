import {useEffect, useState} from "react";

export const useImagePreviewOnly = (initialImageUrl?: string | null) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
      if (initialImageUrl) {
        setPreviewUrl(initialImageUrl);
      }
    },
    [initialImageUrl]);

  const handleSelectImage = (file: File) => {
    setFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  return {
    file,
    previewUrl,
    handleSelectImage,
    setFile,
    setPreviewUrl,
  };
};
