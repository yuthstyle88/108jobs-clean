import {getIsoData} from "@/hooks/data/useIsoData";

export function useAuthInfo() {
  const auth = getIsoData();
  const isLoggedIn = !!auth?.myUserInfo;
  const lang = auth?.myUserInfo?.localUserView.localUser.interfaceLanguage;

  return {
    isLoggedIn,
    // In single-user mode, every logged-in user can act as both
    isEmployer: isLoggedIn,
    isFreelancer: isLoggedIn,
    lang
  };
}
