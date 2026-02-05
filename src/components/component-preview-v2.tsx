"use client"

import { RepeatIcon } from "lucide-react"
import { useTheme } from "next-themes"
import React, { useMemo, useState } from "react"

import { Index } from "@/__registry__/index"
import { cn } from "@/lib/utils"

import { CodeCollapsibleWrapper } from "./code-collapsible-wrapper"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Code as CodeInline } from "./ui/typography"
import { OpenInV0Button } from "./v0-open-button"

export function ComponentPreviewV2({
  className,
  name,
  openInV0Url,
  canReplay = false,
  notProse = true,
  codeCollapsible = false,
  remountOnThemeChange = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  name: string
  openInV0Url?: string
  canReplay?: boolean
  notProse?: boolean
  codeCollapsible?: boolean
  remountOnThemeChange?: boolean
}) {
  const { resolvedTheme } = useTheme()

  const [replay, setReplay] = useState(0)

  const Codes = React.Children.toArray(children) as React.ReactElement[]
  const Code = Codes[0]

  const Preview = useMemo(() => {
    const Component = Index[name]?.component

    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component <CodeInline>{name}</CodeInline> not found in registry.
        </p>
      )
    }

    return <Component />
  }, [name])

  return (
    <div
      className={cn("my-[1.25em]", notProse && "not-prose", className)}
      {...props}
    >
      <div data-slot="preview" className="rounded-t-xl border p-2">
        {(canReplay || openInV0Url) && (
          <div data-slot="buttons" className="mb-2 flex justify-end gap-2">
            {canReplay && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="rounded-md"
                    variant="secondary"
                    size="icon-sm"
                    onClick={() => setReplay((v) => v + 1)}
                  >
                    <RepeatIcon />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Replay</p>
                </TooltipContent>
              </Tooltip>
            )}

            {openInV0Url && <OpenInV0Button url={openInV0Url} />}
          </div>
        )}

        <div
          key={`${replay}-${remountOnThemeChange ? (resolvedTheme ?? "system") : "static"}`}
          data-slot="component-preview"
          className="flex min-h-72 items-center justify-center font-sans"
        >
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                Loading...
              </div>
            }
          >
            {Preview}
          </React.Suspense>
        </div>

        {(canReplay || openInV0Url) && <div className="mt-2 h-7" />}
      </div>

      <div className="**:data-rehype-pretty-code-figure:m-0">
        {codeCollapsible ? (
          <CodeCollapsibleWrapper className="my-0 rounded-t-none border border-t-0">
            {Code}
          </CodeCollapsibleWrapper>
        ) : (
          <div className="*:data-rehype-pretty-code-figure:rounded-t-none *:data-rehype-pretty-code-figure:border *:data-rehype-pretty-code-figure:border-t-0">
            {Code}
          </div>
        )}
      </div>
    </div>
  )
}
