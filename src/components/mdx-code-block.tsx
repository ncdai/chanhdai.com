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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <>
        <pre {...props} />

        {__rawString__ && (
          <CopyButton
            className="absolute top-2 right-2 z-10"
            text={__rawString__}
            event="copy_code_block"
          />
        )}
      </>
    )
  },
}
