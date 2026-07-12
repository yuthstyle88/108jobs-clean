import {useState} from "react";

export const useImagePreviewOnly = (initialImageUrl?: string | null) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl ?? null);
  const [prevInitialImageUrl, setPrevInitialImageUrl] = useState(initialImageUrl);

  if (initialImageUrl !== prevInitialImageUrl) {
    setPrevInitialImageUrl(initialImageUrl);
    if (initialImageUrl) {
      setPreviewUrl(initialImageUrl);
    }
  }

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
