"use client"

import { use } from "react"
import { format } from "date-fns"
import { LoaderIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import type { Activity } from "@/registry/components/contribution-graph"
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/registry/components/contribution-graph"

export function GitHubContributionGraph({
  contributions,
}: {
  contributions: Promise<Activity[]>
}) {
  const data = use(contributions)

  return (
    <ContributionGraph
      className="mx-auto gap-4 py-4"
      data={data}
      blockSize={12}
      blockMargin={2}
      blockRadius={0}
      aria-label="GitHub Contributions Graph"
    >
      <ContributionGraphCalendar
        className="px-4 **:data-[slot=month-labels]:text-muted-foreground"
        title="GitHub Contributions"
        aria-hidden
      >
        {({ activity, dayIndex, weekIndex }) => (
          <Tooltip>
            <TooltipTrigger
              render={
                <g>
                  <ContributionGraphBlock
                    activity={activity}
                    dayIndex={dayIndex}
                    weekIndex={weekIndex}
                  />
                </g>
              }
            />
            <TooltipContent className="font-sans">
              <p>
                {activity.count} contribution{activity.count > 1 ? "s" : null}{" "}
                on {format(new Date(activity.date), "dd.MM.yyyy")}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </ContributionGraphCalendar>

      <ContributionGraphFooter className="gap-4 px-4 leading-none">
        <ContributionGraphTotalCount>
          {({ totalCount }) => (
            <div className="text-muted-foreground">
              {totalCount.toLocaleString("en")} contributions in the past 365
              days.
            </div>
          )}
        </ContributionGraphTotalCount>

        <ContributionGraphLegend aria-hidden />
      </ContributionGraphFooter>
    </ContributionGraph>
  )
}

export function GitHubContributionFallback() {
  return (
    <div className="flex h-45 w-full items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  )
}
