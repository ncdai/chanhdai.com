import Image from "next/image"

import { Tag } from "@/components/ui/tag"
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
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
      )}
      href={addQueryParams(item.url, UTM_PARAMS)}
      target="_blank"
      rel="noopener sponsored"
    >
      {item.type === "organization" ? (
        <item.logo
          className="w-full max-w-80"
          aria-label={`${item.name} logo`}
        />
      ) : (
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 px-4">
          <div className="relative row-span-2 size-10 shrink-0">
            <Image
              className="size-10 rounded-full select-none"
              src={item.avatar}
              alt={`${item.name} avatar`}
              width={40}
              height={40}
              unoptimized
            />
            <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/15" />
          </div>

          <div className="flex items-center gap-2 text-base leading-5 font-semibold text-foreground">
            {item.name}
            {item.tier && (
              <Tag className="h-5 rounded-md font-normal capitalize">
                {item.tier}
              </Tag>
            )}
          </div>

          <div className="text-xs leading-5 text-muted-foreground">
            {item.tagline}
          </div>
        </div>
      )}
    </a>
  )
}
