import { formatDuration, formatNumber } from "@/utils/format"
import { format } from "date-fns"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import Grid from "@/components/charts/grid"
import LineChart, { Line } from "@/components/charts/line-chart"
import { ChartTooltip } from "@/components/charts/tooltip"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { getInsights } from "@/features/portfolio/data/insights"

const ID = "insights"

export async function Insights() {
  const data = await getInsights()

  if (data === null) {
    return null
  }

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Insights</a>
          <PanelTitleSup>
            ({format(new Date(data.startDate), "dd.MM")} –{" "}
            {format(new Date(data.endDate), "dd.MM")})
          </PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 md:grid-cols-4">
          <div className="border-r border-line" />
          <div className="border-r border-line max-md:hidden" />
          <div className="border-r border-line max-md:hidden" />
        </div>

        <dl className="grid grid-cols-2 md:grid-cols-4">
          <Metric>
            <MetricLabel>
              Unique visitors
              <MetricChange value={data.changes.unique_visitors} />
            </MetricLabel>
            <MetricValue>
              {formatNumber(data.summary.unique_visitors)}
            </MetricValue>
          </Metric>

          <Metric>
            <MetricLabel>
              Sessions
              <MetricChange value={data.changes.total_sessions} />
            </MetricLabel>
            <MetricValue>
              {formatNumber(data.summary.total_sessions)}
            </MetricValue>
          </Metric>

          <Metric>
            <MetricLabel>
              Views
              <MetricChange value={data.changes.total_screen_views} />
            </MetricLabel>
            <MetricValue>
              {formatNumber(data.summary.total_screen_views)}
            </MetricValue>
          </Metric>

          <Metric>
            <MetricLabel>
              Session duration
              <MetricChange value={data.changes.avg_session_duration} />
            </MetricLabel>
            <MetricValue>
              {formatDuration(data.summary.avg_session_duration)}
            </MetricValue>
          </Metric>
        </dl>
      </div>

      <figure>
        {data.series.length > 0 ? (
          <LineChart
            className={cn(
              "sm:aspect-3/1!",
              "[--chart-1:var(--color-zinc-900)] [--chart-2:var(--color-zinc-400)]",
              "dark:[--chart-1:var(--color-zinc-100)] dark:[--chart-2:var(--color-zinc-600)]"
            )}
            data={data.series}
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

        <figcaption className="screen-line-top px-4 py-3 text-center text-sm text-balance">
          <span className="mr-2 tracking-wide text-muted-foreground/80">
            Fig. 3.
          </span>
          Daily unique visitors and sessions. Source:{" "}
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
    </Panel>
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

export function InsightsSkeleton() {
  return <Panel className="h-90.75" />
}
