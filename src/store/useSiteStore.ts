import { create } from "zustand";
import type { GetSiteResponse, PublicOAuthProvider, SiteView, PersonView, Tagline, OAuthProvider, LocalSiteUrlBlocklist, PluginMetadata } from "108jobs-client";

export type SiteStore = {
  siteRes: GetSiteResponse | null;
  siteView: SiteView | null;
  admins: PersonView[];
  version: string;
  tagline?: Tagline;
  oauthProviders: PublicOAuthProvider[];
  adminOauthProviders: OAuthProvider[];
  blockedUrls: LocalSiteUrlBlocklist[];
  imageUploadDisabled: boolean;
  activePlugins: PluginMetadata[];
  setSiteRes: (site: GetSiteResponse | null) => void;
  clear: () => void;
};

export const useSiteStore = create<SiteStore>((set) => ({
  siteRes: null,
  siteView: null,
  admins: [],
  version: "",
  tagline: undefined,
  oauthProviders: [],
  adminOauthProviders: [],
  blockedUrls: [],
  imageUploadDisabled: false,
  activePlugins: [],
  setSiteRes: (site) => set(() => ({
    siteRes: site,
    siteView: site?.siteView ?? null,
    admins: site?.admins ?? [],
    version: site?.version ?? "",
    tagline: site?.tagline,
    oauthProviders: site?.oauthProviders ?? [],
    adminOauthProviders: site?.adminOauthProviders ?? [],
    blockedUrls: site?.blockedUrls ?? [],
    imageUploadDisabled: site?.imageUploadDisabled ?? false,
    activePlugins: site?.activePlugins ?? [],
  })),
  clear: () => set({
    siteRes: null,
    siteView: null,
    admins: [],
    version: "",
    tagline: undefined,
    oauthProviders: [],
    adminOauthProviders: [],
    blockedUrls: [],
    imageUploadDisabled: false,
    activePlugins: [],
  }),
}));
