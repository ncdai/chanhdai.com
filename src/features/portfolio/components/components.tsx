import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/base/ui/button"
import { ComponentIcon } from "@/components/icons"
import { getDocsByCategory } from "@/features/doc/data/documents"
import { cn } from "@/lib/utils"

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

      <div className="relative pt-2">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-2 max-sm:hidden sm:grid-cols-2 md:grid-cols-3">
          <div className="border-r border-edge" />
          <div className="border-l border-edge md:border-x" />
          <div className="border-l border-edge max-md:hidden" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {components.slice(0, 9).map((component) => (
            <Link
              key={component.slug}
              href={`/components/${component.slug}`}
              className={cn(
                "group flex items-center gap-4 p-4 pr-2 transition-[background-color] ease-out hover:bg-accent-muted",
                "max-sm:screen-line-before max-sm:screen-line-after",
                "sm:max-md:nth-[2n+1]:screen-line-before sm:max-md:nth-[2n+1]:screen-line-after",
                "md:nth-[3n+1]:screen-line-before md:nth-[3n+1]:screen-line-after"
              )}
            >
              <div className="relative flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted ring-1 ring-edge ring-offset-1 ring-offset-background">
                <ComponentIcon
                  className="pointer-events-none size-4 text-muted-foreground"
                  variant={component.slug}
                />
                {component.metadata.new && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center">
                    <span className="flex size-2 rounded-sm bg-info ring-1 ring-background" />
                    <span className="sr-only">New</span>
                  </span>
                )}
              </div>

              <h3 className="leading-snug font-medium text-balance">
                {component.metadata.title}
              </h3>
            </Link>
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
