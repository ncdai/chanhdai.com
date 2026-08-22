import { cn } from "@/lib/utils"

// Mockups are drawn on a fixed 400x250 canvas and scaled to the frame width,
// so their fixed px details keep the same proportions at every breakpoint.
// tan(atan2(a, b)) is the CSS trick for dividing two lengths into a number.
export function MockupFrame({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "@container aspect-16/10 overflow-hidden bg-background",
        className
      )}
      {...props}
    >
      <div className="h-62.5 w-100 origin-top-left scale-[tan(atan2(100cqw,400px))]">
        {children}
      </div>
    </div>
  )
}
