"use client";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import {CreditCard, FileText, Mail, User} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";
import {useLanguage} from "@/contexts/LanguageContext";


const SideBarSellerAccountSetting = () => {
  const pathname = usePathname();
  const {lang} = useLanguage();
  const sellerSidebarLanguage = getNamespace(LanguageFile.GLOBAL);

  const menuItems = [
    {
      href: "/seller-account-setting/freelance-profile",
      label: sellerSidebarLanguage?.freelancerAccountInfo,
      icon: User,
    },
    {
      href: "/seller-account-setting/contact-info",
      label: sellerSidebarLanguage?.contactInfo,
      icon: Mail,
    },
    {
      href: "/seller-account-setting/personal-info",
      label: sellerSidebarLanguage?.idInfo,
      icon: FileText,
    },
    {
      href: "/seller-account-setting/commitment-letter",
      label: sellerSidebarLanguage?.taxInfo,
      icon: FileText,
    },
    {
      href: "/seller-account-setting/bank-account",
      label: sellerSidebarLanguage?.bankInfo,
      icon: CreditCard,
    },
  ];


  return (
    <div className="md:col-span-1">
      <div className="bg-white rounded-md shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-800">
            {sellerSidebarLanguage?.freelancerAccountSection}
          </h3>
        </div>
        <nav>
          <ul>
            {menuItems.map(({href, label, icon: Icon}) => {
              const isActive = pathname === `/${lang}${href}`;
              return (
                <li key={href}>
                  <Link prefetch={false}
                        href={href}
                        className={`flex items-center w-full px-4 py-3 text-left ${
                          isActive
                            ? "bg-blue-50 border-l-4 border-blue-500 text-primary"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-primary" : "text-gray-500"}`}/>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-800 mb-2">
            {sellerSidebarLanguage?.jobVailable}
          </h3>
          <ul>
            <li>
              <Link prefetch={false}
                    href="/seller-account-setting/document-info"
                    className={`flex items-center gap-3 w-full text-left ${
                      pathname === "/seller-account-setting/document-info"
                        ? "bg-blue-50 border-l-4 border-blue-500 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
              >
                <FileText className="min-w-5 w-5 h-5 text-gray-500"/>
                {sellerSidebarLanguage?.availableSetting}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBarSellerAccountSetting;
