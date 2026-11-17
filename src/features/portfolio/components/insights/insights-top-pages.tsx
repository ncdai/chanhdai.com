import type { Route } from "next"
import Link from "next/link"
import { formatNumber } from "@/utils/format"

import { Skeleton } from "@/components/ui/skeleton"
import { PanelHeader, PanelTitle } from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import type { InsightsPage } from "@/features/portfolio/data/insights"

const ID = "top-pages"

export function InsightsTopPages({ pages }: { pages: InsightsPage[] }) {
  return (
    <section id={ID}>
      <InsightsTopPagesHeading />
      <InsightsTopPagesColumns />

      <ol className="grid grid-cols-1 gap-4 p-4">
        {pages.map((page) => (
          <li
            key={page.path}
            className="flex items-baseline gap-2 font-mono text-sm/4"
          >
            <Link
              href={page.path as Route}
              className="flex min-w-0"
              title={page.path}
            >
              <MiddleTruncatedPath path={page.path} />
            </Link>
            <span
              className="flex-1 translate-y-0.75 border-b border-dashed border-line"
              aria-hidden
            />
            <span className="font-medium">
              {formatNumber(page.pageviews)}
              <span className="sr-only"> views</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function MiddleTruncatedPath({ path }: { path: string }) {
  const index = path.lastIndexOf("/")

  return (
    <>
      <span className="truncate">{path.slice(0, index)}</span>
      <span className="max-w-full shrink-0 truncate">{path.slice(index)}</span>
    </>
  )
}

function InsightsTopPagesHeading() {
  return (
    <PanelHeader>
      <PanelTitle>
        <a href={`#${ID}`}>Top pages</a>
        <PanelTitleCopy id={ID} />
      </PanelTitle>
    </PanelHeader>
  )
}

/**
 * Visual only: an `ol` cannot hold a header row, and each row already
 * announces its count as views.
 */
function InsightsTopPagesColumns() {
  return (
    <div
      className="screen-line-bottom flex justify-between gap-4 px-4 py-2 text-[0.625rem]/4 font-medium tracking-wider text-muted-foreground uppercase"
      aria-hidden
    >
      <span>Path</span>
      <span>Views</span>
    </div>
  )
}

/** Bar heights match one row of `text-sm/4`. */
export function InsightsTopPagesSkeleton() {
  return (
    <div aria-hidden inert>
      <InsightsTopPagesHeading />
      <InsightsTopPagesColumns />

      <div className="grid gap-4 p-4">
        {Array.from({ length: 10 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}
