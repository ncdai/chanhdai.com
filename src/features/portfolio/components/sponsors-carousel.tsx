import { LogosCarousel } from "@/registry/components/logos-carousel"
import { SPONSORS } from "@/features/sponsor/data"

import { Panel } from "./panel"

export function SponsorsCarousel() {
  return (
    <Panel className="@container py-4 screen-line-top-none">
      <p className="mb-4 pl-4 text-sm font-medium tracking-wide text-muted-foreground">
        Proudly supported by
      </p>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-0 grid grid-cols-2 items-center *:h-5 *:border-r @2xl:grid-cols-4"
          aria-hidden
        >
          <div className="@max-2xl:h-full @max-2xl:border-line" />
          <div className="@max-2xl:hidden" />
          <div className="@max-2xl:hidden" />
        </div>

        <LogosCarousel className="w-full gap-y-4 [--column-count:2] @2xl:[--column-count:4]">
          {SPONSORS.map((sponsor, index) => (
            <sponsor.logo
              key={index}
              className="h-auto w-full @max-2xl:max-w-48"
              aria-label={sponsor.name}
            />
          ))}
        </LogosCarousel>
      </div>
    </Panel>
  )
}
