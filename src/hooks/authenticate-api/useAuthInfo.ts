import {UserService} from "@/services";

export function useAuthInfo() {
  const auth = UserService.Instance;
  const isLoggedIn = auth.isLoggedIn;

  return {
    isLoggedIn,
    // In single-user mode, every logged-in user can act as both
    isEmployer: isLoggedIn,
    isFreelancer: isLoggedIn,
    lang: auth.getLanguage,
  };
}
