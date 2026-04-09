import { cn } from "@/lib/utils"

import { BlocksNav } from "./blocks-nav"

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div
        className={cn(
          "screen-line-bottom h-8",
          "before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
          "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56"
        )}
      />

      <div className="screen-line-bottom px-4">
        <h1 className="text-3xl leading-none font-semibold tracking-tight">
          Blocks
        </h1>
      </div>

      <div className="screen-line-bottom p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          A collection of beautifully designed, production-ready blocks.
        </p>
      </div>

      <div className="no-scrollbar max-w-full overflow-x-auto scroll-fade-effect-x p-4 whitespace-nowrap">
        <BlocksNav />
      </div>

      <div className="screen-line-top screen-line-bottom">
        <div
          className={cn(
            "h-8 before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
            "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56"
          )}
        />
      </div>

      {children}

      <div className="p-2">
        <div className="relative border p-4">
          <p className="font-mono text-sm text-muted-foreground">
            More blocks on the way…
          </p>

          <div className="*:absolute *:flex *:size-2 *:border *:bg-background dark:*:border-border">
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
