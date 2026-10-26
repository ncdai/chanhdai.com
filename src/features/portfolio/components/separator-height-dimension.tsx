import { cn } from "@/lib/utils"
import {
  Dimension,
  DimensionExtensionLine,
  DimensionLine,
  DimensionValue,
} from "@/components/dimension"

function SeparatorHeightDimension({
  height,
  className,
}: {
  height: number
  className?: string
}) {
  return (
    <Dimension className={cn("absolute inset-0 z-2", className)}>
      <DimensionExtensionLine
        orientation="horizontal"
        className="top-0 -right-8 left-full -translate-y-px"
      />
      <DimensionExtensionLine
        orientation="horizontal"
        className="top-full -right-8 left-full"
      />
      <DimensionLine
        orientation="vertical"
        className="absolute -inset-y-px -right-6 translate-x-1/2"
      />
      <DimensionValue className="absolute top-1/2 left-full ml-8 -translate-y-1/2">
        {height}
      </DimensionValue>
    </Dimension>
  )
}

export { SeparatorHeightDimension }
