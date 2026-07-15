import { GraduationCapIcon, InfinityIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tag } from "@/components/ui/tag"
import {
  Collapsible,
  CollapsibleChevronsUpDownIcon,
} from "@/components/base/collapsible-animated"
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import { Separator } from "@/components/base/ui/separator"
import { Markdown } from "@/components/markdown"
import type { Education } from "@/features/portfolio/types/education"

export function EducationItem({ item }: { item: Education }) {
  const { start, end } = item.period
  const isOngoing = !end

  return (
    <div className="group/education-item relative before:absolute before:left-3 before:h-full before:w-px before:bg-border">
      <div
        className="pointer-events-none absolute bottom-0 left-3 hidden size-4 bg-background group-last/education-item:flex"
        aria-hidden
      >
        <span className="size-full -translate-y-2.25 rounded-bl-sm border-b border-l" />
      </div>

      <Collapsible defaultOpen={item.isExpanded} disabled={!item.description}>
        <CollapsibleTrigger
          className={cn(
            "group block w-full text-left",
            "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:-z-1 before:rounded-lg before:transition-[background-color] before:ease-out hover:before:bg-accent-muted",
            "outline-none focus-visible:before:inset-ring-2 focus-visible:before:inset-ring-ring/50",
            "data-disabled:before:content-none"
          )}
        >
          <div className="relative z-1 mb-1 flex items-start gap-3 text-base">
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-md",
                "bg-muted text-muted-foreground",
                "border border-muted-foreground/15 ring-1 ring-line ring-offset-1 ring-offset-background",
                "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              )}
            >
              <GraduationCapIcon />
            </div>

            <h3 className="flex-1 font-medium text-balance">{item.school}</h3>

            <div className="shrink-0 text-muted-foreground group-data-disabled:hidden [&_svg]:h-lh [&_svg]:w-4">
              <CollapsibleChevronsUpDownIcon duration={0.15} />
            </div>
          </div>

          <dl className="flex flex-wrap items-center gap-x-2 pl-9 text-sm text-muted-foreground">
            <div>
              <dt className="sr-only">Employment period</dt>
              <dd className="flex items-center gap-0.5 tabular-nums">
                <span>{start}</span>
                <span className="font-mono">—</span>
                {isOngoing ? (
                  <InfinityIcon
                    className="size-4.5 translate-y-[0.5px]"
                    aria-label="Present"
                    strokeWidth={1.5}
                  />
                ) : (
                  <span>{end}</span>
                )}
              </dd>
            </div>

            {item.degree && (
              <>
                <Separator
                  className="data-vertical:h-4 data-vertical:self-center"
                  orientation="vertical"
                  aria-hidden
                />

                <div>
                  <dt className="sr-only">Degree</dt>
                  <dd>{item.degree}</dd>
                </div>
              </>
            )}

            {item.fieldOfStudy && (
              <>
                <Separator
                  className="data-vertical:h-4 data-vertical:self-center"
                  orientation="vertical"
                  aria-hidden
                />

                <div>
                  <dt className="sr-only">Field of study</dt>
                  <dd>{item.fieldOfStudy}</dd>
                </div>
              </>
            )}
          </dl>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden">
          {item.description && (
            <div className="typeset typeset-description pt-3 pb-1 pl-9">
              <Markdown>{item.description}</Markdown>
            </div>
          )}
        </CollapsibleContent>

        {Array.isArray(item.skills) && item.skills.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-3 pl-9">
            {item.skills.map((skill, index) => (
              <li key={index} className="flex">
                <Tag>{skill}</Tag>
              </li>
            ))}
          </ul>
        )}
      </Collapsible>
    </div>
  )
}
