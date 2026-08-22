import { Bar, Box, Button, Heading } from "./primitives"

export function Blog02Mockup() {
  return (
    <div className="flex size-full flex-col p-3">
      <div className="flex flex-1 flex-col border-x border-line">
        <div className="border-y border-line px-2 py-1.5">
          <Heading className="h-2.5 w-10" />
        </div>

        <div className="border-b border-line px-2 py-1.5">
          <Bar className="w-2/3" />
        </div>

        <div className="grid flex-1 grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-0.75 border-line p-1 not-nth-[3n]:border-r nth-[-n+3]:border-b"
            >
              <Box className="aspect-5/2 w-full" />
              <Bar className="w-full bg-muted-foreground/70" />
              <Bar className="w-3/4 bg-muted-foreground/70" />
              <Bar className="h-0.75 w-1/2" />
            </div>
          ))}
        </div>

        <div className="border-y border-line py-1.5">
          <Button className="mx-auto w-8" />
        </div>
      </div>
    </div>
  )
}
