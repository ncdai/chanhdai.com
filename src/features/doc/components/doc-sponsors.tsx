import { cn } from "@/lib/utils"
import {
  DocSponsorGrid,
  DocSponsorGridHeading,
  DocSponsorGridItem,
  DocSponsorGridList,
} from "@/features/doc/components/doc-sponsor-grid"
import { RAIL_TIERS } from "@/features/doc/components/doc-sponsors-rail"
import { SPONSORS } from "@/features/sponsor/data"
import { PAID_TIERS } from "@/features/sponsor/types"

const PAID_SPONSORS = SPONSORS.filter((sponsor) => PAID_TIERS.has(sponsor.tier))

const HAS_NON_RAIL_SPONSORS = PAID_SPONSORS.some(
  (sponsor) => !RAIL_TIERS.has(sponsor.tier)
)

export function DocSponsors() {
  return (
    <div className={cn(!HAS_NON_RAIL_SPONSORS && "xl:hidden")}>
      <div className="screen-dashed-line-top before:opacity-80">
        <div className="screen-line-top h-px overflow-x-clip" />
      </div>

      <div className="p-4">
        <DocSponsorGrid aria-labelledby="doc-sponsors-heading">
          <DocSponsorGridHeading id="doc-sponsors-heading" />

          <DocSponsorGridList>
            {PAID_SPONSORS.map((item) => (
              <DocSponsorGridItem
                key={item.name}
                className={cn(
                  "sm:data-[tier=silver]:basis-[calc(33.333%-1px)]",
                  RAIL_TIERS.has(item.tier) && "xl:hidden"
                )}
                sponsor={item}
              />
            ))}
          </DocSponsorGridList>
        </DocSponsorGrid>
      </div>
    </div>
  )
}
