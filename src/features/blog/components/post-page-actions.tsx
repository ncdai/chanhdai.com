// Thanks @fumadocs

"use client"

import { ChevronDownIcon } from "lucide-react"
import { useMemo, useRef, useState } from "react"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CopyState } from "@/hooks/use-copy-to-clipboard"
import { CopyStateIcon } from "@/registry/components/copy-button"

const cache = new Map<string, string>()

export function LLMCopyButton({ markdownUrl }: { markdownUrl: string }) {
  const [state, setState] = useState<CopyState>("idle")
  const [isCopying, setIsCopying] = useState(false)
  const operationRef = useRef(false)

  const handleCopy = async () => {
    if (operationRef.current) return

    operationRef.current = true

    const loadingTimer = setTimeout(() => {
      setIsCopying(true)
    }, 150)

    try {
      const cached = cache.get(markdownUrl)
      if (cached) {
        await navigator.clipboard.writeText(cached)
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": fetch(markdownUrl)
              .then((res) => res.text())
              .then((content) => {
                cache.set(markdownUrl, content)
                return content
              }),
          }),
        ])
      }
      setState("done")
    } catch {
      setState("error")
    } finally {
      clearTimeout(loadingTimer)
      setIsCopying(false)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      operationRef.current = false
      setState("idle")
    }
  }

  return (
    <Button
      className="h-7 gap-1.5 border-none pr-2 pl-2.5 text-[0.8125rem] active:scale-none [&_svg:not([class*='size-'])]:size-3.5"
      variant="secondary"
      size="sm"
      aria-busy={isCopying}
      disabled={isCopying}
      onClick={handleCopy}
    >
      <CopyStateIcon state={state} />
      <span className="max-[28rem]:hidden">Copy Page</span>
    </Button>
  )
}

function getPrompt(url: string, isComponent?: boolean) {
  if (isComponent) {
    return `I'm looking at this component documentation: ${url}
I want to use it in a React (TypeScript) project.
Help me understand how to use it step-by-step, including explaining key concepts, showing practical examples with TypeScript code, and pointing out common pitfalls.
Be ready to answer follow-up questions and help debug issues based on the documentation.`
  }

  return `Read ${url}, I want to ask questions about it.`
}

export function ViewOptions({
  markdownUrl,
  isComponent = false,
}: {
  markdownUrl: string
  isComponent?: boolean
}) {
  const items = useMemo(() => {
    const fullMarkdownUrl =
      typeof window !== "undefined"
        ? new URL(markdownUrl, window.location.origin).toString()
        : markdownUrl

    const q = getPrompt(fullMarkdownUrl, isComponent)

    const _items = [
      {
        title: "View as Markdown",
        href: fullMarkdownUrl,
        icon: Icons.markdown,
      },
      {
        title: "Open in GitHub",
        href: `https://github.com/ncdai/chanhdai.com/blob/main/src/features/doc/content/${markdownUrl.split("/").slice(-1).join("/")}`,
        icon: Icons.github,
      },
      {
        title: "Open in ChatGPT",
        href: `https://chatgpt.com/?${new URLSearchParams({
          hints: "search",
          q,
        })}`,
        icon: Icons.openai,
      },
      {
        title: "Open in Claude",
        href: `https://claude.ai/new?${new URLSearchParams({
          q,
        })}`,
        icon: Icons.claude,
      },
      {
        title: "Open in Cursor",
        href: `https://cursor.com/link/prompt?${new URLSearchParams({
          text: q,
        })}`,
        icon: Icons.cursor,
      },
      {
        title: "Open in Grok",
        href: `https://grok.com/?${new URLSearchParams({
          q,
        })}`,
        icon: Icons.grok,
      },
      {
        title: "Open in Scira AI",
        href: `https://scira.ai/?${new URLSearchParams({
          q,
        })}`,
        icon: Icons.scira,
      },
    ]

    if (isComponent) {
      _items.splice(2, 0, {
        title: "Open in v0",
        href: `https://v0.app/?${new URLSearchParams({
          q,
        })}`,
        icon: Icons.v0,
      })
    }

    return _items
  }, [markdownUrl, isComponent])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-7 border-none active:scale-none"
          variant="secondary"
          size="icon-sm"
        >
          <ChevronDownIcon className="mt-0.5 size-4" />
          <span className="sr-only">View Options</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-fit"
        align="start"
        alignOffset={-6}
        collisionPadding={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {items.map(({ title, href, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <a href={href} rel="noopener" target="_blank">
              <Icon />
              {title}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LLMCopyButtonWithViewOptions({
  markdownUrl,
  isComponent = false,
}: {
  markdownUrl: string
  isComponent?: boolean
}) {
  return (
    <ButtonGroup>
      <LLMCopyButton markdownUrl={markdownUrl} />
      <ButtonGroupSeparator className="border-y-4 border-secondary dark:bg-white/20 data-vertical:my-0" />
      <ViewOptions markdownUrl={markdownUrl} isComponent={isComponent} />
    </ButtonGroup>
  )
}
