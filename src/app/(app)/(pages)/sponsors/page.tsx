import type { Metadata } from "next"
import { addQueryParams } from "@/utils/url"
import { ArrowUpRightIcon } from "lucide-react"

import { SPONSORSHIP_URL, UTM_PARAMS, X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { SponsorItem } from "@/features/sponsor/components/sponsor-item"
import { INDIVIDUAL_SPONSORS, SPONSORS } from "@/features/sponsor/data"
import type {
  IndividualSponsor,
  Sponsor,
  SponsorTier,
  SponsorTierColumns,
} from "@/features/sponsor/types"
import { SPONSOR_TIERS } from "@/features/sponsor/types"

const title = "Sponsors"
const description =
  "Grateful to the sponsors who make this open-source work possible."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/sponsors",
  },
  openGraph: {
    url: "/sponsors",
    type: "website",
    images: {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    creator: X_HANDLE,
    images: [ogImage],
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
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Sponsors",
            href: "/sponsors",
          },
        ])}
      />

      <div>
        <PageHeading>
          <PageHeadingTagline>Sponsors</PageHeadingTagline>
          <PageHeadingTitle>Backed by the community.</PageHeadingTitle>
          <PageHeadingDescription>
            Grateful to the sponsors who make this open-source work possible.
          </PageHeadingDescription>
        </PageHeading>

        <div className="h-4" />

        <div className="screen-line-bottom h-px" />

        {SPONSOR_TIERS.map((tier) => (
          <SponsorsGroup
            key={tier.name}
            title={tier.title}
            columns={tier.columns}
            sponsors={SPONSORS_BY_TIER[tier.name] ?? []}
          />
        ))}

        <IndividualSponsorsGroup sponsors={INDIVIDUAL_SPONSORS} />

        <div className="flex justify-center py-4">
          <Button
            className="gap-2 border-none pr-2.5 pl-3"
            size="sm"
            nativeButton={false}
            render={<a href={SPONSORSHIP_URL} target="_blank" rel="noopener" />}
          >
            Sponsor my work
            <ArrowUpRightIcon />
          </Button>
        </div>

        <div className="screen-line-top h-4" />
      </div>
    </>
  )
}

type GridLayout = {
  grid: string
  guides: string[]
  rows: string
}

const GRID_LAYOUTS: Record<SponsorTierColumns, GridLayout> = {
  2: {
    grid: "grid-cols-1 sm:grid-cols-2",
    guides: ["max-sm:hidden", "border-l max-sm:hidden"],
    rows: "max-sm:*:screen-line-bottom sm:*:nth-[2n+1]:screen-line-bottom",
  },
  3: {
    grid: "grid-cols-2 sm:grid-cols-3",
    guides: ["", "border-l", "border-l max-sm:hidden"],
    rows: "max-sm:*:nth-[2n+1]:screen-line-bottom sm:*:nth-[3n+1]:screen-line-bottom",
  },
}

function SponsorsGroup({
  title,
  columns,
  sponsors,
}: {
  title: string
  columns: SponsorTierColumns
  sponsors: Sponsor[]
}) {
  if (sponsors.length === 0) {
    return null
  }

  const layout = GRID_LAYOUTS[columns]

  return (
    <div>
      <SponsorsGroupTitle>{title}</SponsorsGroupTitle>

      <SponsorsGrid layout={layout}>
        {sponsors.map((item) => (
          <li key={item.name}>
            <SponsorItem
              href={addQueryParams(item.url, UTM_PARAMS)}
              aria-label={`${item.name} logo`}
              data-tier={item.tier}
              className="min-h-15 data-[tier=gold]:min-h-18 data-[tier=platinum]:min-h-22.5 [&_svg]:w-full [&_svg]:max-w-50 [&_svg]:shrink-0 data-[tier=gold]:[&_svg]:max-w-60 data-[tier=platinum]:[&_svg]:max-w-75"
            >
              <item.logo aria-hidden />
            </SponsorItem>
          </li>
        ))}
      </SponsorsGrid>
    </div>
  )
}

function IndividualSponsorsGroup({
  sponsors,
}: {
  sponsors: IndividualSponsor[]
}) {
  if (sponsors.length === 0) {
    return null
  }

  return (
    <div>
      <SponsorsGroupTitle>Individual Sponsors</SponsorsGroupTitle>

      <SponsorsGrid layout={GRID_LAYOUTS[3]}>
        {sponsors.map((item) => (
          <li key={item.githubUsername}>
            <SponsorItem
              href={`https://github.com/${item.githubUsername}`}
              rel="noopener"
              className="h-12 justify-start px-4 font-mono text-sm"
            >
              <span className="truncate">{item.githubUsername}</span>
            </SponsorItem>
          </li>
        ))}
      </SponsorsGrid>
    </div>
  )
}

function SponsorsGrid({
  layout,
  children,
}: {
  layout: GridLayout
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 -z-1 grid",
          layout.grid
        )}
      >
        {layout.guides.map((guide, index) => (
          <div key={index} className={cn("border-line", guide)} />
        ))}
      </div>

      <ul className={cn("screen-line-top grid", layout.grid, layout.rows)}>
        {children}
      </ul>
    </div>
  )
}

function SponsorsGroupTitle(props: React.ComponentProps<"h2">) {
  return (
    <h2
      className="p-4 font-heading text-sm/none font-medium tracking-wider text-muted-foreground"
      {...props}
    />
  )
}
