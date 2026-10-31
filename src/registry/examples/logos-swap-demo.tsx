import { LogosSwap } from "@/registry/components/logos-swap"
import { SPONSORS } from "@/features/sponsor/data"

export default function LogosSwapDemo() {
  return (
    <LogosSwap
      columnCount={6}
      className="w-full max-w-2xl gap-x-2 gap-y-4 text-foreground [--column-count:2] sm:[--column-count:3]"
    >
      {SPONSORS.map((sponsor) => (
        <sponsor.logo key={sponsor.name} className="size-full" />
      ))}
    </LogosSwap>
  )
}
