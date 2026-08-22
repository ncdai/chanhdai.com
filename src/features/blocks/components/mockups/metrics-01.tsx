import { cn } from "@/lib/utils"

import { Bar, Heading } from "./primitives"

const METRICS = [{ up: true }, { up: true }, { up: false }, { up: true }]

export function Metrics01Mockup() {
  return (
    <div className="flex size-full flex-col justify-center px-3">
      <div className="border-x border-line">
        <div className="flex items-start gap-1 border-y border-line p-2">
          <Heading className="h-2.5 w-12" />
          <Bar className="h-0.75 w-6" />
        </div>

        <div className="grid grid-cols-4 border-b border-line">
          {METRICS.map((metric, i) => (
            <div
              key={i}
              className="space-y-1.5 border-line p-2 not-last:border-r"
            >
              <div className="flex items-center justify-between">
                <Bar className="h-0.75 w-1/2" />
                <Bar
                  className={cn(
                    "h-0.75 w-3",
                    metric.up
                      ? "bg-green-700 dark:bg-green-500"
                      : "bg-red-700 dark:bg-red-400"
                  )}
                />
              </div>
              <Heading className="h-1.5 w-2/5" />
            </div>
          ))}
        </div>

        <div className="relative h-24 border-b border-line">
          <div className="absolute inset-x-3 inset-y-2 flex flex-col justify-between">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border-t border-dashed border-line" />
            ))}
          </div>

          <svg
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className="absolute inset-x-3 inset-y-2 size-auto h-[calc(100%-1rem)] w-[calc(100%-1.5rem)]"
            fill="none"
          >
            <path
              d="M0 30C6 30 8 22 14 24S22 33 28 28 34 14 40 16 46 26 52 22 58 10 64 12 70 20 76 16 82 6 88 8 94 14 100 6"
              className="stroke-(--chart-line-primary)"
              strokeWidth="1.25"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
