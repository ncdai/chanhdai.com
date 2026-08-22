import { Bar, Box, Button, Heading } from "./primitives"

export function Blog01Mockup() {
  return (
    <div className="flex size-full flex-col gap-2 p-3">
      <Heading className="h-2.5 w-10" />

      <div className="grid flex-1 grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 rounded-sm bg-card p-1 shadow-xs ring-1 ring-foreground/10 dark:ring-border"
          >
            <Box className="aspect-2/1 w-full" />
            <Bar className="h-0.75 w-1/2" />
            <Bar className="w-full bg-muted-foreground/70" />
            <Bar className="w-3/4 bg-muted-foreground/70" />
          </div>
        ))}
      </div>

      <Button className="mx-auto w-8" />
    </div>
  )
}
