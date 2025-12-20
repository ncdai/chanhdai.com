type SponsorBase = {
  name: string;
  website: string;
};

export type OrganizationSponsor = SponsorBase & {
  type: "organization";
  logo: string;
};

export type IndividualSponsor = SponsorBase & {
  type: "individual";
  avatar: string;
  tagline: string;
};

export type Sponsor = OrganizationSponsor | IndividualSponsor;
