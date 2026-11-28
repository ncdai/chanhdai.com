import {
  DocSponsorGrid,
  DocSponsorGridHeading,
  DocSponsorGridItem,
  DocSponsorGridList,
} from "@/features/doc/components/doc-sponsor-grid"
import { SPONSORS } from "@/features/sponsor/data"
import type { SponsorTier } from "@/features/sponsor/types"

// Silver goes to the end of the doc so the rail shows the gap between tiers.
export const RAIL_TIERS = new Set<SponsorTier>(["platinum", "gold"])

const RAIL_SPONSORS = SPONSORS.filter((sponsor) => RAIL_TIERS.has(sponsor.tier))

export function DocSponsorsRail() {
  return (
    <DocSponsorGrid
      className="sticky bottom-4 z-51 mt-2 mr-2 ml-auto w-[calc(100%-(--spacing(6)))] max-w-100 max-xl:hidden"
      aria-labelledby="doc-sponsors-rail-heading"
    >
      <DocSponsorGridHeading id="doc-sponsors-rail-heading" />

      <DocSponsorGridList>
        {RAIL_SPONSORS.map((item) => (
          <DocSponsorGridItem key={item.name} sponsor={item} />
        ))}
      </DocSponsorGridList>
    </DocSponsorGrid>
  )
}
