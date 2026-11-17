import { formatDuration, formatNumber } from "@/utils/format"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { InsightsSummary } from "@/features/portfolio/data/insights"

export function InsightsMetrics({ summary }: { summary: InsightsSummary }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 md:grid-cols-4">
        <div className="border-r border-line" />
        <div className="border-r border-line max-md:hidden" />
        <div className="border-r border-line max-md:hidden" />
      </div>

      <dl className="grid grid-cols-2 md:grid-cols-4">
        <Metric>
          <MetricLabel>Unique visitors</MetricLabel>
          <MetricValue>{formatNumber(summary.unique_visitors)}</MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>Page views</MetricLabel>
          <MetricValue>{formatNumber(summary.total_screen_views)}</MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>Pages per session</MetricLabel>
          <MetricValue>
            {formatNumber(Math.round(summary.views_per_session * 10) / 10)}
          </MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>Session duration</MetricLabel>
          <MetricValue>
            {formatDuration(summary.avg_session_duration)}
          </MetricValue>
        </Metric>
      </dl>
    </div>
  )
}

function Metric({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="metric"
      className={cn(
        // `justify-between` keeps values aligned across a row when a label
        // wraps to two lines in a narrow column.
        "flex flex-col justify-between gap-1 p-4 pt-3",
        "max-sm:nth-[2n+1]:screen-line-bottom sm:nth-[3n+1]:screen-line-bottom",
        className
      )}
      {...props}
    />
  )
}

function MetricLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <dt
      data-slot="metric-label"
      className={cn(
        "text-[0.625rem]/4 font-medium tracking-wider text-muted-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}

function MetricValue({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <dd
      data-slot="metric-value"
      className={cn("font-mono text-xl/none font-medium", className)}
      {...props}
    />
  )
}

/** Bar heights match the label (`text-[0.625rem]/4`) and value (`text-lg leading-none`). */
export function InsightsMetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4" aria-hidden>
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col gap-1 p-4 pt-3",
            "max-sm:nth-[2n+1]:screen-line-bottom sm:nth-[3n+1]:screen-line-bottom"
          )}
        >
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4.5 w-24" />
        </div>
      ))}
    </div>
  )
}
