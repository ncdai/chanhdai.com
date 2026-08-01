import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/base/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import {
  Panel,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { EXPERIENCES } from "@/features/portfolio/data/experiences"
import type { Experience } from "@/features/portfolio/types/experiences"

import { ExperienceItem } from "./experience-item"

const ID = "experience"
const MAX = 3

export function Experiences() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Experience</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        <ExperienceList experiences={EXPERIENCES.slice(0, MAX)} />
      </div>

      {EXPERIENCES.length > MAX && (
        <Collapsible className="group/collapsible">
          <CollapsibleContent render={<div className="pr-2 pl-4" />}>
            <ExperienceList experiences={EXPERIENCES.slice(MAX)} />
          </CollapsibleContent>

          <div className="-mt-px flex items-center justify-center py-4">
            <CollapsibleTrigger
              render={
                <Button
                  className="gap-2 pr-2.5 pl-3 shadow-[inset_0_0_1px] shadow-foreground/20"
                  variant="secondary"
                  size="sm"
                >
                  <span className="hidden group-data-closed/collapsible:block">
                    Show more
                  </span>

                  <span className="hidden group-data-open/collapsible:block">
                    Show less
                  </span>

                  <ChevronDownIcon className="group-data-open/collapsible:rotate-180" />
                </Button>
              }
            />
          </div>
        </Collapsible>
      )}
    </Panel>
  )
}

function ExperienceList({ experiences }: { experiences: Experience[] }) {
  return (
    <>
      {experiences.map((experience) => (
        <ExperienceItem key={experience.id} experience={experience} />
      ))}
    </>
  )
}
