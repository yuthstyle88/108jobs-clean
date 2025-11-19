import en from "@/assets/icons/en.svg";
import th from "@/assets/icons/th.svg";
import vn from "@/assets/icons/vn.svg";

export enum LanguageFile {
    AUTHEN = "authen",
    ERROR = "error",
}


export const LANGUAGES = {
    th: {code: "th", label: "Thailand", flag: th, numericCode: 66},
    en: {code: "en", label: "English", flag: en, numericCode: 1},
    vi: {code: "vi", label: "Vietnam", flag: vn, numericCode: 84},
};

export function toLanguageArray() {
    return Object.values(LANGUAGES);
}


export const VALID_LANGUAGES = ["th", "vi", "en"];
export const LANGUAGE_COOKIE = "current-language";