import { USER } from "@/features/profile/data/user";
import type { NavItem } from "@/types/nav";

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.APP_URL || "https://mohamedarkid.dev",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const MAIN_NAV: NavItem[] = [
  {
    title: "Portfolio",
    href: "/",
  },
  {
    title: "Writing",
    href: "/blog",
  },
  {
    title: "Playground",
    href: "/components",
  },
];

export const GITHUB_USERNAME = "mohamedarkid";
export const SOURCE_CODE_GITHUB_REPO = "mohamedarkid/portfolio";
export const SOURCE_CODE_GITHUB_URL =
  "https://github.com/mohamedarkid/portfolio";

export const UTM_PARAMS = {
  utm_source: "mohamedarkid.dev",
  utm_medium: "portfolio_website",
  utm_campaign: "referral",
};
