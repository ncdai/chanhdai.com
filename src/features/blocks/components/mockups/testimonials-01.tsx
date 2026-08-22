import { cn } from "@/lib/utils"

import { Avatar, Bar, MarqueeFade } from "./primitives"

// Cards are w-28 with gap-2. The first row hides half a card; the second
// hides a whole one so its next card sits exactly one gap from the edge.
const ROWS = [
  { offset: "-ml-14", lines: [3, 2, 3, 2] },
  { offset: "-ml-28", lines: [1, 2, 1, 1, 2] },
]

export function Testimonials01Mockup() {
  return (
    <div className="flex size-full flex-col justify-center">
      <div className="relative space-y-2 overflow-hidden">
        {ROWS.map((row, i) => (
          <div key={i} className={cn("flex w-max gap-2", row.offset)}>
            {row.lines.map((lines, j) => (
              <TestimonialCard key={j} lines={lines} />
            ))}
          </div>
        ))}

        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
      </div>
    </div>
  )
}

function TestimonialCard({ lines }: { lines: number }) {
  return (
    <div className="flex w-28 flex-col gap-2 rounded-sm border border-border bg-card p-2">
      <div className="flex-1 space-y-1">
        {Array.from({ length: lines }).map((_, i) => (
          <Bar
            key={i}
            className={cn(
              "bg-muted-foreground/70",
              i === lines - 1 ? "w-3/5" : "w-full"
            )}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <Avatar className="size-3" />
        <div className="flex-1 space-y-1">
          <Bar className="h-0.75 w-1/2 bg-muted-foreground/70" />
          <Bar className="h-0.75 w-3/4" />
        </div>
      </div>
    </div>
  )
}
