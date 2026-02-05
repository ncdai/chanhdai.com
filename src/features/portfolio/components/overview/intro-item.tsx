import { cn } from "@/lib/utils"

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

export function IntroItemIcon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted ring-1 ring-edge ring-offset-1 ring-offset-background",
        "[&_svg]:pointer-events-none [&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      aria-hidden="true"
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
      className={cn("underline-offset-4 hover:underline", className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  )
}
