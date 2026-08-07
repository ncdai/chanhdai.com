"use client"

import { use } from "react"
import { format, parseISO } from "date-fns"
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
import { SOCIAL } from "@/features/portfolio/data/social-links"

export function GitHubContributionGraph({
  contributions,
}: {
  contributions: Promise<Activity[]>
}) {
  const data = use(contributions)

  if (data.length === 0) {
    return null
  }

  return (
    <figure>
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
                  on {format(parseISO(activity.date), "dd.MM.yyyy")}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </ContributionGraphCalendar>

        <ContributionGraphFooter className="gap-4 px-4 leading-none">
          <ContributionGraphTotalCount>
            {({ totalCount }) => (
              <div className="whitespace-normal text-muted-foreground tabular-nums">
                {totalCount.toLocaleString("en")} contributions{" "}
                <span className="whitespace-nowrap">
                  ({format(parseISO(data[0].date), "dd.MM.yyyy")} –{" "}
                  {format(parseISO(data[data.length - 1].date), "dd.MM.yyyy")})
                </span>
              </div>
            )}
          </ContributionGraphTotalCount>

          <ContributionGraphLegend aria-hidden />
        </ContributionGraphFooter>
      </ContributionGraph>

      <figcaption className="screen-line-top px-4 py-3 text-center text-sm text-balance text-muted-foreground">
        FIG_002. Daily contribution activity. Source:{" "}
        <a
          href={SOCIAL.github.href}
          className="link-underline"
          target="_blank"
          rel="noopener"
        >
          GitHub
        </a>
        .
      </figcaption>
    </figure>
  )
}

export function GitHubContributionFallback() {
  return (
    <div className="flex h-45 w-full items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  )
}
