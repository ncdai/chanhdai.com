import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-6 items-center justify-center gap-1 rounded-sm px-1 font-sans text-sm/none font-normal text-muted-foreground select-none",
        "bg-black/5 shadow-[inset_0_-1px_2px] shadow-black/10 dark:bg-white/10 dark:shadow-white/10",
        "[&_svg:not([class*='size-'])]:size-3",
        "in-data-[slot=tooltip-content]:bg-white/20 in-data-[slot=tooltip-content]:text-background in-data-[slot=tooltip-content]:shadow-white/20 dark:in-data-[slot=tooltip-content]:bg-black/10 dark:in-data-[slot=tooltip-content]:shadow-black/10 dark:in-data-[slot=tooltip-content]:text-shadow-xs",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
