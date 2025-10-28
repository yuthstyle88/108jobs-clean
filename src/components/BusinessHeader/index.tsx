import {BusinessImage} from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import {LanguageFile} from "@/constants/language";
import {t} from "@/utils/i18nHelper";

const BusinessHeader = () => {

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm animate-fade-in">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link prefetch={false} href="/" className="flex items-center">
          <Image
            src={BusinessImage.logoBusiness}
            alt="Background"
            width={150}
            height={34}
            className="w-full h-full"
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link prefetch={false}
                href="/services"
                className="text-gray-700 hover:text-fastwork-blue transition-colors duration-300"
          >
            {t(LanguageFile.GLOBAL, "nav_services")}
          </Link>
          <Link prefetch={false}
                href="/work"
                className="text-gray-700 hover:text-fastwork-blue transition-colors duration-300"
          >
            {t(LanguageFile.GLOBAL, "nav_portfolio")}
          </Link>
          <Link prefetch={false}
                href="/about"
                className="text-gray-700 hover:text-fastwork-blue transition-colors duration-300"
          >
            {t(LanguageFile.GLOBAL, "nav_about")}
          </Link>
          <Link prefetch={false}
                href="/contact"
                className="bg-fastwork-blue text-white px-4 py-2 rounded-md hover:bg-fastwork-deep-blue transition-colors duration-300"
          >
            {t(LanguageFile.GLOBAL, "nav_contact")}
          </Link>
        </nav>

        <button className="md:hidden text-gray-700 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default BusinessHeader;
