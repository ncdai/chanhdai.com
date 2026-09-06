import { CARBON_ADS } from "@/config/ads"
import { CarbonAds } from "@/components/carbon-ads"

import type { BookmarkListEntry } from "../types"

const AD_POSITION = 2

export function BookmarkList({ entries }: { entries: BookmarkListEntry[] }) {
  const showAd = CARBON_ADS && entries.length > 0

  return (
    <ul>
      {entries.slice(0, AD_POSITION).map(renderEntry)}

      {showAd && (
        <li className="border-b border-line p-4 pb-2 empty:hidden">
          <CarbonAds className="flex justify-center" />
        </li>
      )}

      {entries.slice(AD_POSITION).map(renderEntry)}
    </ul>
  )
}

const renderEntry = (entry: BookmarkListEntry) => (
  <li key={entry.url} className="border-b border-line">
    {entry.card}
  </li>
)
