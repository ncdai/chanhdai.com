import { Bar, Button, Heading, Input } from "./primitives"

export function Login01Mockup() {
  return (
    <div className="flex size-full items-center justify-center">
      <div className="w-[30%] space-y-2 rounded-md border border-border bg-card p-2.5">
        <div className="space-y-1.5">
          <Heading className="h-1.5 w-1/2" />
          <Bar className="w-3/4" />
        </div>

        <div className="space-y-1 pt-1">
          <Bar className="w-1/6 bg-muted-foreground/70" />
          <Input />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <Bar className="w-1/5 bg-muted-foreground/70" />
            <Bar className="w-1/3" />
          </div>
          <Input />
        </div>

        <div className="space-y-1 pt-1">
          <Button className="w-full" />
          <Button variant="outline" className="w-full" />
        </div>

        <Bar className="mx-auto w-1/2" />
      </div>
    </div>
  )
}
