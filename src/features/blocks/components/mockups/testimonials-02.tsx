import { cn } from "@/lib/utils"

import { Avatar, Bar, Heading, MarqueeFade } from "./primitives"

const ROWS = [
  { offset: "-ml-[14%]", lines: [3, 2, 3, 2] },
  { offset: "-ml-[30%]", lines: [1, 2, 1, 1, 2] },
]

export function Testimonials02Mockup() {
  return (
    <div className="flex size-full flex-col justify-center px-3">
      <div className="border-x border-line">
        <div className="border-y border-line p-2">
          <Heading className="h-2 w-1/3" />
        </div>
        <div className="border-b border-line p-2">
          <Bar className="w-1/2" />
        </div>

        {/* Fades live inside each row so the row borders stay unfaded,
            mirroring how the real block wraps each marquee. */}
        {ROWS.map((row, i) => (
          <div
            key={i}
            className="relative overflow-hidden border-b border-line"
          >
            <div className={cn("flex w-max", row.offset)}>
              {row.lines.map((lines, j) => (
                <TestimonialCell key={j} lines={lines} />
              ))}
            </div>

            <MarqueeFade side="left" />
            <MarqueeFade side="right" />
          </div>
        ))}
      </div>
    </div>
  )
}

function TestimonialCell({ lines }: { lines: number }) {
  return (
    <div className="flex w-28 flex-col gap-2 border-r border-line p-2">
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
