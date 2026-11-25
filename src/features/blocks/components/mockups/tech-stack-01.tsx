import { cn } from "@/lib/utils"

import { Bar, Heading } from "./primitives"

const GROUPS = [
  { label: "w-6", pills: ["w-11", "w-12", "w-10"] },
  { label: "w-7", pills: ["w-10", "w-11", "w-13", "w-11", "w-10", "w-9"] },
  { label: "w-9", pills: ["w-11", "w-8", "w-12", "w-11", "w-9"] },
  { label: "w-8", pills: ["w-10", "w-10", "w-10", "w-11", "w-8", "w-10"] },
  { label: "w-7", pills: ["w-13", "w-11"] },
]

export function TechStack01Mockup() {
  return (
    <div className="flex size-full flex-col justify-center px-3">
      <div className="border-x border-line">
        <div className="border-y border-line p-2">
          <Heading className="h-2.5 w-10" />
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-16 w-px border-r border-dashed border-line" />

          {GROUPS.map((group, i) => (
            <div
              key={i}
              className="grid grid-cols-[--spacing(16)_1fr] items-start border-b border-line py-2"
            >
              <div className="flex h-3 items-center gap-1 pl-2">
                <Bar className="w-2 bg-muted-foreground/40" />
                <Bar className={cn("bg-muted-foreground/70", group.label)} />
              </div>

              <div className="flex flex-wrap gap-1 px-2">
                {group.pills.map((width, j) => (
                  <div
                    key={j}
                    className={cn(
                      "h-3 rounded-full bg-muted/50 inset-ring-1 inset-ring-border",
                      width
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
