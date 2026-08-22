import type { Registry } from "shadcn/schema"

import { compareBlocksByCreatedAtDesc } from "@/lib/blocks"
import { blocks } from "@/registry/blocks/_registry"

export type Block = Registry["items"][number]

// The registry source (not the generated index) is the only place that
// carries block titles, so listings read from it directly.
export function getBlocks(category?: string): Block[] {
  return blocks
    .filter((block) => !category || block.categories?.includes(category))
    .sort(compareBlocksByCreatedAtDesc)
}
