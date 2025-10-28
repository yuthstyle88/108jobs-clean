"use client";
import {useLanguage} from "@/contexts/LanguageContext";
import {useClickOutside} from "@/hooks/useClickOutside";
import Image from "next/image";
import {useState} from "react";

import {LANGUAGES} from "@/constants/language";

interface LanguageDropdownProps {
  className?: string;
}

const LanguageDropdown = ({className = ""}: LanguageDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const {setLang, lang: currentLang} = useLanguage();

  const handleSelectLang = (lang: string) => {
    if (lang !== currentLang) {
      setLang(lang);
    }
    setIsOpen(false);
  };


  const currentLangData = LANGUAGES[currentLang as keyof typeof LANGUAGES];

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="text-white text-sm hover:text-white cursor-pointer flex items-center gap-2"
      >
        {currentLangData && (
          <Image
            src={currentLangData.flag}
            alt={currentLangData.label}
            width={30}
            height={30}
            style={{height: "auto"}}
          />
        )}
      </div>

      <div
        className={`absolute right-0 mt-3 w-44 bg-white rounded-md shadow-lg z-50 border border-gray-200 transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {Object.values(LANGUAGES).map((lang) => {
          const isSelected = lang.code === currentLang;
          return (
            <div
              key={lang.code}
              onClick={() => handleSelectLang(lang.code)}
              className="flex items-center gap-4 px-4 py-2 hover:bg-secondary cursor-pointer"
            >
              <div
                className={`rounded-full p-[2px] ${
                  isSelected ? "ring-2 ring-blue-800" : ""
                }`}
              >
                <Image src={lang.flag} alt={lang.label} width={26} height={26} style={{height: "auto"}}/>
              </div>
              <span className="text-text-primary text-sm">{lang.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageDropdown;
