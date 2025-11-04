import {useUserStore} from "@/store/useUserStore";

export function useAuthInfo() {
  const userInfo = useUserStore((s) => s.userInfo);
  const isLoggedIn = !!userInfo;
  const lang = userInfo?.localUserView.localUser.interfaceLanguage;

  return {
    isLoggedIn,
    // In single-user mode, every logged-in user can act as both
    isEmployer: isLoggedIn,
    isFreelancer: isLoggedIn,
    lang
  };
}
