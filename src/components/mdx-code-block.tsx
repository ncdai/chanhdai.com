import type { NpmCommands } from "@/types/unist"
import { cn } from "@/lib/utils"
import { MiddleTruncation } from "@/registry/components/middle-truncation"

import { CodeBlockCommand } from "./code-block-command"
import { CopyButton } from "./copy-button"
import { getIconForLanguageExtension } from "./icons"

export function CodeBlockCaption({
  children,
  ...props
}: React.ComponentProps<"figcaption">) {
  const iconExtension =
    "data-language" in props && typeof props["data-language"] === "string"
      ? getIconForLanguageExtension(props["data-language"])
      : null

  const hasCodeTitle =
    "data-rehype-pretty-code-title" in props && typeof children === "string"

  return (
    <figcaption {...props}>
      {iconExtension}
      {hasCodeTitle ? (
        <MiddleTruncation className="min-w-0 flex-1" ellipsis="…">
          {children}
        </MiddleTruncation>
      ) : (
        children
      )}
    </figcaption>
  )
}

export function CodeBlockFrame({
  code,
  hasTitle = false,
  children,
}: {
  code?: string
  hasTitle?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "group/pre rounded-[9px] border bg-code",
        code && !hasTitle && "[--code-padding-right:6rem]"
      )}
    >
      {children}

      {code && (
        <>
          <CopyButton
            data-slot="copy-button"
            className={cn(
              "absolute top-2 right-2 z-10 size-7 rounded-[5px] border-none text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
              hasTitle && "top-1.5 right-1.5 rounded-md",
              !hasTitle && "opacity-0 group-hover/pre:opacity-100"
            )}
            variant="ghost"
            size="icon-xs"
            text={code}
            event="copy_code_block"
          />

          {!hasTitle && (
            <div
              aria-hidden
              data-fade-overlay
              className="top-1.25 right-1.25 opacity-0 transition-opacity group-hover/pre:opacity-100"
              style={
                {
                  "--fade-color": "var(--code)",
                } as React.CSSProperties
              }
            />
          )}
        </>
      )}
    </div>
  )
}

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
  figcaption: CodeBlockCaption,
  pre({
    __withMeta__,
    __rawString__,

    __pnpm__,
    __yarn__,
    __npm__,
    __bun__,

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
      <CodeBlockFrame code={__rawString__} hasTitle={__withMeta__}>
        <pre {...props} />
      </CodeBlockFrame>
    )
  },
}
