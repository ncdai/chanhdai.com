import { Bar, Chip, Heading } from "./primitives"

export function Experience01Mockup() {
  return (
    <div className="flex size-full flex-col p-3">
      <div className="border-x border-line">
        <div className="border-y border-line p-2">
          <Heading className="h-2.5 w-1/3" />
        </div>

        <div className="border-b border-line p-2">
          <Company />
          <Position bullets={2} chips={5} isLast />
        </div>

        <div className="border-b border-line p-2">
          <Company />
          <Position bullets={0} chips={7} />
          <Position bullets={0} chips={3} isLast />
        </div>
      </div>
    </div>
  )
}

function Company() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="size-3 rounded-full bg-foreground" />
      <Heading className="h-1.5 w-12" />
      <div className="size-1.5 rounded-full bg-sky-500" />
    </div>
  )
}

function Position({
  bullets,
  chips,
  isLast = false,
}: {
  bullets: number
  chips: number
  isLast?: boolean
}) {
  return (
    <div className="mt-1.5 flex gap-1.5">
      <div className="flex flex-col items-center gap-1">
        <div className="size-3 shrink-0 rounded-xs border border-border bg-muted" />
        {/* The connector only links to the next position, so the last one has none. */}
        {!isLast && <div className="w-px flex-1 bg-line" />}
      </div>

      <div className="flex-1 space-y-1.5 pt-0.5 pb-1">
        <Bar className="w-1/3 bg-muted-foreground/70" />
        <div className="flex gap-1">
          <Bar className="h-0.75 w-4" />
          <Bar className="h-0.75 w-6" />
          <Bar className="h-0.75 w-3" />
        </div>

        {bullets > 0 && (
          <div className="space-y-1 pl-2">
            {Array.from({ length: bullets }).map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="size-0.75 rounded-full bg-muted-foreground/40" />
                <Bar className="h-0.75 w-1/2" />
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-1">
          {Array.from({ length: chips }).map((_, i) => (
            <Chip key={i} className="w-4" />
          ))}
        </div>
      </div>
    </div>
  )
}
