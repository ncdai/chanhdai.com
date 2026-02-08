import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { ComponentIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { getPostsByCategory } from "@/features/blog/data/posts"
import { cn } from "@/lib/utils"

import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel"

export function Components() {
  const posts = getPostsByCategory("components")

  return (
    <Panel id="components">
      <PanelHeader>
        <PanelTitle>
          Components
          <PanelTitleSup>({posts.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <div className="relative py-4">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-2 max-sm:hidden sm:grid-cols-2 md:grid-cols-3">
          <div className="border-r border-edge" />
          <div className="border-l border-edge md:border-x" />
          <div className="border-l border-edge max-md:hidden" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {posts.slice(0, 9).map((post) => (
            <Link
              key={post.slug}
              href={`/components/${post.slug}`}
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
                  variant={post.metadata.icon}
                  aria-hidden
                />
                {post.metadata.new && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center">
                    <span className="flex size-2 rounded-sm bg-info ring-1 ring-background" />
                    <span className="sr-only">New</span>
                  </span>
                )}
              </div>

              <h2 className="leading-snug font-medium text-balance underline-offset-4 group-hover:underline">
                {post.metadata.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>

      <div className="screen-line-before flex justify-center py-2">
        <Button className="px-3" variant="default" asChild>
          <Link href="/components">
            All Components
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </Panel>
  )
}
