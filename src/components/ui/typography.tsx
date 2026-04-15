import { LinkIcon } from "lucide-react"
import { Slot } from "radix-ui"
import React from "react"

import { cn } from "@/lib/utils"

function Prose({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="prose"
      className={cn(
        "prose max-w-none prose-ncdai prose-zinc dark:prose-invert",
        className
      )}
      {...props}
    />
  )
}

function ProseMono({
  className,
  ...props
}: React.ComponentProps<typeof Prose>) {
  return (
    <Prose
      className={cn("prose-sm font-mono text-foreground", className)}
      {...props}
    />
  )
}

function Code({ className, ...props }: React.ComponentProps<"code">) {
  const isCodeBlock = "data-language" in props

  return (
    <code
      data-slot={isCodeBlock ? "code-block" : "code-inline"}
      className={cn(
        // !isCodeBlock && "not-prose rounded-md border bg-muted/50 px-1.5 py-0.5 font-mono text-sm whitespace-pre-wrap in-data-table-nowrap:whitespace-nowrap",
        !isCodeBlock && "not-prose code-inline",
        className
      )}
      {...props}
    />
  )
}

type HeadingTypes = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
type HeadingProps<T extends HeadingTypes> = React.ComponentProps<T> & {
  as?: T
}

function Heading<T extends HeadingTypes = "h1">({
  as,
  className,
  ...props
}: HeadingProps<T>): React.ReactElement {
  const Comp = as ?? "h1"

  if (!props.id) {
    return <Comp className={className} {...props} />
  }

  return (
    <Comp
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    >
      <a href={`#${props.id}`} className="peer not-prose">
        {props.children}
      </a>

      <LinkIcon
        className="size-4 shrink-0 translate-y-px text-muted-foreground opacity-0 transition-opacity peer-hover:opacity-100"
        aria-label="Link to section"
      />
    </Comp>
  )
}

export { Code, Heading, Prose, ProseMono }
