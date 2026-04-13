import { cn } from "@/lib/utils"

export function DocContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="doc-container"
      className={cn(
        "mx-auto w-full border-x border-line md:max-w-3xl",
        className
      )}
      {...props}
    />
  )
}

export function DocGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="doc-grid"
      className={cn(
        "mx-auto grid w-full grid-cols-1 lg:grid-cols-[1fr_var(--container-3xl)_1fr]",
        className
      )}
      {...props}
    />
  )
}

export function DocLeftCol({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="doc-left-col"
      className={cn("max-lg:hidden", className)}
      {...props}
    />
  )
}

export function DocContentCol(
  props: React.ComponentProps<typeof DocContainer>
) {
  return <DocContainer data-slot="doc-content-col" {...props} />
}

export function DocRightCol({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="doc-right-col"
      className={cn("max-lg:hidden", className)}
      {...props}
    />
  )
}
