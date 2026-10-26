import { formatCompactNumber, formatNumber } from "@/utils/format"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Panel } from "@/features/portfolio/components/panel"
import { NUMBERS } from "@/features/portfolio/data/numbers"

const ID = "numbers"

export function Numbers() {
  const { githubStars, npmYearlyDownloads, xFollowers, yearlyPageViews } =
    NUMBERS

  return (
    <Panel id={ID} className="screen-line-bottom-none">
      <div className="h-px" />
      <div className="h-4" />
      <div className="screen-line-bottom h-px" />

      <div className="flex items-center justify-center py-4">
        <h2 className="text-center text-sm/none font-medium tracking-wide text-muted-foreground uppercase">
          Growing with the community
        </h2>
      </div>

      <div className="screen-line-bottom h-px" />

      <dl className="grid gap-4 p-4">
        <Stat label="GitHub stars" value={githubStars} />
        <Stat label="X followers" value={xFollowers} />
        <Stat label="npm downloads / year" value={npmYearlyDownloads} />
        <Stat label="Page views / year" value={yearlyPageViews} />
      </dl>
    </Panel>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-2">
      {/* The leader is a pseudo-element because a `dl` group may only hold
          `dt` and `dd`, leaving no room for a decorative element. */}
      <dt className="flex flex-1 items-baseline gap-2 text-sm/4 after:flex-1 after:translate-y-0.75 after:border-b after:border-dashed after:border-line">
        {label}
      </dt>
      <dd className="text-sm/4 font-medium tabular-nums">
        <Tooltip>
          <TooltipTrigger render={<data value={value} tabIndex={0} />}>
            {formatCompactNumber(value)}
          </TooltipTrigger>
          <TooltipContent className="tabular-nums">
            {formatNumber(value)}
          </TooltipContent>
        </Tooltip>
      </dd>
    </div>
  )
}
