import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { cn } from "@/lib/utils"

import { BlocksNav } from "./blocks-nav"

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeading>
        <PageHeadingTagline>Blocks</PageHeadingTagline>
        <PageHeadingTitle>
          Beautifully designed, production-ready.
        </PageHeadingTitle>
      </PageHeading>

      <div className="flex h-4" />

      <div className="screen-line-bottom flex h-px" />

      <div className="no-scrollbar max-w-full overflow-x-auto scroll-fade-effect-x p-4 whitespace-nowrap">
        <BlocksNav />
      </div>

      <div className="screen-line-top screen-line-bottom">
        <div
          className={cn(
            "h-8 before:absolute before:left-[-100vw] before:-z-1 before:h-full before:w-[200vw]",
            "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56"
          )}
        />
      </div>

      {children}

      <div className="p-2">
        <div className="relative border border-line p-4">
          <p className="font-mono text-sm text-muted-foreground">
            More blocks on the way…
          </p>

          <div className="*:absolute *:flex *:size-2 *:border *:bg-background dark:*:border-line">
            <div className="top-[-4.5px] left-[-4.5px]" />
            <div className="bottom-[-4.5px] left-[-4.5px]" />
            <div className="top-[-4.5px] right-[-4.5px]" />
            <div className="right-[-4.5px] bottom-[-4.5px]" />
          </div>
        </div>
      </div>
    </>
  )
}
