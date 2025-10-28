import {isBrowser} from "@/utils/browser";
import {ThemeColor} from "@/utils/types";
import Toastify from "toastify-js";


export function toast(text: string, background: ThemeColor = "success") {
  if (isBrowser()) {
    const backgroundColor = `var(--bs-${background})`;
    Toastify({
      text: text,
      backgroundColor: backgroundColor,
      gravity: "bottom",
      position: "left",
      duration: 5000,
    }).showToast();
  }
}
