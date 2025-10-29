"use client";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import {useClickOutside} from "@/hooks/ui/useClickOutside";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";

interface NotificationDropdownProps {
  className?: string;
}

const NotificationDropdown = ({
  className = "",
}: NotificationDropdownProps) => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const global = getNamespace(LanguageFile.GLOBAL);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div
        onClick={toggleDropdown}
        className="text-white text-sm hover:text-white pr-3 cursor-pointer"
      >
        <FontAwesomeIcon
          icon={faBell}
          className="w-[21px] h-[24px] text-white"
          size="4x"
        />
      </div>

      <div
        className={`absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200 transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-3 px-4 border-b border-gray-200">
          <h3 className="text-gray-800 font-medium">{global?.labelNotification}</h3>
        </div>
        <div className="py-2">
          {/* You can map through notifications here */}
          <div className="py-8 flex flex-col items-center justify-center text-gray-500">
            <p className="text-sm">{global?.labelEmptyNotification}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
