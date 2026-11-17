import "server-only"

import { unstable_cache } from "next/cache"

type ISODateString = string

export type InsightsSummary = {
  unique_visitors: number
  total_screen_views: number
  views_per_session: number
  avg_session_duration: number
}

export type InsightsSeriesItem = {
  date: ISODateString
  total_screen_views: number
}

export type InsightsPage = {
  path: string
  pageviews: number
}

type DateRange = {
  startDate: ISODateString
  endDate: ISODateString
}

type OverviewResponse = DateRange & {
  summary: InsightsSummary
  series: InsightsSeriesItem[]
}

export type InsightsResponse = OverviewResponse & {
  topPages: InsightsPage[]
}

const TOP_PAGES_LIMIT = 10

async function fetchInsights<T>(
  endpoint: string,
  range?: DateRange
): Promise<T | null> {
  try {
    const url = new URL(
      `https://api.openpanel.dev/insights/${process.env.OPENPANEL_PROJECT_ID}/${endpoint}`
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

    return (await res.json()) as T
  } catch {
    return null
  }
}

/**
 * The range is required because `/pages` defaults to 7 days while `/overview`
 * defaults to 30. The endpoint ignores `limit` and ranks by sessions, so every
 * row comes back and is re-ranked by views here.
 */
async function fetchTopPages(range: DateRange): Promise<InsightsPage[]> {
  const pages = await fetchInsights<InsightsPage[]>("pages", range)

  return (pages ?? [])
    .map(({ path, pageviews }) => ({ path, pageviews }))
    .sort((a, b) => b.pageviews - a.pageviews)
    .slice(0, TOP_PAGES_LIMIT)
}

export const getInsights = unstable_cache(
  async (): Promise<InsightsResponse | null> => {
    const overview = await fetchInsights<OverviewResponse>("overview")

    if (overview === null) {
      return null
    }

    return {
      ...overview,
      // The range is `[startDate, endDate)`, yet the series also includes
      // `endDate`: today, still partial, which ends the chart on a false drop.
      series: overview.series.filter(
        (item) => item.date.slice(0, 10) < overview.endDate
      ),
      topPages: await fetchTopPages(overview),
    }
  },
  ["openpanel-insights"],
  { revalidate: 86400 } // 1 day
)
