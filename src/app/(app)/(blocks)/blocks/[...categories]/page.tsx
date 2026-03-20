import { Fragment } from "react"

import { BlockDisplay } from "@/app/(preview)/components/block-display"
import { registryCategories } from "@/config/registry"
import { getAllBlockIds } from "@/lib/blocks"
import { cn } from "@/lib/utils"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return registryCategories.map((category) => ({
    categories: [category.slug],
  }))
}

export default async function BlocksPage({
  params,
}: {
  params: Promise<{ categories?: string[] }>
}) {
  const { categories = [] } = await params
  const blockIds = await getAllBlockIds(["registry:block"], categories)

  return (
    <>
      {blockIds.map((blockId) => (
        <Fragment key={blockId}>
          <BlockDisplay name={blockId} />
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
    <div className="screen-line-top screen-line-bottom">
      <div
        className={cn(
          "h-8 before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
          "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56"
        )}
      />
    </div>
  )
}
