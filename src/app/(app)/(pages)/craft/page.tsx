import type { Metadata } from "next"

import { AD_PLACEMENTS, CARBON_ADS } from "@/config/ads"
import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { CarbonAds } from "@/components/carbon-ads"
import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { CraftItem } from "@/features/craft/components/craft-item"
import { CRAFTS } from "@/features/craft/data"

const title = "Craft"
const description = "Building interfaces and interactions."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/craft",
  },
  openGraph: {
    url: "/craft",
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

export default function CraftPage() {
  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Craft",
            href: "/craft",
          },
        ])}
      />

      <div className="min-h-svh">
        <PageHeading>
          <PageHeadingTagline>Craft</PageHeadingTagline>
          <PageHeadingTitle>
            Building interfaces and interactions.
          </PageHeadingTitle>
        </PageHeading>

        <div className="h-4" />

        {CARBON_ADS && AD_PLACEMENTS.craft && (
          <>
            <div className="screen-line-bottom h-px" />
            <div className="flex justify-center p-4">
              <CarbonAds />
            </div>
          </>
        )}

        <ul>
          {CRAFTS.map((craft, index) => (
            <li key={craft.description} className="group/craft">
              <div className="stripe-divider h-12 group-first/craft:hidden" />
              <CraftItem
                className="screen-line-top screen-line-bottom"
                craft={craft}
                figureNumber={index + 1}
                // The first two can share the first screen, so either may be
                // the LCP element.
                imageLoading={index < 2 ? "eager" : "lazy"}
              />
            </li>
          ))}
        </ul>

        <div className="h-4" />
      </div>
    </>
  )
}
