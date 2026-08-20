import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function Metric({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="metric"
      className={cn(
        // `justify-between` keeps values aligned across a row when a label
        // wraps to two lines in a narrow column.
        "flex flex-col justify-between gap-2 p-4",
        "max-md:nth-[2n+1]:screen-line-bottom md:nth-[4n+1]:screen-line-bottom",
        className
      )}
      {...props}
    />
  )
}

export function MetricLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
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

export type MetricChangeProps = {
  /**
   * Percentage change against the previous period, e.g. `12.4` for `+12.4%`.
   * `null` when there is no previous period to compare against.
   */
  value: number | null
}

/**
 * Assumes every metric is one where higher is better, so up maps to green.
 * The icon carries the direction too, so the meaning survives without color.
 */
export function MetricChange({ value }: MetricChangeProps) {
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
      {Math.abs(percent).toLocaleString("en-US")}%
      <span className="sr-only"> compared to the previous period</span>
    </span>
  )
}

export function MetricValue({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
