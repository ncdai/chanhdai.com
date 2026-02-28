import type { JSX } from "react"

export type SponsorTier = "silver" | "gold" | "platinum"

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
