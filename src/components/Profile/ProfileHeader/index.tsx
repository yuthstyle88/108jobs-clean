import Image from "next/image";
import { AssetIcon } from "@/constants/icons";
import React from "react";

const ProfileHeader: React.FC<object> = () => {
    return (
        <div className="relative bg-gradient-to-r from-primary to-indigo-600 h-48 sm:h-64 overflow-hidden">
            <div className="absolute inset-0 bg-opacity-50 bg-black flex items-center justify-center">
                <Image
                    src={AssetIcon.logoIcon}
                    alt="logoIcon"
                    className="opacity-20 object-contain"
                    width={200}
                    height={200}
                />
            </div>
        </div>
    );
};

export default ProfileHeader;