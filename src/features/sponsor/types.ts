import type { JSX } from "react"

export const SPONSOR_TIER = ["osp", "silver", "gold", "platinum"] as const

export type SponsorTier = (typeof SPONSOR_TIER)[number]

type SponsorBase = {
  name: string
  url: string
  tier?: SponsorTier
}

export type OrganizationSponsor = SponsorBase & {
  type: "organization"
  logo: (props: React.ComponentProps<"svg">) => JSX.Element
}

export type IndividualSponsor = SponsorBase & {
  type: "individual"
  avatar: string
  tagline: string
}

export type Sponsor = OrganizationSponsor | IndividualSponsor
