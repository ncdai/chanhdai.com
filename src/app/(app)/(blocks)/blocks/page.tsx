import { Fragment } from "react"

import { BlockDisplay } from "@/app/(preview)/components/block-display"
import { cn } from "@/lib/utils"

export const dynamic = "force-static"
export const revalidate = false

const FEATURED_BLOCKS = ["hero-01", "blog-02", "blog-01"]

export default function BlocksPage() {
  return (
    <>
      {FEATURED_BLOCKS.map((name) => (
        <Fragment key={name}>
          <BlockDisplay name={name} />
          <Separator />
        </Fragment>
      ))}

      <div className="p-2">
        <div className="rounded-xl border border-dashed p-4">
          <p className="font-mono text-sm text-muted-foreground">
            {"//"} More blocks on the way…
          </p>
        </div>
      </div>
    </>
  )
}

function Separator() {
  return (
    <div className="screen-line-before screen-line-after">
      <div
        className={cn(
          "h-8 before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
          "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56"
        )}
      />
    </div>
  )
}
