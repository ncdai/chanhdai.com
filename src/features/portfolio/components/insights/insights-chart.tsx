import { cn } from "@/lib/utils"
import Grid from "@/components/charts/grid"
import LineChart, { Line } from "@/components/charts/line-chart"
import { ChartTooltip } from "@/components/charts/tooltip"
import { PanelHeader, PanelTitle } from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import type { InsightsSeriesItem } from "@/features/portfolio/data/insights"

const ID = "page-views"

export function InsightsChart({ series }: { series: InsightsSeriesItem[] }) {
  return (
    <section id={ID}>
      <InsightsChartHeading />

      {series.length > 0 ? (
        <LineChart
          className={cn(
            "sm:aspect-3/1!",
            "[--chart-1:var(--color-zinc-900)] dark:[--chart-1:var(--color-zinc-100)]"
          )}
          data={series}
          margin={{ top: 16, right: 32, bottom: 40, left: 32 }}
        >
          <Grid horizontal />
          <Line
            dataKey="total_screen_views"
            stroke="var(--chart-1)"
            strokeWidth={2}
          />
          <ChartTooltip rowLabels={{ total_screen_views: "Page views" }} />
        </LineChart>
      ) : (
        <div className="grid aspect-2/1 w-full place-content-center sm:aspect-3/1">
          <p className="text-muted-foreground">No insights available.</p>
        </div>
      )}
    </section>
  )
}

function InsightsChartHeading() {
  return (
    <PanelHeader>
      <PanelTitle>
        <a href={`#${ID}`}>Page views</a>
        <PanelTitleCopy id={ID} />
      </PanelTitle>
    </PanelHeader>
  )
}

export function InsightsChartSkeleton() {
  return (
    <div aria-hidden inert>
      <InsightsChartHeading />
      <div className="aspect-2/1 w-full sm:aspect-3/1" />
    </div>
  )
}
