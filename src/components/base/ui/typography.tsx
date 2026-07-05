import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

function Prose({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        "data-slot": "prose",
        className: cn(
          "prose max-w-none prose-ncdai prose-zinc dark:prose-invert",
          className
        ),
      } as React.ComponentProps<"div">,
      props
    ),
  })
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
