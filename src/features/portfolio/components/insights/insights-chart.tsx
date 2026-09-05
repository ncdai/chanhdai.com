import { format } from "date-fns"

import { cn } from "@/lib/utils"
import Grid from "@/components/charts/grid"
import LineChart, { Line } from "@/components/charts/line-chart"
import { ChartTooltip } from "@/components/charts/tooltip"
import type { InsightsSeriesItem } from "@/features/portfolio/data/insights"

import { getPlottedRange } from "./plotted-range"

export function InsightsChart({
  series,
  figureNumber,
  showDateRange = false,
}: {
  series: InsightsSeriesItem[]
  /** Figures are numbered per page, so the caller decides where this one falls. */
  figureNumber: number
  /** Off by default because the home panel already shows the range next to its title. */
  showDateRange?: boolean
}) {
  const range = showDateRange ? getPlottedRange(series) : null
  const dateRange = range
    ? `, ${format(range.start, "dd.MM.yyyy")} – ${format(range.end, "dd.MM.yyyy")}`
    : ""

  return (
    <figure>
      {series.length > 0 ? (
        <LineChart
          className={cn(
            "sm:aspect-3/1!",
            "[--chart-1:var(--color-zinc-900)] [--chart-2:var(--color-zinc-400)]",
            "dark:[--chart-1:var(--color-zinc-100)] dark:[--chart-2:var(--color-zinc-600)]"
          )}
          data={series}
          margin={{ top: 16, right: 32, bottom: 40, left: 32 }}
        >
          <Grid horizontal />
          <Line
            dataKey="total_sessions"
            stroke="var(--chart-2)"
            strokeWidth={2}
          />
          <Line
            dataKey="unique_visitors"
            stroke="var(--chart-1)"
            strokeWidth={2}
          />
          <ChartTooltip
            rowLabels={{
              total_sessions: "Sessions",
              unique_visitors: "Unique Visitors",
            }}
          />
        </LineChart>
      ) : (
        <div className="grid aspect-2/1 w-full place-content-center sm:aspect-3/1">
          <p className="text-muted-foreground">No insights available.</p>
        </div>
      )}

      <figcaption className="screen-line-top px-4 py-3 text-center text-sm text-balance tabular-nums">
        <span className="mr-2 tracking-wide text-muted-foreground/80">
          Fig. {figureNumber}.
        </span>
        Daily unique visitors and sessions{dateRange}. Source:{" "}
        <a
          href="https://openpanel.dev"
          className="link-underline"
          target="_blank"
          rel="noopener"
        >
          OpenPanel
        </a>
        .
      </figcaption>
    </figure>
  )
}

/** `h-11` is the caption row: `py-3` plus one line of `text-sm`. */
export function InsightsChartSkeleton() {
  return (
    <div aria-hidden>
      <div className="aspect-2/1 w-full sm:aspect-3/1" />
      <div className="screen-line-top h-11" />
    </div>
  )
}
