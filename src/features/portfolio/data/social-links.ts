import type { SocialProfile } from "@/features/portfolio/types/social-links"

/**
 * Keyed registry of social profiles — the single source of truth. Icons are
 * bound separately in `social-link-icons.tsx` (keyed by the same `SocialName`),
 * so adding a profile here forces the icon map to stay in sync at compile time.
 */
export const SOCIAL = {
  x: {
    title: "X",
    handle: "@iamncdai",
    href: "https://x.com/iamncdai",
    sameAs: true,
  },
  github: {
    title: "GitHub",
    handle: "ncdai",
    href: "https://github.com/ncdai",
    sameAs: true,
  },
  linkedin: {
    title: "LinkedIn",
    handle: "ncdai",
    href: "https://linkedin.com/in/ncdai",
    sameAs: true,
  },
  // dailydotdev: {
  //   title: "daily.dev",
  //   handle: "@ncdai",
  //   href: "https://app.daily.dev/ncdai",
  //   sameAs: true,
  // },
  discord: {
    title: "Discord",
    handle: "ncdai",
    href: "https://discord.com/users/1186630645443739651",
  },
  youtube: {
    title: "YouTube",
    handle: "@ncdai",
    href: "https://www.youtube.com/@ncdai",
    sameAs: true,
  },
} satisfies Record<string, SocialProfile>

export type SocialName = keyof typeof SOCIAL

export type SocialLink = SocialProfile & { name: SocialName }

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }))
