import { cn } from "@/lib/utils"

type Orientation = "horizontal" | "vertical"

function Dimension({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dimension"
      className={cn(
        "pointer-events-none text-dimension select-none",
        className
      )}
      aria-hidden
      {...props}
    />
  )
}

/** Omit children when the span is too short and place a `DimensionValue` outside. */
function DimensionLine({
  orientation = "horizontal",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { orientation?: Orientation }) {
  const isVertical = orientation === "vertical"

  return (
    <div
      data-slot="dimension-line"
      data-orientation={orientation}
      className={cn(
        "flex items-center",
        isVertical ? "flex-col py-px" : "px-px",
        className
      )}
      {...props}
    >
      <DimensionArrow orientation={orientation} />
      <div className={cn("flex-1 bg-current", isVertical ? "w-px" : "h-px")} />
      {children != null && (
        <DimensionValue className={isVertical ? "py-1" : "px-1"}>
          {children}
        </DimensionValue>
      )}
      <div className={cn("flex-1 bg-current", isVertical ? "w-px" : "h-px")} />
      <DimensionArrow
        orientation={orientation}
        className={isVertical ? "-scale-y-100" : "-scale-x-100"}
      />
    </div>
  )
}

/** Vertical by default: it runs perpendicular to a horizontal `DimensionLine`. */
function DimensionExtensionLine({
  orientation = "vertical",
  className,
  ...props
}: React.ComponentProps<"div"> & { orientation?: Orientation }) {
  return (
    <div
      data-slot="dimension-extension-line"
      data-orientation={orientation}
      className={cn(
        "absolute bg-current",
        orientation === "vertical" ? "w-px" : "h-px",
        className
      )}
      {...props}
    />
  )
}

function DimensionValue({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dimension-value"
      className={cn(
        "font-mono text-xs/none text-dimension-foreground tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function DimensionArrow({
  orientation,
  className,
}: {
  orientation: Orientation
  className?: string
}) {
  const isVertical = orientation === "vertical"

  return (
    <svg
      className={cn("shrink-0", className)}
      width={isVertical ? 7 : 9}
      height={isVertical ? 9 : 7}
      viewBox={isVertical ? "0 0 7 9" : "0 0 9 7"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinejoin="round"
    >
      {/* Half-pixel points keep the 1px outline crisp. */}
      <path d={isVertical ? "M3.5.5 6.5 8.5h-6Z" : "M.5 3.5 8.5.5v6Z"} />
    </svg>
  )
}

export { Dimension, DimensionExtensionLine, DimensionLine, DimensionValue }
