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
    uniqueVisitors: 13573,
    totalSessions: 16017,
    avgSessionDuration: 380.56365999999997,
    totalScreenViews: 100563,
  },
  changes: {
    uniqueVisitors: 12.4,
    totalSessions: 8.1,
    avgSessionDuration: 5.7,
    totalScreenViews: -3.2,
  },
  series: [
    {
      date: "2026-07-21T00:00:00.000Z",
      uniqueVisitors: 438,
      totalSessions: 514,
    },
    {
      date: "2026-07-22T00:00:00.000Z",
      uniqueVisitors: 452,
      totalSessions: 519,
    },
    {
      date: "2026-07-23T00:00:00.000Z",
      uniqueVisitors: 433,
      totalSessions: 487,
    },
    {
      date: "2026-07-24T00:00:00.000Z",
      uniqueVisitors: 466,
      totalSessions: 522,
    },
    {
      date: "2026-07-25T00:00:00.000Z",
      uniqueVisitors: 484,
      totalSessions: 555,
    },
    {
      date: "2026-07-26T00:00:00.000Z",
      uniqueVisitors: 545,
      totalSessions: 631,
    },
    {
      date: "2026-07-27T00:00:00.000Z",
      uniqueVisitors: 596,
      totalSessions: 691,
    },
    {
      date: "2026-07-28T00:00:00.000Z",
      uniqueVisitors: 522,
      totalSessions: 598,
    },
    {
      date: "2026-07-29T00:00:00.000Z",
      uniqueVisitors: 531,
      totalSessions: 609,
    },
    {
      date: "2026-07-30T00:00:00.000Z",
      uniqueVisitors: 537,
      totalSessions: 629,
    },
    {
      date: "2026-07-31T00:00:00.000Z",
      uniqueVisitors: 442,
      totalSessions: 509,
    },
    {
      date: "2026-08-01T00:00:00.000Z",
      uniqueVisitors: 437,
      totalSessions: 533,
    },
    {
      date: "2026-08-02T00:00:00.000Z",
      uniqueVisitors: 380,
      totalSessions: 451,
    },
    {
      date: "2026-08-03T00:00:00.000Z",
      uniqueVisitors: 435,
      totalSessions: 484,
    },
    {
      date: "2026-08-04T00:00:00.000Z",
      uniqueVisitors: 485,
      totalSessions: 539,
    },
    {
      date: "2026-08-05T00:00:00.000Z",
      uniqueVisitors: 465,
      totalSessions: 540,
    },
    {
      date: "2026-08-06T00:00:00.000Z",
      uniqueVisitors: 423,
      totalSessions: 495,
    },
    {
      date: "2026-08-07T00:00:00.000Z",
      uniqueVisitors: 421,
      totalSessions: 474,
    },
    {
      date: "2026-08-08T00:00:00.000Z",
      uniqueVisitors: 328,
      totalSessions: 419,
    },
    {
      date: "2026-08-09T00:00:00.000Z",
      uniqueVisitors: 577,
      totalSessions: 638,
    },
    {
      date: "2026-08-10T00:00:00.000Z",
      uniqueVisitors: 682,
      totalSessions: 762,
    },
    {
      date: "2026-08-11T00:00:00.000Z",
      uniqueVisitors: 450,
      totalSessions: 496,
    },
    {
      date: "2026-08-12T00:00:00.000Z",
      uniqueVisitors: 413,
      totalSessions: 483,
    },
    {
      date: "2026-08-13T00:00:00.000Z",
      uniqueVisitors: 422,
      totalSessions: 477,
    },
    {
      date: "2026-08-14T00:00:00.000Z",
      uniqueVisitors: 424,
      totalSessions: 473,
    },
    {
      date: "2026-08-15T00:00:00.000Z",
      uniqueVisitors: 378,
      totalSessions: 422,
    },
    {
      date: "2026-08-16T00:00:00.000Z",
      uniqueVisitors: 383,
      totalSessions: 453,
    },
    {
      date: "2026-08-17T00:00:00.000Z",
      uniqueVisitors: 413,
      totalSessions: 498,
    },
    {
      date: "2026-08-18T00:00:00.000Z",
      uniqueVisitors: 417,
      totalSessions: 473,
    },
    {
      date: "2026-08-19T00:00:00.000Z",
      uniqueVisitors: 572,
      totalSessions: 643,
    },
  ],
  startDate: "2026-07-21",
  endDate: "2026-08-20",
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
