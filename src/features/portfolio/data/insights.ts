import "server-only"

import { unstable_cache } from "next/cache"

type ISODateString = string

type InsightsSummary = {
  unique_visitors: number
  total_sessions: number
  total_screen_views: number
  avg_session_duration: number
}

type InsightsSeriesItem = {
  date: ISODateString
  unique_visitors: number
  total_sessions: number
}

type DateRange = {
  startDate: ISODateString
  endDate: ISODateString
}

type OverviewResponse = DateRange & {
  summary: InsightsSummary
  series: InsightsSeriesItem[]
}

const METRIC_KEYS = [
  "unique_visitors",
  "total_sessions",
  "total_screen_views",
  "avg_session_duration",
] as const satisfies readonly (keyof InsightsSummary)[]

/**
 * `null` when the previous cycle is unavailable or was zero, since growth from
 * zero has no meaningful percentage.
 */
type InsightsChanges = Record<(typeof METRIC_KEYS)[number], number | null>

type InsightsResponse = OverviewResponse & {
  previous: (DateRange & { summary: InsightsSummary }) | null
  changes: InsightsChanges
}

async function fetchOverview(
  range?: DateRange
): Promise<OverviewResponse | null> {
  try {
    const url = new URL(
      `https://api.openpanel.dev/insights/${process.env.OPENPANEL_PROJECT_ID}/overview`
    )

    if (range) {
      url.searchParams.set("startDate", range.startDate)
      url.searchParams.set("endDate", range.endDate)
    }

    const res = await fetch(url, {
      headers: {
        "openpanel-client-id": process.env.OPENPANEL_CLIENT_ID!,
        "openpanel-client-secret": process.env.OPENPANEL_CLIENT_SECRET!,
      },
    })

    if (!res.ok) {
      return null
    }

    const data = (await res.json()) as OverviewResponse
    return data
  } catch {
    return null
  }
}

/**
 * The API treats a range as `[startDate, endDate)`, so the cycle immediately
 * before it ends exactly where the current one starts.
 */
function getPreviousRange({ startDate, endDate }: DateRange): DateRange | null {
  const start = Date.parse(startDate)
  const end = Date.parse(endDate)

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return null
  }

  return {
    startDate: toDateParam(start - (end - start)),
    endDate: toDateParam(start),
  }
}

function toDateParam(time: number): ISODateString {
  return new Date(time).toISOString().slice(0, 10)
}

function getPercentChange(current: number, previous?: number): number | null {
  if (previous === undefined || previous === 0) {
    return null
  }

  return ((current - previous) / previous) * 100
}

function getChanges(
  current: InsightsSummary,
  previous: InsightsSummary | null
): InsightsChanges {
  return Object.fromEntries(
    METRIC_KEYS.map((key) => [
      key,
      getPercentChange(current[key], previous?.[key]),
    ])
  ) as InsightsChanges
}

export const getInsights = unstable_cache(
  async (): Promise<InsightsResponse | null> => {
    const current = await fetchOverview()

    if (current === null) {
      return null
    }

    const previousRange = getPreviousRange(current)
    const previousSummary = previousRange
      ? ((await fetchOverview(previousRange))?.summary ?? null)
      : null

    return {
      ...current,
      previous:
        previousRange && previousSummary
          ? { ...previousRange, summary: previousSummary }
          : null,
      changes: getChanges(current.summary, previousSummary),
    }
  },
  ["openpanel-insights"],
  { revalidate: 86400 } // 1 day
)
