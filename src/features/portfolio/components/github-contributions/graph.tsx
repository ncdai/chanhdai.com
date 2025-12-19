"use client";

import { format } from "date-fns";
import { LoaderIcon } from "lucide-react";
import { use } from "react";

import {
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import { GITHUB_USERNAME } from "@/config/site";

export function GitHubContributionGraph({
  contributions,
}: {
  contributions: Promise<Activity[]>;
}) {
  const data = use(contributions);

  return (
    <TooltipProvider>
      <ContributionGraph
        className="mx-auto py-2"
        data={data}
        blockSize={11}
        blockMargin={3}
        blockRadius={0}
      >
        <ContributionGraphCalendar
          className="no-scrollbar px-2"
          title="GitHub Contributions"
        >
          {({ activity, dayIndex, weekIndex }) => (
            <TooltipRoot>
              <TooltipTrigger render={<g />}>
                <ContributionGraphBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                />
              </TooltipTrigger>

              <TooltipContent className="font-sans">
                <p>
                  {activity.count} contribution{activity.count > 1 ? "s" : null}{" "}
                  on {format(new Date(activity.date), "dd.MM.yyyy")}
                </p>
              </TooltipContent>
            </TooltipRoot>
          )}
        </ContributionGraphCalendar>

        <ContributionGraphFooter className="px-2">
          <ContributionGraphTotalCount>
            {({ totalCount, year }) => (
              <div className="text-muted-foreground">
                {totalCount.toLocaleString("en")} contributions in {year} on{" "}
                <a
                  className="font-medium underline underline-offset-4"
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                </a>
                .
              </div>
            )}
          </ContributionGraphTotalCount>

          <ContributionGraphLegend />
        </ContributionGraphFooter>
      </ContributionGraph>
    </TooltipProvider>
  );
}

export function GitHubContributionFallback() {
  return (
    <div className="flex h-40.5 w-full items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  );
}
