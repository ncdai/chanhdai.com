// Thanks @fumadocs

"use client"

import { ChevronDownIcon } from "lucide-react"
import { useMemo, useState, useTransition } from "react"

import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CopyState } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { CopyStateIcon } from "@/registry/components/copy-button"

const cache = new Map<string, string>()

export function LLMCopyButton({ markdownUrl }: { markdownUrl: string }) {
  const [state, setState] = useState<CopyState>("idle")
  const [, startTransition] = useTransition()

  const handleCopy = () => {
    startTransition(async () => {
      try {
        const cached = cache.get(markdownUrl)
        if (cached) {
          await navigator.clipboard.writeText(cached)
          setState("done")
          return
        }

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
        setState("done")
      } catch {
        setState("error")
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setState("idle")
      }
    })
  }

  return (
    <button
      className="flex h-7 items-center gap-1.5 rounded-l-full pr-2 pl-2.5 text-sm font-medium will-change-transform disabled:pointer-events-none disabled:opacity-50"
      onClick={handleCopy}
    >
      <CopyStateIcon state={state} />
      MDX
    </button>
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
        title: "Open in Scira AI",
        href: `https://scira.ai/?${new URLSearchParams({
          q,
        })}`,
        icon: Icons.scira,
      },
    ]

    if (isComponent) {
      _items.splice(1, 0, {
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
        <button className="flex size-7 items-center justify-center gap-2 rounded-r-full text-sm">
          <ChevronDownIcon className="mt-0.5 size-4" />
          <span className="sr-only">View Options</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {items.map(({ title, href, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <a href={href} rel="noreferrer noopener" target="_blank">
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
    <div
      className={cn(
        buttonVariants({
          size: "sm",
          variant: "secondary",
          className:
            "gap-0 divide-x px-0 font-sans active:scale-none dark:divide-white/10",
        })
      )}
    >
      <LLMCopyButton markdownUrl={markdownUrl} />
      <ViewOptions markdownUrl={markdownUrl} isComponent={isComponent} />
    </div>
  )
}
