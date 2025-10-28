import {useTranslation as useI18NextTranslation} from "react-i18next";
import {useEffect} from "react";
import {useLanguage} from "@/contexts/LanguageContext";

export const useTranslation = () => {
  const {t, i18n} = useI18NextTranslation(); // ใช้ Hook ของ i18next
  const {lang} = useLanguage(); // ดึงภาษาจาก Context ของแอปพลิเคชัน

  // ซิงค์ภาษาใน i18next กับ Context
  useEffect(() => {
    if (i18n && typeof i18n.changeLanguage === "function" && i18n.language !== lang) {
      i18n.changeLanguage(lang); // เปลี่ยนภาษาของ i18next ให้ตรงกับ Context
    }
  }, [lang, i18n]);

  const tWrapped: typeof t = ((key: any, options?: any) => {
      return (t as any)(key, options);
  }) as any;

  return {t: tWrapped, i18n}; // คืนค่า `t` และอินสแตนซ์ของ i18next
};