import { BoxIcon, InfinityIcon, LinkIcon } from "lucide-react"
import Image from "next/image"

import {
  Collapsible,
  CollapsibleChevronsIcon,
} from "@/components/base/collapsible-animated"
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { Markdown } from "@/components/markdown"
import { Tag } from "@/components/ui/tag"
import { ProseMono } from "@/components/ui/typography"
import { UTM_PARAMS } from "@/config/site"
import { addQueryParams } from "@/utils/url"

import type { Project } from "../../types/projects"

export function ProjectItem({
  className,
  project,
}: {
  className?: string
  project: Project
}) {
  const { start, end } = project.period
  const isOngoing = !end
  const isSinglePeriod = end === start

  return (
    <Collapsible className={className} defaultOpen={project.isExpanded}>
      <div className="flex items-center hover:bg-accent-muted">
        {project.logo ? (
          <Image
            src={project.logo}
            alt={project.title}
            width={32}
            height={32}
            quality={100}
            className="mx-4 flex size-6 shrink-0 select-none dark:grayscale"
            unoptimized
            aria-hidden="true"
          />
        ) : (
          <div
            className="mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-edge ring-offset-1 ring-offset-background select-none"
            aria-hidden="true"
          >
            <BoxIcon className="size-4" />
          </div>
        )}

        <div className="flex-1 border-l border-dashed border-edge">
          <CollapsibleTrigger className="flex w-full items-center gap-2 p-4 pr-2 text-left">
            <div className="flex-1">
              <h3 className="mb-1 leading-snug font-medium text-balance">
                {project.title}
              </h3>

              <dl className="text-sm text-muted-foreground">
                <dt className="sr-only">Period</dt>
                <dd className="flex items-center gap-0.5">
                  <span>{start}</span>
                  {!isSinglePeriod && (
                    <>
                      <span className="font-mono">—</span>
                      {isOngoing ? (
                        <>
                          <InfinityIcon
                            className="size-4.5 translate-y-[0.5px]"
                            aria-hidden
                          />
                          <span className="sr-only">Present</span>
                        </>
                      ) : (
                        <span>{end}</span>
                      )}
                    </>
                  )}
                </dd>
              </dl>
            </div>

            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    className="relative flex size-6 shrink-0 items-center justify-center text-muted-foreground after:absolute after:-inset-2 hover:text-foreground"
                    href={addQueryParams(project.link, UTM_PARAMS)}
                    target="_blank"
                    rel="noopener"
                  >
                    <LinkIcon className="pointer-events-none size-4" />
                    <span className="sr-only">Open Project Link</span>
                  </a>
                }
              />
              <TooltipContent>
                <p>Open Project Link</p>
              </TooltipContent>
            </Tooltip>

            <div
              className="shrink-0 text-muted-foreground [&_svg]:size-4"
              aria-hidden
            >
              <CollapsibleChevronsIcon duration={0.15} />
            </div>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="overflow-hidden">
        <div className="space-y-4 border-t border-edge p-4">
          {project.description && (
            <ProseMono>
              <Markdown>{project.description}</Markdown>
            </ProseMono>
          )}

          {project.skills.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {project.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <Tag>{skill}</Tag>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
