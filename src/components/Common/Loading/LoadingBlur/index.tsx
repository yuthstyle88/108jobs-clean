import React from "react";

type Props = {
    text: string;
};

const LoadingBlur = ({ text }: Props) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100/70 to-purple-100/70 backdrop-blur-md z-[9999] animate-fadeIn">
            <div className="flex flex-col items-center gap-4">
                <svg
                    width="120px"
                    height="100px"
                    viewBox="0 0 200 200"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-lg"
                >
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: "#042b4a", stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: "#1e90ff", stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    <g
                        id="Page-1"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                    >
                        <path
                            className="origin-center"
                            fill="url(#grad1)"
                            stroke="url(#grad1)"
                            strokeWidth="15"
                            d="m148 84.7 13.8-8-10-17.3-13.8 8a50 50 0 0 0-27.4-15.9v-16h-20v16A50 50 0 0 0 63 67.4l-13.8-8-10 17.3 13.8 8a50 50 0 0 0 0 31.7l-13.8 8 10 17.3 13.8-8a50 50 0 0 0 27.5 15.9v16h20v-16a50 50 0 0 0 27.4-15.9l13.8 8 10-17.3-13.8-8a50 50 0 0 0 0-31.7Zm-47.5 50.8a35 35 0 1 1 0-70 35 35 0 0 1 0 70Z"
                            fillRule="nonzero"
                        >
                            <animateTransform
                                type="rotate"
                                attributeName="transform"
                                calcMode="spline"
                                dur="1.5"
                                values="0;360"
                                keyTimes="0;1"
                                keySplines="0.4 0 0.2 1"
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="opacity"
                                values="0.6;1;0.6"
                                dur="1.5s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </g>
                </svg>
                <p className="text-2xl font-semibold font-sans text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
                    {text}
                </p>
            </div>
        </div>
    );
};

// Custom Tailwind CSS for animations
const styles = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
    }
`;

export default LoadingBlur;