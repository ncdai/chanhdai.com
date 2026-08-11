import { cn } from "@/lib/utils"

// Kept under the IntroItem* slot naming; the tile itself is shared site-wide.
export { IconTile as IntroItemIcon } from "@/components/ui/icon-tile"

export function IntroItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-4 font-mono text-sm", className)}
      {...props}
    />
  )
}

export function IntroItemContent({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("text-balance", className)} {...props} />
}

export function IntroItemLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={cn("link", className)}
      target="_blank"
      rel="noopener"
      {...props}
    />
  )
}
