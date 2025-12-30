export type SponsorTier = "silver" | "gold" | "platinum";

type SponsorBase = {
  name: string;
  tier?: SponsorTier;
};

export type OrganizationSponsor = SponsorBase & {
  type: "organization";
  logo: string;
  website: string;
};

export type IndividualSponsor = SponsorBase & {
  type: "individual";
  username: string;
  tagline: string;
};

export type Sponsor = OrganizationSponsor | IndividualSponsor;
