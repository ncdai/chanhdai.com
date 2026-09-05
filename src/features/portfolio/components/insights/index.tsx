import { format } from "date-fns"

import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { getInsights } from "@/features/portfolio/data/insights"

import { InsightsChart } from "./insights-chart"
import { InsightsMetrics } from "./insights-metrics"
import { getPlottedRange } from "./plotted-range"

const ID = "insights"

export async function Insights() {
  const data = await getInsights()

  if (data === null) {
    return null
  }

  const range = getPlottedRange(data.series)

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Insights</a>
          {range && (
            <PanelTitleSup>
              ({format(range.start, "dd.MM")} – {format(range.end, "dd.MM")})
            </PanelTitleSup>
          )}
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <InsightsMetrics summary={data.summary} changes={data.changes} />

      <InsightsChart series={data.series} figureNumber={3} />
    </Panel>
  )
}

export function InsightsSkeleton() {
  return <Panel className="h-90.75" />
}
