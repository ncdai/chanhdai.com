import { UTM_PARAMS } from "@/config/site"
import { cn } from "@/lib/utils"
import { addQueryParams } from "@/utils/url"

import type { Sponsor } from "../types"

export function SponsorItem({ item }: { item: Sponsor }) {
  return (
    <a
      key={item.name}
      className={cn(
        "flex min-h-20 items-center justify-center transition-[background-color] ease-out hover:bg-accent-muted",
        "max-sm:screen-line-top max-sm:screen-line-bottom",
        "sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom"
      )}
      href={addQueryParams(item.url, UTM_PARAMS)}
      target="_blank"
      rel="noopener sponsored"
    >
      <item.logo className="w-full max-w-80" aria-label={`${item.name} logo`} />
    </a>
  )
}
