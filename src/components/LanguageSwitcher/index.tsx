import {LANGUAGES} from "@/constants/language";
import {useLanguage} from "@/contexts/LanguageContext";
import Image from "next/image";

const LanguageSwitcher = () => {
  const { setLang, lang: currentLang } = useLanguage();

  return (
    <>
      {Object.values(LANGUAGES).map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLang(lang.code)}
          aria-label={`Switch language to ${lang.label}${currentLang === lang.code ? " (current)" : ""}`}
          title={lang.label}
          className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
          aria-current={currentLang === lang.code ? "true" : undefined}
        >
          <Image
            src={lang.flag}
            alt={lang.label}
            width={24}
            height={16}
          />
        </button>
      ))}
    </>
  );
};

export default LanguageSwitcher;
