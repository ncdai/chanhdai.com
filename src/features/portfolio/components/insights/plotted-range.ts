import { parseISO } from "date-fns"

import type { InsightsSeriesItem } from "@/features/portfolio/data/insights"

/**
 * First and last plotted days, not the API range: that range ends exclusively,
 * so its end date is one day past the last point on the chart.
 */
export function getPlottedRange(
  series: InsightsSeriesItem[]
): { start: Date; end: Date } | null {
  if (series.length === 0) {
    return null
  }

  return {
    start: parseISO(series[0].date),
    end: parseISO(series[series.length - 1].date),
  }
}
