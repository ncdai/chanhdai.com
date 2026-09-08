import type { SocialProfile } from "@/features/portfolio/types/social-links"

/**
 * Keyed registry of social profiles — the single source of truth. Icons are
 * bound separately in `social-link-icons.tsx` (keyed by the same `SocialName`),
 * so adding a profile here forces the icon map to stay in sync at compile time.
 */
export const SOCIAL = {
  github: {
    title: "GitHub",
    handle: "deepanshuyadav22",
    href: "https://github.com/deepanshuyadav22",
    sameAs: true,
  },
  linkedin: {
    title: "LinkedIn",
    handle: "deepanshuyadav22",
    href: "https://linkedin.com/in/deepanshuyadav22",
    sameAs: true,
  },
  x: {
    title: "X",
    handle: "@deepanshuy22",
    href: "https://x.com/deepanshuy22",
    sameAs: true,
  },
  youtube: {
    title: "YouTube",
    handle: "@deepanshuy22",
    href: "https://www.youtube.com/@deepanshuy22",
    sameAs: true,
  },
} satisfies Record<string, SocialProfile>

export type SocialName = keyof typeof SOCIAL

export type SocialLink = SocialProfile & { name: SocialName }

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }))
