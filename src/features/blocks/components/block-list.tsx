import { cn } from "@/lib/utils"
import type { Block } from "@/features/blocks/data/blocks"

import { BlockItem } from "./block-item"

export function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <div className="relative py-4">
      <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2 lg:grid-cols-3">
        <div className="border-r border-line" />
        <div className="border-l border-line lg:border-r" />
        <div className="border-l border-line max-lg:hidden" />
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.map((block) => (
          <li
            key={block.name}
            className={cn(
              "max-sm:screen-line-top max-sm:screen-line-bottom",
              "sm:max-lg:nth-[2n+1]:screen-line-top sm:max-lg:nth-[2n+1]:screen-line-bottom",
              "lg:nth-[3n+1]:screen-line-top lg:nth-[3n+1]:screen-line-bottom"
            )}
          >
            <BlockItem block={block} />
          </li>
        ))}

        {blocks.length === 0 && (
          <li className="screen-line-top screen-line-bottom p-4">
            <p className="font-mono text-sm">No blocks found.</p>
          </li>
        )}
      </ul>
    </div>
  )
}
