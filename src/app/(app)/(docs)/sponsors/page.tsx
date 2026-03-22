import { ArrowUpRightIcon } from "lucide-react"
import type { Metadata } from "next"

import { Button } from "@/components/base/ui/button"
import { SITE_INFO, SPONSORSHIP_URL, X_USERNAME } from "@/config/site"
import { SponsorItem } from "@/features/sponsor/components/sponsor-item"
import { SPONSORS } from "@/features/sponsor/data"
import type { Sponsor, SponsorTier } from "@/features/sponsor/types"
import { SPONSOR_TIERS } from "@/features/sponsor/types"

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Grateful for the support that helps me grow and maintain high-quality projects.",
  alternates: {
    canonical: "/sponsors",
  },
  openGraph: {
    url: "/sponsors",
    type: "website",
    images: {
      url: SITE_INFO.ogImage,
      width: 1200,
      height: 630,
      alt: "Sponsors",
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_USERNAME,
    creator: X_USERNAME,
    images: [SITE_INFO.ogImage],
  },
}

const SPONSORS_BY_TIER = SPONSORS.reduce(
  (acc, sponsor) => {
    if (!acc[sponsor.tier]) {
      acc[sponsor.tier] = []
    }
    acc[sponsor.tier].push(sponsor)
    return acc
  },
  {} as Record<SponsorTier, Sponsor[]>
)

export default function Page() {
  return (
    <div>
      <div className="screen-line-bottom px-4">
        <h1 className="text-3xl leading-none font-semibold tracking-tight">
          Sponsors
        </h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {metadata.description}
        </p>
      </div>

      <div className="screen-line-top screen-line-bottom flex h-4" />

      {SPONSOR_TIERS.map((tier) => (
        <SponsorsGroup
          key={tier.name}
          title={tier.title}
          sponsors={SPONSORS_BY_TIER[tier.name] ?? []}
        />
      ))}

      <div className="flex justify-center py-2">
        <Button
          className="gap-2 border-none pr-2.5 pl-3"
          size="sm"
          nativeButton={false}
          render={
            <a
              href={SPONSORSHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          Sponsor My Work
          <ArrowUpRightIcon />
        </Button>
      </div>

      <div className="screen-line-top h-4" />
    </div>
  )
}

function SponsorsGroup({
  title,
  sponsors,
}: {
  title: string
  sponsors: Sponsor[]
}) {
  if (sponsors.length === 0) {
    return null
  }

  return (
    <div>
      <div className="p-4">
        <h2 className="font-heading text-lg leading-none font-medium">
          {title}
        </h2>
      </div>

      <div className="screen-line-bottom relative pb-4">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-line" />
          <div className="border-l border-line" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sponsors.map((item) => (
            <SponsorItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
