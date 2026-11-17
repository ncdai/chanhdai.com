"use client"

import { SPONSORSHIP_URL } from "@/config/site"
import { trackEvent } from "@/lib/events"
import { Callout } from "@/components/callout"

export function DocSponsorCallout({
  className,
  slug,
}: {
  className?: string
  slug: string
}) {
  return (
    <Callout className={className}>
      Every component here is built and maintained by one person.{" "}
      <span className="md:block">
        If you enjoy using them, you can{" "}
        <a
          href={SPONSORSHIP_URL}
          target="_blank"
          rel="noopener"
          onClick={() => {
            trackEvent({ name: "doc_sponsor_click", properties: { slug } })
          }}
        >
          sponsor my work
        </a>
        .
      </span>
    </Callout>
  )
}
