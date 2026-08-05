"use client"

import { useState } from "react"
import { addQueryParams } from "@/utils/url"
import { XIcon } from "lucide-react"

import { UTM_PARAMS } from "@/config/site"
import { trackEvent } from "@/lib/events"
import { Button } from "@/components/base/ui/button"
import { SPONSORS } from "@/features/sponsor/data"

export function DocSponsors() {
  const [visible, setVisible] = useState(true)

  if (!visible) {
    return null
  }

  return (
    <>
      <div className="screen-dashed-line-top before:opacity-80">
        <div className="screen-line-top h-px overflow-x-clip" />
      </div>

      <div className="p-4">
        <aside
          className="rounded-xl bg-surface p-1 pt-0 inset-ring-1 inset-ring-border/64"
          aria-labelledby="doc-sponsors-heading"
        >
          <div className="flex items-center justify-between pt-1 pb-0.75 pl-3">
            <h2
              id="doc-sponsors-heading"
              className="font-heading text-sm/none font-medium text-muted-foreground"
            >
              Sponsors
            </h2>

            <Button
              aria-label="Close"
              className="size-7 rounded-lg border-none text-muted-foreground"
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                trackEvent({ name: "doc_sponsors_close" })
                setVisible(false)
              }}
            >
              <XIcon />
            </Button>
          </div>

          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {SPONSORS.filter(
              (sponsor) =>
                sponsor.tier === "platinum" ||
                sponsor.tier === "gold" ||
                sponsor.tier === "silver"
            ).map((item) => (
              <li key={item.name}>
                <a
                  className="flex items-center justify-center rounded-[9px] border bg-background text-foreground [&_svg]:w-full [&_svg]:max-w-75 [&_svg]:shrink-0"
                  href={addQueryParams(item.url, UTM_PARAMS)}
                  target="_blank"
                  rel="noopener sponsored"
                  aria-label={`${item.name} logo`}
                >
                  <item.logo aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  )
}
