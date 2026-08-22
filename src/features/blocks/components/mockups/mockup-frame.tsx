import { cn } from "@/lib/utils"

// Scales a fixed 400x250 canvas to the frame width. The ratio is written two
// ways: Safari miscomputes tan(atan2()) with cqw but supports calc() division,
// Firefox is the opposite.
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
      <div className="h-62.5 w-100 origin-top-left scale-[tan(atan2(100cqw,400px))] supports-[scale:calc(100cqw/400px)]:scale-[calc(100cqw/400px)]">
        {children}
      </div>
    </div>
  )
}
