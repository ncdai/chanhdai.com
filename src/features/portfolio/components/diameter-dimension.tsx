import { cn } from "@/lib/utils"
import {
  Dimension,
  DimensionExtensionLine,
  DimensionLine,
} from "@/components/dimension"

/** Expects the circle to fill its positioned parent. */
function DiameterDimension({
  diameter,
  className,
}: {
  diameter: number
  className?: string
}) {
  return (
    <Dimension className={cn("absolute inset-0", className)}>
      <DimensionExtensionLine
        orientation="horizontal"
        className="top-0 right-1/2 -left-8"
      />
      <DimensionExtensionLine
        orientation="horizontal"
        className="top-full right-1/2 -left-8 -translate-y-px"
      />
      <DimensionLine
        orientation="vertical"
        className="absolute inset-y-0 -left-6 -translate-x-1/2"
      >
        Ø{diameter}
      </DimensionLine>
    </Dimension>
  )
}

export { DiameterDimension }
