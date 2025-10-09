import { USER } from "@/features/profile/data/user";
import type { NavItem } from "@/types/nav";

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.APP_URL || "https://ricoamantino.com",
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
    title: "Blog",
    href: "/blog",
  },
];

export const GITHUB_USERNAME = "fredamantino";
export const SOURCE_CODE_GITHUB_REPO = "fredamantino/portfolio";
export const SOURCE_CODE_GITHUB_URL =
  "https://github.com/fredamantino/portfolio";

export const UTM_PARAMS = {
  utm_source: "ricoamantino.com",
  utm_medium: "portfolio_website",
  utm_campaign: "referral",
};
