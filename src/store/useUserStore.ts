import { create } from "zustand";
import {LocalUser, Person} from "lemmy-js-client";

type UserStore = {
  user: LocalUser | null;
  person: Person | null;
  online: boolean;
  setUser: (user: LocalUser | null) => void;
  setPerson: (person: Person | null) => void;
  updateUser: (updatedData: Partial<LocalUser>) => void;
  updatePerson: (updatedData: Partial<Person>) => void;
  clearUser: () => void;
  clearPerson: () => void;
  resetStore: () => void;
  setOnline: (status: boolean) => void;
  getOnline: () => boolean;
};

export const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    person: null,
    online: false,
    setUser: (user) => set({ user }),
    setPerson: (person) => set({ person }),
    updateUser: (updatedData) =>
      set((state) => ({ user: state.user ? { ...state.user, ...updatedData } : null })),
    updatePerson: (updatedData) =>
      set((state) => ({ person: state.person ? { ...state.person, ...updatedData } : null })),
    clearUser: () => set({ user: null }),
    clearPerson: () => set({ person: null }),
    resetStore: () => set({ user: null, person: null, online: false }),
    setOnline: (status) => set({ online: status }),
    getOnline: () => get().online,
}));