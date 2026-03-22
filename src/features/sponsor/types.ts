import type { JSX } from "react"

export const SPONSOR_TIERS = [
  {
    name: "osp",
    title: "Open Source Program",
  },
  {
    name: "platinum",
    title: "Platinum Sponsors",
  },
  {
    name: "gold",
    title: "Gold Sponsors",
  },
  {
    name: "silver",
    title: "Silver Sponsors",
  },
  {
    name: "spark_supporter",
    title: "Spark Supporters",
  },
] as const

export type SponsorTier = (typeof SPONSOR_TIERS)[number]["name"]

export type Sponsor = {
  name: string
  url: string
  logo: (props: React.ComponentProps<"svg">) => JSX.Element
  tier: SponsorTier
}
