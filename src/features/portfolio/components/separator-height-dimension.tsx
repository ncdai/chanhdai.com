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
        className="-top-px -right-6 left-full"
      />
      <DimensionExtensionLine
        orientation="horizontal"
        className="-right-6 -bottom-px left-full"
      />
      <DimensionLine
        orientation="vertical"
        className="absolute -inset-y-px -right-5"
      />
      <DimensionValue className="absolute top-1/2 left-full ml-6 -translate-y-1/2">
        {height}
      </DimensionValue>
    </Dimension>
  )
}

export { SeparatorHeightDimension }
