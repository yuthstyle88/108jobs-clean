import Image from "next/image";
import { X } from "lucide-react";
import React from "react";

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            role="dialog"
            aria-label="Enlarged portfolio image"
            tabIndex={-1}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
            <div className="relative max-w-4xl w-full">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
                    aria-label="Close enlarged image"
                >
                    <X className="w-6 h-6" />
                </button>
                <Image
                    src={imageUrl}
                    alt="Enlarged portfolio image"
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
            </div>
        </div>
    );
};

export default ImageModal;