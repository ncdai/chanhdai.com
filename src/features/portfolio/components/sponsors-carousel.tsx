import { LogosCarousel } from "@/registry/components/logos-carousel"
import { SPONSORS } from "@/features/sponsor/data"

import { HandwrittenArrow, HandwrittenNote } from "./handwritten-note"
import { Panel } from "./panel"

export function SponsorsCarousel() {
  return (
    <Panel className="@container screen-line-bottom-none screen-line-top-none">
      <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-3 *:border-r *:border-dashed *:border-line @2xl:grid-cols-4">
        <div />
        <div />
        <div className="@max-2xl:hidden" />
      </div>

      <div className="flex justify-center">
        <div className="bg-background px-2 py-4">
          <h2 className="text-center text-sm/none font-medium text-muted-foreground">
            Proudly supported by
          </h2>
        </div>
      </div>

      <div className="screen-line-bottom h-px" />

      {/* Both visual renderings below are swapped per breakpoint via
          display:none, which also drops them from the accessibility tree, so
          assistive tech gets this one viewport-independent list of names
          instead. The full linked list lives in <Sponsors />. */}
      <ul className="sr-only">
        {SPONSORS.map((sponsor) => (
          <li key={sponsor.name}>{sponsor.name}</li>
        ))}
      </ul>

      {/* A full rotation runs past seven seconds, far longer than a phone
          spends scrolling by, so narrow viewports get every logo at once
          instead of a wave that only ever reveals a third of them. */}
      <div
        className="grid grid-cols-3 py-2 text-muted-foreground @2xl:hidden"
        aria-hidden
      >
        {SPONSORS.map((sponsor) => (
          <sponsor.logo key={sponsor.name} className="h-auto w-full" />
        ))}
      </div>

      <div className="@max-2xl:hidden" aria-hidden>
        <LogosCarousel className="w-full py-4 text-muted-foreground [--column-count:4]">
          {SPONSORS.map((sponsor) => (
            <sponsor.logo key={sponsor.name} className="h-auto w-full" />
          ))}
        </LogosCarousel>
      </div>

      <HandwrittenNote
        className="top-6 right-full mr-2 hidden w-20 flex-col items-end lg:flex"
        aria-hidden
      >
        <span className="-rotate-6">big thanks</span>
        <HandwrittenArrow className="size-7 -scale-x-100 -rotate-6" />
      </HandwrittenNote>
    </Panel>
  )
}
