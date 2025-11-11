"use client";
import {Home} from "lucide-react";
import Link from "next/link";
import {useTranslation} from "react-i18next";
import Image from "next/image";
import {AssetsImage} from "@/constants/images";

export default function NotFound() {
    const {t} = useTranslation();
    return (
        <div className="min-h-screen flex flex-col bg-[#042b4a] text-white">
            {/* Main Section */}
            <main className="flex-grow flex items-center justify-center py-12 px-4 bg-[#ffffff]">
                <div className="text-center max-w-2xl">
                    <div className="relative mb-8">
                        <div className="flex gap-2 items-center">
                            <Image
                                src={AssetsImage.notFound}
                                alt="Not Found"
                            />
                        </div>
                        <div className="absolute inset-0 bg-purple-600 opacity-20 rounded-full blur-3xl"></div>
                    </div>
                    <h1 className="text-5xl font-bold mb-4 tracking-tight font-['Inter',sans-serif]">
                        {t("notFound.errorTitle", "Lost in the Cosmos?")}
                    </h1>
                    <p className="text-lg text-gray-800 mb-8 font-['Inter',sans-serif]">
                        {t("notFound.errorDescription", "The page you're looking for has drifted into the void. Let's get you back to orbit!")}
                    </p>
                    <Link
                        prefetch={false}
                        href="/"
                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-full font-medium transition-all hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                    >
                        <Home className="w-5 h-5"/>
                        {t("notFound.backButton", "Return to Home")}
                    </Link>
                </div>
            </main>
            {/* Inline styles for animation */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}