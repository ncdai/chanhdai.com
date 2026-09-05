import { CARBON_ADS } from "@/config/ads"
import { cn } from "@/lib/utils"
import { CarbonAds } from "@/components/carbon-ads"
import type { Block } from "@/features/blocks/data/blocks"

import { BlockItem } from "./block-item"

const AD_POSITION = 2

const itemClassName = cn(
  "max-sm:screen-line-top max-sm:screen-line-bottom",
  "sm:max-lg:nth-[2n+1]:screen-line-top sm:max-lg:nth-[2n+1]:screen-line-bottom",
  "lg:nth-[3n+1]:screen-line-top lg:nth-[3n+1]:screen-line-bottom"
)

export function BlockList({
  blocks,
  showAds = false,
}: {
  blocks: Block[]
  showAds?: boolean
}) {
  const showAd = showAds && CARBON_ADS && blocks.length > 0

  const renderBlock = (block: Block) => (
    <li key={block.name} className={itemClassName}>
      <BlockItem block={block} />
    </li>
  )

  return (
    <div className="relative py-4">
      <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2 lg:grid-cols-3">
        <div className="border-r border-line" />
        <div className="border-l border-line lg:border-r" />
        <div className="border-l border-line max-lg:hidden" />
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.slice(0, AD_POSITION).map(renderBlock)}

        {showAd && (
          <li
            className={cn(
              itemClassName,
              "flex items-center justify-center dot-grid p-2 empty:hidden"
            )}
          >
            <CarbonAds />
          </li>
        )}

        {blocks.slice(AD_POSITION).map(renderBlock)}

        {blocks.length === 0 && (
          <li className="screen-line-top screen-line-bottom p-4">
            <p className="font-mono text-sm">No blocks found.</p>
          </li>
        )}
      </ul>
    </div>
  )
}
