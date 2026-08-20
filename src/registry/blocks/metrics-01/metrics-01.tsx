import { format } from "date-fns"

import Grid from "@/components/charts/grid"
import LineChart, { Line } from "@/components/charts/line-chart"
import { ChartTooltip } from "@/components/charts/tooltip"
import {
  Metric,
  MetricChange,
  MetricLabel,
  MetricValue,
} from "@/registry/blocks/metrics-01/components/metric"

export function Metrics01() {
  return (
    <div className="max-w-screen overflow-x-clip">
      <div className="container mx-auto px-4">
        <div className="border-x border-line py-8">
          <div className="screen-line-top screen-line-bottom">
            <h2 className="screen-line-bottom ml-4 font-heading text-3xl font-medium tracking-tight">
              Insights
              <sup className="top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">
                ({format(new Date(data.startDate), "dd.MM")} –{" "}
                {format(new Date(data.endDate), "dd.MM")})
              </sup>
            </h2>

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
                    <MetricChange value={data.changes.uniqueVisitors} />
                  </MetricLabel>
                  <MetricValue>
                    {data.summary.uniqueVisitors.toLocaleString("en-US")}
                  </MetricValue>
                </Metric>

                <Metric>
                  <MetricLabel>
                    Sessions
                    <MetricChange value={data.changes.totalSessions} />
                  </MetricLabel>
                  <MetricValue>
                    {data.summary.totalSessions.toLocaleString("en-US")}
                  </MetricValue>
                </Metric>

                <Metric>
                  <MetricLabel>
                    Views
                    <MetricChange value={data.changes.totalScreenViews} />
                  </MetricLabel>
                  <MetricValue>
                    {data.summary.totalScreenViews.toLocaleString("en-US")}
                  </MetricValue>
                </Metric>

                <Metric>
                  <MetricLabel>
                    Session duration
                    <MetricChange value={data.changes.avgSessionDuration} />
                  </MetricLabel>
                  <MetricValue>
                    {formatDuration(data.summary.avgSessionDuration)}
                  </MetricValue>
                </Metric>
              </dl>
            </div>

            {data.series.length > 0 ? (
              <LineChart
                className="md:aspect-3/1!"
                data={data.series}
                margin={{ top: 16, right: 32, bottom: 40, left: 32 }}
              >
                <Grid horizontal />
                <Line
                  dataKey="totalSessions"
                  stroke="var(--chart-line-secondary)"
                  strokeWidth={2}
                />
                <Line
                  dataKey="uniqueVisitors"
                  stroke="var(--chart-line-primary)"
                  strokeWidth={2}
                />
                <ChartTooltip />
              </LineChart>
            ) : (
              <div className="grid aspect-2/1 w-full place-content-center md:aspect-3/1">
                <p className="text-muted-foreground">No insights available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

type ISODateString = string

type InsightsSummary = {
  uniqueVisitors: number
  totalSessions: number
  totalScreenViews: number
  avgSessionDuration: number
}

type InsightsSeriesItem = {
  date: ISODateString
  uniqueVisitors: number
  totalSessions: number
}

/**
 * `null` where the previous period was zero, since growth from zero has no
 * meaningful percentage.
 */
type InsightsChanges = Record<keyof InsightsSummary, number | null>

type InsightsData = {
  summary: InsightsSummary
  changes: InsightsChanges
  series: InsightsSeriesItem[]
  startDate: ISODateString
  endDate: ISODateString
}

const data: InsightsData = {
  summary: {
    uniqueVisitors: 14777,
    totalSessions: 17117,
    avgSessionDuration: 378.32284000000004,
    totalScreenViews: 119318,
  },
  changes: {
    uniqueVisitors: 12.4,
    totalSessions: 8.1,
    avgSessionDuration: 5.7,
    totalScreenViews: -3.2,
  },
  series: [
    {
      date: "2026-05-31T00:00:00.000Z",
      uniqueVisitors: 437,
      totalSessions: 520,
    },
    {
      date: "2026-06-01T00:00:00.000Z",
      uniqueVisitors: 554,
      totalSessions: 636,
    },
    {
      date: "2026-06-02T00:00:00.000Z",
      uniqueVisitors: 587,
      totalSessions: 649,
    },
    {
      date: "2026-06-03T00:00:00.000Z",
      uniqueVisitors: 456,
      totalSessions: 530,
    },
    {
      date: "2026-06-04T00:00:00.000Z",
      uniqueVisitors: 507,
      totalSessions: 590,
    },
    {
      date: "2026-06-05T00:00:00.000Z",
      uniqueVisitors: 532,
      totalSessions: 507,
    },
    {
      date: "2026-06-06T00:00:00.000Z",
      uniqueVisitors: 446,
      totalSessions: 437,
    },
    {
      date: "2026-06-07T00:00:00.000Z",
      uniqueVisitors: 542,
      totalSessions: 544,
    },
    {
      date: "2026-06-08T00:00:00.000Z",
      uniqueVisitors: 576,
      totalSessions: 582,
    },
    {
      date: "2026-06-09T00:00:00.000Z",
      uniqueVisitors: 563,
      totalSessions: 544,
    },
    {
      date: "2026-06-10T00:00:00.000Z",
      uniqueVisitors: 553,
      totalSessions: 537,
    },
    {
      date: "2026-06-11T00:00:00.000Z",
      uniqueVisitors: 495,
      totalSessions: 568,
    },
    {
      date: "2026-06-12T00:00:00.000Z",
      uniqueVisitors: 534,
      totalSessions: 624,
    },
    {
      date: "2026-06-13T00:00:00.000Z",
      uniqueVisitors: 436,
      totalSessions: 522,
    },
    {
      date: "2026-06-14T00:00:00.000Z",
      uniqueVisitors: 440,
      totalSessions: 520,
    },
    {
      date: "2026-06-15T00:00:00.000Z",
      uniqueVisitors: 492,
      totalSessions: 581,
    },
    {
      date: "2026-06-16T00:00:00.000Z",
      uniqueVisitors: 472,
      totalSessions: 549,
    },
    {
      date: "2026-06-17T00:00:00.000Z",
      uniqueVisitors: 454,
      totalSessions: 548,
    },
    {
      date: "2026-06-18T00:00:00.000Z",
      uniqueVisitors: 477,
      totalSessions: 547,
    },
    {
      date: "2026-06-19T00:00:00.000Z",
      uniqueVisitors: 395,
      totalSessions: 461,
    },
    {
      date: "2026-06-20T00:00:00.000Z",
      uniqueVisitors: 397,
      totalSessions: 480,
    },
    {
      date: "2026-06-21T00:00:00.000Z",
      uniqueVisitors: 424,
      totalSessions: 488,
    },
    {
      date: "2026-06-22T00:00:00.000Z",
      uniqueVisitors: 519,
      totalSessions: 590,
    },
    {
      date: "2026-06-23T00:00:00.000Z",
      uniqueVisitors: 463,
      totalSessions: 532,
    },
    {
      date: "2026-06-24T00:00:00.000Z",
      uniqueVisitors: 469,
      totalSessions: 534,
    },
    {
      date: "2026-06-25T00:00:00.000Z",
      uniqueVisitors: 469,
      totalSessions: 522,
    },
    {
      date: "2026-06-26T00:00:00.000Z",
      uniqueVisitors: 481,
      totalSessions: 551,
    },
    {
      date: "2026-06-27T00:00:00.000Z",
      uniqueVisitors: 475,
      totalSessions: 578,
    },
    {
      date: "2026-06-28T00:00:00.000Z",
      uniqueVisitors: 570,
      totalSessions: 656,
    },
    {
      date: "2026-06-29T00:00:00.000Z",
      uniqueVisitors: 1051,
      totalSessions: 1190,
    },
  ],
  startDate: "2026-05-31",
  endDate: "2026-06-30",
}

/**
 * Formats a duration given in seconds into a compact `Xh Ym Zs` string.
 * Zero-valued units are omitted; a zero duration renders as `0s`.
 */
export function formatDuration(seconds: number): string {
  const totalSeconds = Math.round(seconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0) parts.push(`${secs}s`)

  return parts.length > 0 ? parts.join(" ") : "0s"
}
