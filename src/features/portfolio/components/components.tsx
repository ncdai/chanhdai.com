import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import {
  ComponentItem,
  ComponentItemDot,
  ComponentItemIcon,
  ComponentItemTitle,
} from "@/app/(app)/(pages)/components/component-item"
import { Button } from "@/components/base/ui/button"
import { ComponentIcon } from "@/components/icons"
import { getDocsByCategory } from "@/features/doc/data/documents"

import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel"

export function Components() {
  const components = getDocsByCategory("components")

  return (
    <Panel id="components">
      <PanelHeader>
        <PanelTitle>
          Components
          <PanelTitleSup>({components.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <div className="relative">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 max-sm:hidden sm:grid-cols-2 md:grid-cols-3">
          <div className="border-r border-line" />
          <div className="border-r border-line max-md:hidden" />
        </div>

        <div className="screen-line-bottom h-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {components.slice(0, 9).map((c) => (
            <ComponentItem key={c.slug} href={`/components/${c.slug}`}>
              <ComponentItemIcon>
                <ComponentIcon variant={c.slug} />
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
          ))}
        </div>
      </div>

      <div className="-mt-px flex justify-center py-2">
        <Button
          className="gap-2 border-none pr-2.5 pl-3"
          size="sm"
          nativeButton={false}
          render={<Link href="/components" />}
        >
          All Components
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}
