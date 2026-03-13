import { Fragment } from "react"

import blocks from "@/__registry__/__blocks__.json"
import { BlockDisplay } from "@/components/block-display"
import { cn } from "@/lib/utils"

export const dynamic = "force-static"
export const revalidate = false

export default function BlocksPage() {
  return (
    <>
      {blocks.map((block) => (
        <Fragment key={block.name}>
          <BlockDisplay name={block.name} />
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
