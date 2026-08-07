import { LogosCarousel } from "@/registry/components/logos-carousel"
import { SPONSORS } from "@/features/sponsor/data"

import { HandwrittenArrow, HandwrittenNote } from "./handwritten-note"
import { Panel } from "./panel"

export function SponsorsCarousel() {
  return (
    // Decorative. The full sponsor list with links lives in <Sponsors />, so
    // this is hidden from assistive tech to avoid duplicating it. Keep it free
    // of focusable content.
    <Panel className="@container screen-line-top-none" aria-hidden>
      <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-3 *:border-r *:border-dashed *:border-line @2xl:grid-cols-4">
        <div />
        <div />
        <div className="@max-2xl:hidden" />
      </div>

      <HandwrittenNote className="top-6 right-full mr-2 hidden w-20 flex-col items-end lg:flex">
        <span className="-rotate-6">big thanks</span>
        <HandwrittenArrow className="size-7 -scale-x-100 -rotate-6" />
      </HandwrittenNote>

      <div className="flex justify-center">
        <p className="flex h-10 items-center bg-background px-2 text-center text-xs/none font-semibold tracking-wider text-muted-foreground uppercase">
          Proudly supported by
        </p>
      </div>

      <div className="screen-line-bottom h-px" />

      {/* A full rotation runs past seven seconds, far longer than a phone
          spends scrolling by, so narrow viewports get every logo at once
          instead of a wave that only ever reveals a third of them. */}
      <div className="grid grid-cols-3 py-2 text-muted-foreground @2xl:hidden">
        {SPONSORS.map((sponsor) => (
          <sponsor.logo key={sponsor.name} className="h-auto w-full" />
        ))}
      </div>

      <LogosCarousel className="w-full py-4 text-muted-foreground [--column-count:4] @max-2xl:hidden">
        {SPONSORS.map((sponsor) => (
          <sponsor.logo key={sponsor.name} className="h-auto w-full" />
        ))}
      </LogosCarousel>
    </Panel>
  )
}
