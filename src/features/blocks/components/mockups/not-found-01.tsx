import { cn } from "@/lib/utils"

import { Bar, Button, Heading } from "./primitives"

const BRICKS = [".XX.XXX.", "X...X..X", "X...X..X", ".XX.XXX."]

export function NotFound01Mockup() {
  return (
    <div className="flex size-full flex-col items-center gap-2 p-3">
      <div className="flex flex-col items-center gap-1.5">
        <div className="size-4 rounded-xs bg-muted" />
        <Heading className="h-1.5 w-12" />
        <div className="flex flex-col items-center gap-1">
          <Bar className="h-0.75 w-20" />
          <Bar className="h-0.75 w-14" />
        </div>
        <Button variant="outline" className="mt-0.5 w-12" />
      </div>

      <div className="relative w-[62%] flex-1 rounded-xs border border-border">
        <div className="absolute inset-x-0 top-1.5 flex flex-col items-center gap-0.5">
          {BRICKS.map((row, r) => (
            <div key={r} className="flex gap-0.5">
              {row.split("").map((cell, c) => (
                <div
                  key={c}
                  className={cn(
                    "h-3 w-3.5 rounded-[1px]",
                    cell === "X" ? "bg-muted-foreground/50" : "bg-transparent"
                  )}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="absolute top-[62%] left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-foreground/70" />
        <div className="absolute bottom-1 left-1/2 h-1 w-7 -translate-x-1/2 rounded-[1px] bg-muted-foreground/70" />
      </div>
    </div>
  )
}
