import { cn } from "@/lib/utils"

type DivProps = React.ComponentProps<"div">

export function Bar({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("h-1 rounded-full bg-muted-foreground/40", className)}
      {...props}
    />
  )
}

export function Heading({ className, ...props }: DivProps) {
  return (
    <div className={cn("h-2 rounded-xs bg-foreground", className)} {...props} />
  )
}

export function Box({ className, ...props }: DivProps) {
  return <div className={cn("rounded-xs bg-muted", className)} {...props} />
}

export function Avatar({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("rounded-full bg-muted-foreground/30", className)}
      {...props}
    />
  )
}

export function Button({
  variant = "primary",
  className,
  ...props
}: DivProps & { variant?: "primary" | "outline" }) {
  return (
    <div
      className={cn(
        "h-3 w-10 rounded-xs",
        variant === "primary"
          ? "bg-foreground"
          : "border border-border bg-background",
        className
      )}
      {...props}
    />
  )
}

export function Chip({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("h-1.5 w-5 rounded-xs bg-muted-foreground/20", className)}
      {...props}
    />
  )
}

export function Input({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("h-3.5 rounded-xs border border-border", className)}
      {...props}
    />
  )
}

export function MarqueeFade({
  side,
  className,
  ...props
}: DivProps & { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 w-10 from-background to-transparent",
        side === "left" ? "left-0 bg-linear-to-r" : "right-0 bg-linear-to-l",
        className
      )}
      {...props}
    />
  )
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 8 8"
      className={cn("size-1.5 stroke-muted-foreground", className)}
      fill="none"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6 6 2M3 2h3v3" />
    </svg>
  )
}
