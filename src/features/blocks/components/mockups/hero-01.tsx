import { Bar, Button, Heading } from "./primitives"

export function Hero01Mockup() {
  return (
    <div className="flex size-full flex-col p-3">
      <div className="relative flex-1 overflow-hidden border border-line">
        <GoldenSpiral className="absolute inset-0 size-full stroke-line" />

        <div className="absolute top-1/2 left-[6%] w-[44%] -translate-y-1/2 space-y-3">
          <Heading className="h-3.5 w-[85%]" />

          <div className="space-y-1.5">
            <Bar className="w-full" />
            <Bar className="w-4/5" />
          </div>

          <div className="flex gap-1.5">
            <Button className="w-12" />
            <Button variant="outline" className="w-12" />
          </div>

          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="size-2 rounded-xs bg-muted-foreground/40" />
                <Bar className="h-0.75 w-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function GoldenSpiral({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 210"
      preserveAspectRatio="none"
      className={className}
      fill="none"
      strokeWidth="2"
    >
      <path
        d="M210 0v210M210 80.5h130M260 0v80.5M210 50.5h50M240 50.5v30M240 60.5h20"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M239.897 60.3571C239.897 54.894 244.414 50.381 249.882 50.381C255.35 50.381 259.868 54.894 259.868 60.3571C259.868 71.2835 250.833 80.3095 239.897 80.3095C223.493 80.3095 209.941 66.7704 209.941 50.381C209.941 23.0652 232.527 0.499999 259.868 0.5C303.613 0.499995 339.75 36.6043 339.75 80.3095C339.75 151.33 281.027 210 209.941 210C95.1103 210 0.25 115.226 0.25 0.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
