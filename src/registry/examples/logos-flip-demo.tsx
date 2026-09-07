import { LogosFlip } from "@/registry/components/logos-flip"
import { SPONSORS } from "@/features/sponsor/data"

export default function LogosFlipDemo() {
  return (
    <LogosFlip className="w-full text-foreground [--column-count:2] sm:[--column-count:4]">
      {SPONSORS.map((sponsor) => (
        <sponsor.logo key={sponsor.name} className="h-auto w-full scale-105" />
      ))}
    </LogosFlip>
  )
}
