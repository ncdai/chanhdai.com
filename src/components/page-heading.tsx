import { cn } from "@/lib/utils"

export function PageHeading({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-heading"
      className={cn("group/page-heading", className)}
      {...props}
    >
      {children}
      <div
        data-slot="page-heading-description-line"
        className="screen-line-bottom hidden h-px group-has-data-[slot=page-heading-description]/page-heading:flex"
      />
    </div>
  )
}

export function PageHeadingTagline({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-heading-tagline"
      className={cn(
        "px-4 pb-2 font-heading text-sm/none font-medium tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function PageHeadingTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-heading-title"
      className={cn(
        "screen-line-top screen-line-bottom px-4",
        "font-heading text-3xl font-semibold tracking-tight text-balance",
        className
      )}
      {...props}
    />
  )
}

export function PageHeadingDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-heading-description"
      className={cn(
        "p-4 text-base text-balance text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
