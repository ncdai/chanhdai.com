import { cn } from "@/lib/utils"

import { ArrowUpRight, Bar } from "./primitives"

const LABEL_WIDTHS = ["w-2", "w-6", "w-7", "w-7", "w-6", "w-7"]

export function SocialLinks01Mockup() {
  return (
    <div className="flex size-full flex-col justify-center px-3">
      <div className="grid grid-cols-3 border border-line">
        {LABEL_WIDTHS.map((width, i) => (
          <div
            key={i}
            className="relative flex items-center gap-1.5 border-line p-2 not-nth-[3n]:border-r nth-[-n+3]:border-b"
          >
            <div className="size-3.5 rounded-xs bg-foreground" />
            <Bar className={cn("bg-muted-foreground/70", width)} />
            <ArrowUpRight className="absolute top-1/2 right-2 -translate-y-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
