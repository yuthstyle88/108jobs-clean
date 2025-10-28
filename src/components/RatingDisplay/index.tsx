"use client";
import React from "react";

interface StarsProps {
    rating: number; // rating between 0–5
    max?: number;   // optional number of stars (default 5)
    size?: string;  // optional Tailwind size class (e.g. "w-5 h-5")
}

export const Stars: React.FC<StarsProps> = ({ rating, max = 5, size = "w-4 h-4" }) => {
    return (
        <div className="flex items-center" aria-label={`Rating: ${rating} out of ${max}`}>
            {Array.from({ length: max }, (_, i) => {
                const index = i + 1;
                return (
                    <svg
                        key={index}
                        className={`${size} ${
                            index <= rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.39 2.467a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.538 1.118l-3.39-2.467a1 1 0 00-1.175 0l-3.39 2.467c-.783.57-1.838-.197-1.538-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.236 9.397c-.783-.57-.381-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                );
            })}
        </div>
    );
};
