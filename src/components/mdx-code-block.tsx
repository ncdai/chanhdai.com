import { cn } from "@/lib/utils"
import type { NpmCommands } from "@/types/unist"

import { CodeBlockCommand } from "./code-block-command"
import { CopyButton } from "./copy-button"
import { getIconForLanguageExtension } from "./icons"

export const mdxCodeBlockComponents = {
  figure({ className, ...props }: React.ComponentProps<"figure">) {
    const hasPrettyCode = "data-rehype-pretty-code-figure" in props

    return (
      <figure
        className={cn(hasPrettyCode && "not-prose", className)}
        {...props}
      />
    )
  },
  figcaption: ({ children, ...props }: React.ComponentProps<"figcaption">) => {
    const iconExtension =
      "data-language" in props && typeof props["data-language"] === "string"
        ? getIconForLanguageExtension(props["data-language"])
        : null

    const hasCodeTitle = "data-rehype-pretty-code-title" in props

    return (
      <figcaption {...props}>
        {iconExtension}
        {hasCodeTitle ? <p className="truncate">{children}</p> : children}
      </figcaption>
    )
  },
  pre({
    __withMeta__,
    __rawString__,

    __pnpm__,
    __yarn__,
    __npm__,
    __bun__,

    className,
    ...props
  }: React.ComponentProps<"pre"> & {
    __withMeta__?: boolean
    __rawString__?: string
  } & NpmCommands) {
    const isNpmCommand = __pnpm__ && __yarn__ && __npm__ && __bun__

    if (isNpmCommand) {
      return (
        <CodeBlockCommand
          __pnpm__={__pnpm__}
          __yarn__={__yarn__}
          __npm__={__npm__}
          __bun__={__bun__}
        />
      )
    }

    return (
      <>
        <div className="rounded-[9px] border bg-background [--code:var(--background)]">
          <pre
            className={cn(
              __rawString__ && !__withMeta__ && "[--code-padding-right:6rem]",
              className
            )}
            {...props}
          />
        </div>

        {__rawString__ && (
          <>
            <CopyButton
              data-slot="copy-button"
              className={cn(
                "absolute top-2 right-2 z-10 size-7 rounded-[5px] border-none text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
                __withMeta__ && "top-1.5 right-1.5 rounded-md"
              )}
              variant="ghost"
              size="icon-xs"
              text={__rawString__}
              event="copy_code_block"
            />

            {!__withMeta__ && (
              <div
                aria-hidden
                data-fade-overlay
                className="top-1.25 right-1.25"
                style={
                  {
                    "--fade-color": "var(--background)",
                  } as React.CSSProperties
                }
              />
            )}
          </>
        )}
      </>
    )
  },
}
