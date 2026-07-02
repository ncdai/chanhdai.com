import Link from "next/link"
import { addQueryParams } from "@/utils/url"
import { ArrowRightIcon } from "lucide-react"

import { SPONSORSHIP_URL, UTM_PARAMS } from "@/config/site"
import { cn } from "@/lib/utils"
import { PlusIcon } from "@/components/animated-icons/plus-icon"
import { Button } from "@/components/base/ui/button"
import { SponsorItem } from "@/features/sponsor/components/sponsor-item"
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

const ID = "sponsors"

export function Sponsors() {
  return (
    <Panel id={ID} className="screen-line-bottom-none">
      <PanelHeader>
        <PanelTitle>
          Backed by
          <span className="block sm:hidden" /> the community
        </PanelTitle>

        <PanelDescription>
          Grateful to the sponsors who make this open-source work possible.
        </PanelDescription>
      </PanelHeader>

      <div className="relative py-4">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-line" />
          <div className="border-l border-line" />
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURED_SPONSORS.map((item) => (
            <ListItem key={item.name}>
              <SponsorItem
                className="min-h-22.5 [&_svg]:w-full [&_svg]:max-w-75 [&_svg]:shrink-0"
                href={addQueryParams(item.url, UTM_PARAMS)}
                aria-label={`${item.name} logo`}
              >
                <item.logo aria-hidden />
              </SponsorItem>
            </ListItem>
          ))}

          <ListItem>
            <SponsorItem
              className="h-full min-h-22.5"
              href={SPONSORSHIP_URL}
              aria-label="Sponsor my work"
            >
              <PlusIcon
                className="flex size-full items-center justify-center text-muted-foreground"
                size={24}
                aria-hidden
              />
            </SponsorItem>
          </ListItem>
        </ul>
      </div>

      <div className="screen-line-top flex justify-center py-2">
        <Button
          className="gap-2 pr-2.5 pl-3"
          variant="secondary"
          size="sm"
          nativeButton={false}
          render={<Link href="/sponsors" />}
        >
          All sponsors
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}

function ListItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "max-sm:screen-line-top max-sm:screen-line-bottom",
        "sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom",
        className
      )}
      {...props}
    />
  )
}
