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
      className={cn(
        "my-[1.25em] rounded-xl bg-code",
        prose === false && "not-prose",
        className
      )}
      {...props}
    >
      <Tabs defaultValue="preview" className="gap-0">
        <div className="z-1 px-4">
          <TabsList className="h-10 rounded-none bg-transparent p-0 dark:bg-transparent [&_svg]:me-2 [&_svg]:size-4 [&_svg]:text-muted-foreground">
            <TabsTrigger className="h-7 rounded-lg p-0 px-2" value="preview">
              Preview
            </TabsTrigger>
            <TabsTrigger className="h-7 rounded-lg p-0 px-2" value="code">
              Code
            </TabsTrigger>

            <TabsIndicator className="h-0.5 translate-y-px rounded-none bg-foreground shadow-none dark:bg-foreground" />
          </TabsList>
        </div>

        <TabsContent className="px-1 pb-1" value="preview">
          <div
            data-slot="preview"
            data-show-buttons={canReplay || !!openInV0Url}
            className="relative rounded-[9px] border bg-background p-2 data-[show-buttons=true]:py-8.75"
          >
            {(canReplay || openInV0Url) && (
              <div
                data-slot="buttons"
                className="absolute top-0.75 right-0.75 flex items-center"
              >
                {canReplay && (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          className="size-7 rounded-[5px] border-none"
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

                {openInV0Url && (
                  <OpenInV0Button
                    className="h-7 rounded-[5px]"
                    url={openInV0Url}
                  />
                )}
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
          </div>
        </TabsContent>

        <TabsContent
          value="code"
          className={cn(
            "**:data-rehype-pretty-code-figure:m-0 **:data-rehype-pretty-code-figure:pt-0",
            "**:data-[slot=copy-button]:top-1",
            "**:data-fade-overlay:top-px"
          )}
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
