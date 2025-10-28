import {IsoData, RouteData, ThemeColor,} from "@/utils/types";
import {isBrowser} from "@/utils/browser";
import Toastify from "toastify-js";

export function isAuthPath(pathname: string) {
  return /^\/(create_.*?|inbox|settings|admin|reports|registration-applications|activitypub.*?)\b/g.test(
    pathname,
  );
}
// TODO get rid of this
export function setIsoData<T extends RouteData>(context: any): IsoData<T> {
  // If its the browser, you need to deserialize the data from the window
  if (isBrowser()) {
    return window.isoData as IsoData<T>;
  } else return context.router.staticContext as IsoData<T>;
}
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
