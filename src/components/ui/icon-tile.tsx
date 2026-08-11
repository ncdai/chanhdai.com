import { cn } from "@/lib/utils"

/**
 * Small square chip that frames a leading icon in list items and metadata rows.
 * The layered border + ring is a site-wide visual signature, so it lives here
 * instead of being retyped per call site.
 */
export function IconTile({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="icon-tile"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md select-none",
        "border border-muted-foreground/15 bg-muted text-muted-foreground",
        "ring-1 ring-border/50 ring-offset-1 ring-offset-background dark:ring-line",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}
