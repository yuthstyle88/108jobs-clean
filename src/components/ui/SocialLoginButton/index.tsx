"use client";
import Image, {StaticImageData} from "next/image";

export const SocialLoginButton = ({
  icon,
  provider,
  className,
  onClick,
}: {
  icon: StaticImageData;
  provider?: string;
  className?: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg shadow-md hover:bg-gray-100 flex justify-center items-center transition duration-300"
  >
    <Image
      alt="iconSignIn"
      src={icon}
      width={16}
      height={16}
      className={`mr-3 ${className}`}
    />
    {provider}
  </button>
);
