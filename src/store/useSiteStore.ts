import { create } from "zustand";
import type { GetSiteResponse, PublicOAuthProvider } from "lemmy-js-client";

export type SiteStore = {
  siteRes: GetSiteResponse | null;
  oauthProviders: PublicOAuthProvider[];
  setSiteRes: (site: GetSiteResponse | null) => void;
  clear: () => void;
};

export const useSiteStore = create<SiteStore>((set) => ({
  siteRes: null,
  oauthProviders: [],
// Accept multiple wire shapes without breaking typing (GetSiteResponse doesn't define `data`)
setSiteRes: (site) => set(() => {
  const anySite = site as unknown as Record<string, any> | null;
  const providers: PublicOAuthProvider[] =
    anySite?.oauthProviders ??
    anySite?.oauth_providers ??
    anySite?.data?.oauthProviders ??
    anySite?.data?.oauth_providers ??
    [];
  return {
    siteRes: site,
    oauthProviders: providers,
  };
}),
  clear: () => set({ siteRes: null, oauthProviders: [] }),
}));
