import {create} from "zustand";
import {ProfileData} from "lemmy-js-client";

type UserStore = {
  user: ProfileData | null;
  online: boolean;
  setUser: (user: ProfileData) => void;
  updateUser: (updatedData: Partial<ProfileData>) => void;
  clearUser: () => void;
  setOnline: (status: boolean) => void;
  getOnline: () => boolean;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  online: false,

  setUser: (user) => set({ user }),

  updateUser: (updatedData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedData } : null,
    })),

  clearUser: () => set({ user: null }),
  setOnline: (status) => set({ online: status }),
  getOnline: () => get().online,
}));
