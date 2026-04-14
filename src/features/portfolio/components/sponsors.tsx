import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { PlusIcon } from "@/components/animated-icons/plus"
import { Button } from "@/components/base/ui/button"
import { SPONSORSHIP_URL, UTM_PARAMS } from "@/config/site"
import { SponsorItem } from "@/features/sponsor/components/sponsor-item"
import { SPONSORS } from "@/features/sponsor/data"
import type { SponsorTier } from "@/features/sponsor/types"
import { addQueryParams } from "@/utils/url"

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
          Grateful to the sponsors who make this open-source work possible.
        </PanelDescription>
      </PanelHeader>

      <div className="relative">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-line" />
          <div className="border-l border-line" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURED_SPONSORS.map((item) => (
            <SponsorItem
              key={item.name}
              className="min-h-22.5 [&_svg]:w-full [&_svg]:max-w-75 [&_svg]:shrink-0"
              href={addQueryParams(item.url, UTM_PARAMS)}
              aria-label={`${item.name} logo`}
            >
              <item.logo aria-hidden />
            </SponsorItem>
          ))}

          <SponsorItem
            className="min-h-22.5"
            href={SPONSORSHIP_URL}
            aria-label="Sponsor My Work"
          >
            <PlusIcon
              className="flex size-full items-center justify-center text-muted-foreground"
              size={24}
              aria-hidden
            />
          </SponsorItem>
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
