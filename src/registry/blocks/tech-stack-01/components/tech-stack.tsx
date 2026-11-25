import { cn } from "@/lib/utils"

export function TechStack({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tech-stack"
      className={cn(
        "relative [--badge-height:--spacing(6)] [--label-width:--spacing(48)]",
        className
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-(--label-width) -z-1 w-px border-r border-dashed border-line max-sm:hidden"
        aria-hidden
      />
      {children}
    </div>
  )
}

export function TechStackGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tech-stack-group"
      className={cn(
        "grid items-start gap-y-2 border-b border-line py-4 last:border-none sm:grid-cols-[var(--label-width)_1fr]",
        className
      )}
      {...props}
    />
  )
}

export function TechStackLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tech-stack-label"
      className={cn("pl-4 text-sm/(--badge-height)", className)}
      {...props}
    />
  )
}

export function TechStackIndex({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tech-stack-index"
      className={cn(
        "mr-1.5 font-mono text-muted-foreground/80 select-none",
        className
      )}
      aria-hidden
      {...props}
    />
  )
}

export function TechStackList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="tech-stack-list"
      className={cn("flex flex-wrap gap-1.5 px-4", className)}
      {...props}
    />
  )
}

export function TechStackItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="tech-stack-item"
      className={cn("flex", className)}
      {...props}
    />
  )
}

export function TechStackBadge({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="tech-stack-badge"
      className={cn(
        "flex h-(--badge-height) items-center justify-center gap-1.25 rounded-full bg-muted/50 px-2 font-mono text-xs text-foreground inset-ring-1 inset-ring-border",
        "[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground/80",
        className
      )}
      {...props}
    />
  )
}
