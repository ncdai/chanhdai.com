import type { Route } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/base/ui/button"
import {
  ComponentItem,
  ComponentItemDot,
  ComponentItemIcon,
  ComponentItemTitle,
} from "@/app/(app)/(pages)/components/component-item"
import { ComponentIcon } from "@/features/doc/components/component-icon"
import { getComponentDocs } from "@/features/doc/data/documents"

import { HandwrittenArrow, HandwrittenNote } from "./handwritten-note"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const ID = "components"

export function Components() {
  const components = getComponentDocs()

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Components</a>
          <PanelTitleSup>({components.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <HandwrittenNote
        className="top-4 left-full ml-1 hidden w-36 flex-col items-start xl:flex"
        aria-hidden
      >
        <span className="-rotate-3">free, copy &amp; paste</span>
        <HandwrittenArrow className="mt-2 -rotate-3" />
      </HandwrittenNote>

      <div className="relative pt-4">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 max-sm:hidden sm:grid-cols-2 md:grid-cols-3">
          <div className="border-r border-line" />
          <div className="border-r border-line max-md:hidden" />
        </div>

        <div className="screen-line-bottom h-px" />

        <ul className="grid grid-cols-1 overflow-x-clip sm:grid-cols-2 md:grid-cols-3">
          {components.slice(0, 12).map((c) => (
            <li
              key={c.slug}
              className={cn(
                "max-sm:screen-line-bottom",
                "sm:max-md:nth-[2n+1]:screen-line-bottom",
                "md:nth-[3n+1]:screen-line-bottom"
              )}
            >
              <ComponentItem href={`/components/${c.slug}` as Route}>
                <ComponentItemIcon>
                  <ComponentIcon slug={c.slug} />
                  {(c.metadata.new || c.metadata.updated) && (
                    <ComponentItemDot
                      aria-label={c.metadata.new ? "New" : "Updated"}
                    />
                  )}
                </ComponentItemIcon>
                <ComponentItemTitle as="h3">
                  {c.metadata.title}
                </ComponentItemTitle>
              </ComponentItem>
            </li>
          ))}
        </ul>

        <div className="screen-line-top h-4 before:-top-px" />
      </div>

      <div className="screen-line-top flex justify-center py-4">
        <Button
          className="gap-2 pr-2.5 pl-3 shadow-[inset_0_0_1px] shadow-foreground/20"
          variant="secondary"
          size="sm"
          nativeButton={false}
          render={<Link href="/components" />}
        >
          All components
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}
