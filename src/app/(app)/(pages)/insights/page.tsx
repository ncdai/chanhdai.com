import { Suspense } from "react"
import type { Metadata } from "next"
import { differenceInCalendarDays, parseISO } from "date-fns"

import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import {
  InsightsChart,
  InsightsChartSkeleton,
} from "@/features/portfolio/components/insights/insights-chart"
import {
  InsightsMetrics,
  InsightsMetricsSkeleton,
} from "@/features/portfolio/components/insights/insights-metrics"
import { getInsights } from "@/features/portfolio/data/insights"

const title = "Insights"
const description =
  "The code is public, and so are the numbers. Visitors, sessions, and views, compared with the previous period."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/insights",
  },
  openGraph: {
    url: "/insights",
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

export default function InsightsPage() {
  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Insights",
            href: "/insights",
          },
        ])}
      />

      <div className="min-h-svh">
        <PageHeading>
          <PageHeadingTagline>Insights</PageHeadingTagline>
          <PageHeadingTitle>Open source, open metrics.</PageHeadingTitle>
          <PageHeadingDescription>
            The code is public, and so are the numbers.
          </PageHeadingDescription>
        </PageHeading>

        <div className="h-4" />
        <div className="screen-line-bottom h-px" />

        <Suspense fallback={<InsightsContentSkeleton />}>
          <InsightsContent />
        </Suspense>

        <div className="screen-line-top h-4" />
      </div>
    </>
  )
}

async function InsightsContent() {
  const data = await getInsights()

  if (data === null) {
    return (
      <div className="grid aspect-2/1 w-full place-content-center sm:aspect-3/1">
        <p className="text-muted-foreground">No insights available.</p>
      </div>
    )
  }

  // The API window is `[startDate, endDate)`, so the difference is the number
  // of days the summary covers without an off-by-one.
  const days = differenceInCalendarDays(
    parseISO(data.endDate),
    parseISO(data.startDate)
  )

  return (
    <>
      <div className="screen-line-bottom flex h-10 items-center px-4">
        <h2 className="font-heading text-sm font-medium text-muted-foreground">
          Last {days} days
        </h2>
      </div>

      <InsightsMetrics summary={data.summary} changes={data.changes} />

      <InsightsChart series={data.series} figureNumber={1} showDateRange />
    </>
  )
}

function InsightsContentSkeleton() {
  return (
    <>
      <div className="screen-line-bottom h-10" aria-hidden />
      <InsightsMetricsSkeleton />
      <InsightsChartSkeleton />
    </>
  )
}
