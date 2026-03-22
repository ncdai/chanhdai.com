import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/base/ui/button"
import { SponsorItem } from "@/features/sponsor/components/sponsor-item"
import { SponsorItemPlus } from "@/features/sponsor/components/sponsor-item-plus"
import { SPONSORS } from "@/features/sponsor/data"
import type { SponsorTier } from "@/features/sponsor/types"

import { Panel, PanelDescription, PanelHeader, PanelTitle } from "./panel"

const FEATURED_TIERS = new Set<SponsorTier>([
  "osp",
  "platinum",
  "gold",
  "silver",
])

const FEATURED_SPONSORS = SPONSORS.filter((sponsor) =>
  FEATURED_TIERS.has(sponsor.tier)
)

export function Sponsors() {
  return (
    <Panel id="sponsors">
      <PanelHeader className="after:content-none">
        <PanelTitle>Sponsors</PanelTitle>
        <PanelDescription>
          Grateful for the support that helps me grow and maintain high-quality
          projects.
        </PanelDescription>
      </PanelHeader>

      <div className="relative">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-line" />
          <div className="border-l border-line" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURED_SPONSORS.map((item) => (
            <SponsorItem key={item.name} item={item} />
          ))}

          <SponsorItemPlus />
        </div>
      </div>

      <div className="-mt-px flex justify-center py-2">
        <Button
          className="gap-2 border-none pr-2.5 pl-3"
          size="sm"
          nativeButton={false}
          render={<Link href="/sponsors" />}
        >
          All Sponsors
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}
