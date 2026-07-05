// Thanks @fumadocs

"use client"

import { useMemo, useRef, useState } from "react"
import { useTiks } from "@rexa-developer/tiks/react"
import { IconCheck, IconCopy, IconX } from "@tabler/icons-react"
import { ChevronDownIcon } from "lucide-react"

import type { CopyState } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/components/base/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/base/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/base/ui/dropdown-menu"
import {
  ClaudeIcon,
  CursorIcon,
  GitHubIcon,
  GrokIcon,
  MarkdownIcon,
  OpenAIIcon,
  SciraIcon,
  V0Icon,
} from "@/components/icons"
import { CopyStateIcon } from "@/registry/components/copy-button"

const cache = new Map<string, string>()

export function LLMCopyButton({ markdownUrl }: { markdownUrl: string }) {
  const [state, setState] = useState<CopyState>("idle")
  const [isCopying, setIsCopying] = useState(false)
  const operationRef = useRef(false)

  const { success, error } = useTiks()

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
      success()
      setState("done")
    } catch {
      error()
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
      className="h-7 gap-1.5 border-none px-2 text-[0.8125rem] active:scale-none"
      variant="secondary"
      size="sm"
      aria-busy={isCopying}
      disabled={isCopying}
      onClick={handleCopy}
    >
      <CopyStateIcon
        state={state}
        idleIcon={<IconCopy />}
        doneIcon={<IconCheck />}
        errorIcon={<IconX />}
      />
      <span className="max-[28rem]:hidden">Copy page</span>
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
        icon: MarkdownIcon,
      },
      {
        title: "Open in GitHub",
        href: `https://github.com/ncdai/chanhdai.com/blob/main/src/features/doc/content/${markdownUrl.replace(/^\//, "")}`,
        icon: GitHubIcon,
      },
      {
        title: "Open in ChatGPT",
        href: `https://chatgpt.com/?${new URLSearchParams({
          hints: "search",
          q,
        })}`,
        icon: OpenAIIcon,
      },
      {
        title: "Open in Claude",
        href: `https://claude.ai/new?${new URLSearchParams({
          q,
        })}`,
        icon: ClaudeIcon,
      },
      {
        title: "Open in Cursor",
        href: `https://cursor.com/link/prompt?${new URLSearchParams({
          text: q,
        })}`,
        icon: CursorIcon,
      },
      {
        title: "Open in Grok",
        href: `https://grok.com/?${new URLSearchParams({
          q,
        })}`,
        icon: GrokIcon,
      },
      {
        title: "Open in Scira AI",
        href: `https://scira.ai/?${new URLSearchParams({
          q,
        })}`,
        icon: SciraIcon,
      },
    ]

    if (isComponent) {
      _items.splice(2, 0, {
        title: "Open in v0",
        href: `https://v0.app/?${new URLSearchParams({
          q,
        })}`,
        icon: V0Icon,
      })
    }

    return _items
  }, [markdownUrl, isComponent])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="size-7 border-none active:scale-none"
            variant="secondary"
            size="icon-sm"
            aria-label="View Options"
          >
            <ChevronDownIcon className="mt-0.5 size-4" />
          </Button>
        }
      />

      <DropdownMenuContent
        className="w-fit"
        align="start"
        alignOffset={-6}
        collisionPadding={16}
        finalFocus={false}
      >
        {items.map(({ title, href, icon: Icon }) => (
          <DropdownMenuItem
            key={href}
            render={
              <a href={href} rel="noopener" target="_blank">
                <Icon />
                {title}
              </a>
            }
          />
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
