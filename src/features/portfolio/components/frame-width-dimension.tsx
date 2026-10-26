import { cn } from "@/lib/utils"
import {
  Dimension,
  DimensionExtensionLine,
  DimensionLine,
} from "@/components/dimension"

function FrameWidthDimension({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative hidden h-8 border-x border-x-line min-[49rem]:block",
        className
      )}
    >
      <Dimension className="absolute -inset-x-px inset-y-0">
        <DimensionExtensionLine className="inset-y-1 left-0" />
        <DimensionExtensionLine className="inset-y-1 right-0" />
        <DimensionLine className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          768
        </DimensionLine>
      </Dimension>
    </div>
  )
}

export { FrameWidthDimension }
