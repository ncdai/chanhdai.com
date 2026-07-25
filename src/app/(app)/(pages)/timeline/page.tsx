import type { Metadata } from "next"

import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { TimescaleIntroScroll } from "@/registry/components/timescale"
import { Timeline } from "@/features/portfolio/components/timeline"

const title = "Timeline"
const description = "A life in milestones."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/timeline",
  },
  openGraph: {
    url: "/timeline",
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

export default function TimelinePage() {
  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Timeline",
            href: "/timeline",
          },
        ])}
      />

      <PageHeading>
        <PageHeadingTagline>Timeline</PageHeadingTagline>
        <PageHeadingTitle>A life in milestones.</PageHeadingTitle>
      </PageHeading>

      <div className="h-4" />
      <div className="screen-line-top h-3" />

      <TimescaleIntroScroll>
        <Timeline orientation="horizontal" className="hidden md:flex" />
      </TimescaleIntroScroll>

      <Timeline orientation="vertical" className="px-4 md:hidden" />

      <div className="screen-line-top h-4" />
    </>
  )
}
