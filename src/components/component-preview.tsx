"use client"

import { RepeatIcon } from "lucide-react"
import { useTheme } from "next-themes"
import React, { useMemo, useState } from "react"

import { Index } from "@/__registry__/index"
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/base/ui/tabs"
import { cn } from "@/lib/utils"

import { Tooltip, TooltipContent, TooltipTrigger } from "./base/ui/tooltip"
import { CodeCollapsibleWrapper } from "./code-collapsible-wrapper"
import { Button } from "./ui/button"
import { Code as CodeInline } from "./ui/typography"
import { OpenInV0Button } from "./v0-open-button"

export function ComponentPreview({
  className,
  name,
  openInV0Url,
  canReplay = false,
  prose = false,
  codeCollapsible = false,
  remountOnThemeChange = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  name: string
  openInV0Url?: string
  canReplay?: boolean
  prose?: boolean
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
      className={cn("my-[1.25em]", prose === false && "not-prose", className)}
      {...props}
    >
      <Tabs defaultValue="preview" className="gap-4">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsIndicator />
        </TabsList>

        <TabsContent value="preview">
          <div
            data-slot="preview"
            className="rounded-xl border border-line p-2"
          >
            {(canReplay || openInV0Url) && (
              <div data-slot="buttons" className="mb-2 flex justify-end">
                {canReplay && (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          className="border-none"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Replay"
                          onClick={() => setReplay((v) => v + 1)}
                        >
                          <RepeatIcon />
                        </Button>
                      }
                    />
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
                    Loading…
                  </div>
                }
              >
                {Preview}
              </React.Suspense>
            </div>

            {(canReplay || openInV0Url) && <div className="mt-2 h-7" />}
          </div>
        </TabsContent>

        <TabsContent
          value="code"
          className="*:data-rehype-pretty-code-figure:m-0"
        >
          {codeCollapsible ? (
            <CodeCollapsibleWrapper className="my-0">
              {Code}
            </CodeCollapsibleWrapper>
          ) : (
            Code
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
