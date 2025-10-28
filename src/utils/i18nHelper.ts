import {I18NextService} from "@/services/I18NextService";
import {LanguageFile} from "@/constants/language";

/**
 * Helper function to get translations using I18NextService with namespace support
 * @param namespace The translation namespace from LanguageFile enum
 * @param key The translation key
 * @param options Optional parameters for the translation
 * @returns The translated string
 */
export const t = (namespace: LanguageFile, key: string, options?: Record<string, unknown>): string => {
  const result = I18NextService.i18n.t(`${namespace}.${key}`,
    options);

  // ป้องกันข้อผิดพลาด ด้วยการแปลงค่าผลลัพธ์ให้เป็น string
  return typeof result === 'string' ? result : String(result);
};
/**
 * Helper function to get a namespace object that can be used similar to the old useTranslateFile hook
 * This makes migration easier by allowing a similar syntax:
 * const authen = useTranslateFile(LanguageFile.AUTHEN) -> const authen = getNamespace(LanguageFile.AUTHEN)
 *
 * @param namespace The translation namespace from LanguageFile enum
 * @param options Optional parameters for the translation (for interpolation, formatting, etc.)
 * @returns A proxy object that returns translations for the given namespace
 * 
 * @example
 * // Get translations for the authentication namespace
 * const authen = getNamespace(LanguageFile.AUTHEN);
 * // Use translations
 * console.log(authen.login); // "Login"
 * 
 * @remarks
 * This function checks if the namespace exists in the translations and logs a warning if it doesn't.
 * It also handles errors gracefully and returns a fallback string if a translation is missing.
 */
export const getNamespace = (
  namespace: LanguageFile,
  options?: Record<string, unknown>
): Record<string, string> => {
  if (!namespace) {
    console.error("getNamespace called with undefined or null namespace");
    return {};
  }

  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (typeof prop !== "string") return undefined;
        const key = `${namespace}.${prop}`;
        try {
          const result = I18NextService.i18n.t(key, { defaultValue: key, ...options });
          if (result === key) {
            console.warn(`Missing translation for key '${key}'`);
          }
          return typeof result === "string" ? result : String(result);
        } catch (error) {
          console.error(`Translation error for key '${key}':`, error);
          return `[${prop}]`;
        }
      },
    }
  );
};