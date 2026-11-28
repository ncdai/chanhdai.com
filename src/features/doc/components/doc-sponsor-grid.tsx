import Link from "next/link"
import { addQueryParams } from "@/utils/url"
import { ArrowRightIcon } from "lucide-react"

import { UTM_PARAMS } from "@/config/site"
import { cn } from "@/lib/utils"
import { SponsorItem } from "@/features/sponsor/components/sponsor-item"
import type { Sponsor } from "@/features/sponsor/types"

export function DocSponsorGrid({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border bg-background [&_a]:-outline-offset-2",
        className
      )}
      {...props}
    />
  )
}

export function DocSponsorGridHeading({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "border-b border-line text-xs/none font-medium tracking-wide text-muted-foreground uppercase",
        className
      )}
      {...props}
    >
      <Link
        className="flex h-8 items-center justify-between pr-2 pl-2.5 transition-[background-color,color] ease-out hover:bg-accent-muted hover:text-foreground"
        href="/sponsors"
      >
        Sponsors
        <ArrowRightIcon className="size-3.5" />
      </Link>
    </h2>
  )
}

export function DocSponsorGridList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul className={cn("flex flex-wrap gap-px bg-line", className)} {...props} />
  )
}

export function DocSponsorGridItem({
  className,
  sponsor,
  ...props
}: React.ComponentProps<"li"> & { sponsor: Sponsor }) {
  return (
    <li
      className={cn(
        "min-w-0 grow basis-full bg-background data-[tier=silver]:basis-[calc(50%-1px)] [&_svg]:h-10 [&_svg]:shrink-0 data-[tier=gold]:[&_svg]:h-14 data-[tier=platinum]:[&_svg]:h-18",
        className
      )}
      data-tier={sponsor.tier}
      {...props}
    >
      <SponsorItem
        className="overflow-hidden"
        href={addQueryParams(sponsor.url, UTM_PARAMS)}
        aria-label={`${sponsor.name} logo`}
      >
        <sponsor.logo aria-hidden />
      </SponsorItem>
    </li>
  )
}
