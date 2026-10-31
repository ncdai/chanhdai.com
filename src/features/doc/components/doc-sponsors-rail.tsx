import Link from "next/link"
import { addQueryParams } from "@/utils/url"
import { ArrowRightIcon } from "lucide-react"

import { UTM_PARAMS } from "@/config/site"
import { SponsorItem } from "@/features/sponsor/components/sponsor-item"
import { SPONSORS } from "@/features/sponsor/data"
import { PAID_TIERS } from "@/features/sponsor/types"

const RAIL_SPONSORS = SPONSORS.filter((sponsor) => PAID_TIERS.has(sponsor.tier))

export function DocSponsorsRail() {
  return (
    <section
      className="sticky bottom-4 z-51 mt-2 mr-2 ml-auto w-[calc(100%-(--spacing(6)))] max-w-100 overflow-hidden rounded-xl border bg-background max-xl:hidden [&_a]:-outline-offset-2"
      aria-labelledby="doc-sponsors-rail-heading"
    >
      <h2
        id="doc-sponsors-rail-heading"
        className="border-b border-line text-xs/none font-medium tracking-wide text-muted-foreground uppercase"
      >
        <Link
          className="flex h-8 items-center justify-between pr-2 pl-2.5 transition-[background-color,color] ease-out hover:bg-accent-muted hover:text-foreground"
          href="/sponsors"
        >
          Sponsors
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </h2>

      <ul className="flex flex-wrap gap-px bg-line">
        {RAIL_SPONSORS.map((item) => (
          <li
            key={item.name}
            className="min-w-0 grow basis-full bg-background data-[tier=silver]:basis-[calc(50%-1px)] [&_svg]:h-10 [&_svg]:shrink-0 data-[tier=gold]:[&_svg]:h-14 data-[tier=platinum]:[&_svg]:h-18"
            data-tier={item.tier}
          >
            <SponsorItem
              className="overflow-hidden"
              href={addQueryParams(item.url, UTM_PARAMS)}
              aria-label={`${item.name} logo`}
            >
              <item.logo aria-hidden />
            </SponsorItem>
          </li>
        ))}
      </ul>
    </section>
  )
}
