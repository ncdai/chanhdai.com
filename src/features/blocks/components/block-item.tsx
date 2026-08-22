import Link from "next/link"

import type { Block } from "@/features/blocks/data/blocks"

import { BLOCK_MOCKUPS } from "./mockups"
import { MockupFrame } from "./mockups/mockup-frame"

type HeadingTypes = "h2" | "h3" | "h4"

export function BlockItem({
  block,
  headingAs,
}: {
  block: Block
  headingAs?: HeadingTypes
}) {
  const Heading = headingAs ?? "h2"
  const Mockup = BLOCK_MOCKUPS[block.name]
  const category = block.categories?.[0]

  return (
    <div className="group/block relative flex h-full flex-col gap-2 p-2 transition-[background-color] ease-out hover:bg-accent-muted">
      {Mockup && (
        <div className="relative select-none [--image-radius:var(--radius-xl)]">
          <MockupFrame className="rounded-(--image-radius)">
            <Mockup />
          </MockupFrame>
          <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
        </div>
      )}

      <div className="flex flex-col gap-1 p-2">
        <Heading className="text-lg leading-snug font-medium text-balance">
          <Link href={`/blocks/${category}/${block.name}`}>
            <span className="absolute inset-0" aria-hidden />
            {block.title}
          </Link>
        </Heading>

        {block.description && (
          <p className="text-sm text-muted-foreground">{block.description}</p>
        )}
      </div>
    </div>
  )
}
