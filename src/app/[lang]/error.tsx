"use client";

import {LandingImage} from "@/constants/images";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import Image from "next/image";

interface ErrorProps {
  message?: string;
}

export default function Error({message}: ErrorProps) {
  const errorLanguageData = getNamespace(LanguageFile.ERROR);
  const isError = !!message;

  return (
    <div className="min-h-screen w-full h-full flex items-center justify-center bg-secondary">
      <Image
        src={LandingImage.bgError}
        alt="error"
        fill
        className="object-cover md:block hidden"
      />
      <Image
        src={LandingImage.errorMobile}
        alt="error"
        fill
        className="object-cover"
      />
      <div className="flex flex-col items-center gap-16 mx-2">
        <Image
          src={LandingImage.error}
          alt="error"
          className="w-[80%] h-[280px] sm:w-full"
        />
        {isError ?
          <p className="text-center text-[20px] md:text-[32px] text-text-primary font-sans">
            {message || "Something not work. Please try latter"}
          </p>
          :
          <p className="text-center text-[20px] md:text-[32px] text-text-primary font-sans">
            {errorLanguageData?.title}
          </p>
        }

      </div>
    </div>
  );
}
