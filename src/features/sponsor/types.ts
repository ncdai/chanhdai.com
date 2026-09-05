import type { JSX } from "react"

export const SPONSOR_TIERS = [
  {
    name: "osp",
    title: "Open Source Program",
    columns: 3,
  },
  {
    name: "platinum",
    title: "Platinum Sponsors",
    columns: 2,
  },
  {
    name: "gold",
    title: "Gold Sponsors",
    columns: 2,
  },
  {
    name: "silver",
    title: "Silver Sponsors",
    columns: 2,
  },
  {
    name: "spark_supporter",
    title: "Spark Supporters",
    columns: 2,
  },
] as const

export type SponsorTier = (typeof SPONSOR_TIERS)[number]["name"]

export type SponsorTierColumns = (typeof SPONSOR_TIERS)[number]["columns"]

export type Sponsor = {
  name: string
  url: string
  logo: (props: React.ComponentProps<"svg">) => JSX.Element
  tier: SponsorTier
}
