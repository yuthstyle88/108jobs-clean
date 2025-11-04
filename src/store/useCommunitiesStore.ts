import { create } from "zustand";
import type { ListCommunitiesResponse } from "lemmy-js-client";

export type CommunitiesStore = {
  communities: ListCommunitiesResponse | null;
  setCommunities: (data: ListCommunitiesResponse | null) => void;
  clear: () => void;
};

export const useCommunitiesStore = create<CommunitiesStore>((set) => ({
  communities: null,
  setCommunities: (data) => set({ communities: data }),
  clear: () => set({ communities: null }),
}));
