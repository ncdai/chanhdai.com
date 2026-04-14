import { cn } from "@/lib/utils"

import type { SponsorTier } from "../types"

export function SponsorItem({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "flex min-h-18 items-center justify-center transition-[background-color] ease-out hover:bg-accent-muted",
        "max-sm:screen-line-top max-sm:screen-line-bottom",
        "sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom",
        className
      )}
      target="_blank"
      rel="noopener sponsored"
      {...props}
    />
  )
}

export function SponsorItemLogo({
  className,
  tier,
  ...props
}: React.ComponentProps<"div"> & {
  tier: SponsorTier
}) {
  return (
    <div
      data-tier={tier.replaceAll("_", "-")}
      className={cn(
        "[&_svg]:w-full [&_svg]:max-w-60 [&_svg]:shrink-0 data-[tier=spark-supporter]:[&_svg]:max-w-50",
        className
      )}
      aria-hidden
      {...props}
    />
  )
}
