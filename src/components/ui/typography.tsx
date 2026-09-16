import React from "react"

import { cn } from "@/lib/utils"

function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
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
      className={cn(!isCodeBlock && "not-prose code-inline", className)}
      {...props}
    />
  )
}

export { Code, Prose, ProseMono }
