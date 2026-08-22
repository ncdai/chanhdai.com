import { cn } from "@/lib/utils"

import { Avatar, Bar } from "./primitives"

export function Team01Mockup() {
  return (
    <div className="flex size-full items-center p-3">
      <div className="grid w-full grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-sm border border-border py-3",
              // One card carries the glow so the hover effect is visible at a glance.
              i === 1 &&
                "border-foreground/30 shadow-[0_0_14px_-2px] shadow-foreground/25"
            )}
          >
            <Avatar className="size-5" />
            <div className="flex w-full flex-col items-center gap-1">
              <Bar className="w-1/2 bg-muted-foreground/70" />
              <Bar className="h-0.75 w-2/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
