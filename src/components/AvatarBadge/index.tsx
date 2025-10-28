"use client";

import React from "react";
import Image from "next/image";

interface AvatarBadgeProps {
    name: string;
    avatarUrl?: string;
    online?: boolean;
    isActive?: boolean;
    size?: number;
}

const AvatarBadge: React.FC<AvatarBadgeProps> = ({
                                                     name,
                                                     avatarUrl,
                                                     online = false,
                                                     isActive = false,
                                                     size = 40,
                                                 }) => {
    const initials =
        name
            ?.split(" ")
            .map((w) => w.charAt(0))
            .slice(0, 2)
            .join("") || name.charAt(0) || "?";

    const avatarStyle = {
        background: isActive ? "#3B82F6" : "#9CA3AF",
        width: size,
        height: size,
    };

    // Calculate dot size and position based on avatar size
    const dotSize = Math.max(10, size * 0.2); // Dynamic dot size (20% of avatar size, min 10px)
    const borderWidth = Math.max(2, size * 0.03); // Dynamic border width
    const dotPosition = -dotSize * 0.2; // Position to overlap the edge

    return (
        <div
            className="relative flex-shrink-0"
            style={{ width: size, height: size }}
        >
            {/* Avatar circle */}
            <div
                className="rounded-full ring-2 ring-gray-100 shadow-sm overflow-hidden w-full h-full flex items-center justify-center text-white font-semibold select-none"
                style={avatarStyle}
            >
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt={name}
                        width={size}
                        height={size}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <span
                        style={{
                            fontSize: size > 40 ? "1rem" : "0.875rem",
                        }}
                    >
                        {initials.toUpperCase()}
                    </span>
                )}
            </div>

            {/* Enhanced Presence Indicator */}
            <span
                className={`absolute block rounded-full border-white ${
                    online ? "bg-green-500" : "bg-gray-300"
                } ${
                    online ? "shadow-lg shadow-green-500/30" : "shadow-md shadow-gray-400/20"
                }`}
                style={{
                    width: dotSize,
                    height: dotSize,
                    bottom: dotPosition,
                    right: dotPosition,
                    borderWidth: borderWidth,
                    boxShadow: online
                        ? `0 0 0 ${borderWidth}px white, 0 4px 8px rgba(34, 197, 94, 0.3)`
                        : `0 0 0 ${borderWidth}px white, 0 2px 4px rgba(156, 163, 175, 0.2)`,
                }}
                aria-label={online ? "Online" : "Offline"}
                title={online ? "Online" : "Offline"}
            />
        </div>
    );
};

export default AvatarBadge;