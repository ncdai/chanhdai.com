import Link from "next/link"

import { cn } from "@/lib/utils"
import { IconTile } from "@/components/ui/icon-tile"

export function ComponentItem({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      data-slot="component-item"
      className={cn(
        "flex items-center gap-2 p-4 pr-2 transition-[background-color] ease-out hover:bg-accent-muted",
        className
      )}
      {...props}
    />
  )
}

export function ComponentItemIcon({
  className,
  ...props
}: React.ComponentProps<typeof IconTile>) {
  // Positioned so ComponentItemDot can anchor to the tile corner.
  return <IconTile className={cn("relative", className)} {...props} />
}

const DOT_LABELS = {
  new: "New",
  updated: "Updated",
} as const

export function ComponentItemDot({
  type,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  type: keyof typeof DOT_LABELS
}) {
  return (
    <span
      data-slot="component-item-dot"
      data-type={type}
      className={cn("flex shrink-0 items-center justify-center", className)}
      {...props}
    >
      <span className="flex size-1.5 rounded-sm bg-info" />
      <span className="sr-only">({DOT_LABELS[type]})</span>
    </span>
  )
}

type HeadingTypes = "h2" | "h3" | "h4" | "h5" | "h6"
type HeadingProps<T extends HeadingTypes> = React.ComponentProps<T> & {
  as?: T
}

export function ComponentItemTitle<T extends HeadingTypes = "h2">({
  as,
  className,
  ...props
}: HeadingProps<T>) {
  const Comp = as ?? "h2"

  return (
    <Comp
      data-slot="component-item-title"
      className={cn(
        "line-clamp-1 leading-snug font-medium text-balance",
        className
      )}
      {...props}
    />
  )
}
