import { formatDuration, formatNumber } from "@/utils/format"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type {
  InsightsChanges,
  InsightsSummary,
} from "@/features/portfolio/data/insights"

export function InsightsMetrics({
  summary,
  changes,
}: {
  summary: InsightsSummary
  changes: InsightsChanges
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 md:grid-cols-4">
        <div className="border-r border-line" />
        <div className="border-r border-line max-md:hidden" />
        <div className="border-r border-line max-md:hidden" />
      </div>

      <dl className="grid grid-cols-2 md:grid-cols-4">
        <Metric>
          <MetricLabel>
            Visitors
            <MetricChange value={changes.unique_visitors} />
          </MetricLabel>
          <MetricValue>{formatNumber(summary.unique_visitors)}</MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>
            Sessions
            <MetricChange value={changes.total_sessions} />
          </MetricLabel>
          <MetricValue>{formatNumber(summary.total_sessions)}</MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>
            Views
            <MetricChange value={changes.total_screen_views} />
          </MetricLabel>
          <MetricValue>{formatNumber(summary.total_screen_views)}</MetricValue>
        </Metric>

        <Metric>
          <MetricLabel>
            Duration
            <MetricChange value={changes.avg_session_duration} />
          </MetricLabel>
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
        "flex flex-col justify-between gap-2 p-4",
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
        "flex items-start justify-between gap-2 text-sm/4 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/**
 * Every metric shown here is one where higher is better, so up maps to green.
 * The arrow carries the direction too, so the meaning survives without color.
 */
function MetricChange({ value }: { value: number | null }) {
  if (value === null) {
    return null
  }

  const percent = Math.round(value * 10) / 10
  const Icon = percent > 0 ? TrendingUpIcon : TrendingDownIcon

  return (
    <span
      data-slot="metric-change"
      className={cn(
        "flex shrink-0 items-center gap-0.5 text-xs/4 tabular-nums",
        // Shades differ per color scheme so each clears 4.5:1 on its background.
        percent > 0 && "text-green-700 dark:text-green-500",
        percent < 0 && "text-red-700 dark:text-red-400"
      )}
    >
      {percent !== 0 && (
        <>
          <Icon className="size-3.5" aria-hidden />
          <span className="sr-only">{percent > 0 ? "Up by " : "Down by "}</span>
        </>
      )}
      {formatNumber(Math.abs(percent))}%
      <span className="sr-only"> compared to the previous period</span>
    </span>
  )
}

function MetricValue({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <dd
      data-slot="metric-value"
      className={cn(
        "text-lg leading-none font-semibold tabular-nums",
        className
      )}
      {...props}
    />
  )
}

/** Bar heights match the label (`text-sm/4`) and value (`text-lg leading-none`). */
export function InsightsMetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4" aria-hidden>
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col gap-2 p-4",
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
