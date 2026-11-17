import { Suspense } from "react"
import type { Metadata } from "next"
import { format } from "date-fns"

import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PageHeading,
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
import {
  InsightsTopPages,
  InsightsTopPagesSkeleton,
} from "@/features/portfolio/components/insights/insights-top-pages"
import { getPlottedRange } from "@/features/portfolio/components/insights/plotted-range"
import { getInsights } from "@/features/portfolio/data/insights"

const title = "Insights"
const description =
  "Visitors, page views, and engagement over the last 30 days."

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
          <PageHeadingTitle>
            Built in public, measured in public.
          </PageHeadingTitle>
        </PageHeading>

        <div className="h-4" />

        <dl className="screen-line-top screen-line-bottom grid auto-cols-fr grid-flow-col divide-x divide-line">
          <InsightsField label="Period (30 days)">
            <Suspense fallback={<Skeleton className="my-0.5 h-4 w-36" />}>
              <InsightsDateRange />
            </Suspense>
          </InsightsField>

          <InsightsField label="Source">
            <a
              href="https://openpanel.dev"
              className="link-underline"
              target="_blank"
              rel="noopener"
            >
              OpenPanel
            </a>
          </InsightsField>
        </dl>

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

/** Plotted days, so the range matches the first and last points on the chart. */
async function InsightsDateRange() {
  const data = await getInsights()
  const range = data ? getPlottedRange(data.series) : null

  if (range === null) {
    return null
  }

  return (
    <>
      <time dateTime={format(range.start, "yyyy-MM-dd")}>
        {format(
          range.start,
          range.start.getFullYear() === range.end.getFullYear()
            ? "d MMM"
            : "d MMM yyyy"
        )}
      </time>
      {" – "}
      <time dateTime={format(range.end, "yyyy-MM-dd")}>
        {format(range.end, "d MMM yyyy")}
      </time>
    </>
  )
}

function InsightsField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 p-4 pt-3">
      <dt className="text-[0.625rem]/4 font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm/none">{children}</dd>
    </div>
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

  return (
    <>
      <InsightsMetrics summary={data.summary} />

      <SectionDivider className="pt-0 screen-line-top-none" />
      <InsightsChart series={data.series} />

      {data.topPages.length > 0 && (
        <>
          <SectionDivider />
          <InsightsTopPages pages={data.topPages} />
        </>
      )}
    </>
  )
}

function InsightsContentSkeleton() {
  return (
    <>
      <InsightsMetricsSkeleton />
      <SectionDivider className="pt-0 screen-line-top-none" />
      <InsightsChartSkeleton />
      <SectionDivider />
      <InsightsTopPagesSkeleton />
    </>
  )
}

function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "screen-line-top screen-line-bottom py-px before:z-1",
        className
      )}
    >
      <div className="stripe-divider" />
    </div>
  )
}
