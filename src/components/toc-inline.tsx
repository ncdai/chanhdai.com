"use client"

import type { TOCItemType } from "fumadocs-core/toc"
import { TextIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleChevronDownIcon,
} from "@/components/base/collapsible-animated"
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"

export function TOCInline({
  items,
  className,
  children,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof Collapsible> & {
  items: TOCItemType[]
}) {
  if (!items.length) {
    return null
  }

  return (
    <Collapsible
      className={cn(
        "not-prose group/inline-toc rounded-xl bg-code font-sans",
        className
      )}
      onOpenChange={(open, eventDetails) => {
        trackEvent({ name: "toc_inline_toggle", properties: { open } })
        onOpenChange?.(open, eventDetails)
      }}
      {...props}
    >
      <CollapsibleTrigger className="inline-flex w-full items-center gap-2 rounded-xl py-2.5 pr-2 pl-4 text-sm font-medium outline-none group-data-open/inline-toc:rounded-b-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset [&_svg]:size-4">
        <TextIcon className="-translate-x-0.5" />
        {children ?? "On this page"}
        <div className="ml-auto shrink-0 text-muted-foreground">
          <CollapsibleChevronDownIcon duration={0.15} />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <ul className="flex flex-col px-4 pb-2">
          {items.map((item) => (
            <li
              key={item.url}
              data-depth={item.depth}
              className="flex py-1 data-[depth=3]:pl-4 data-[depth=4]:pl-8"
            >
              <a
                href={item.url}
                data-depth={item.depth}
                className="text-sm text-muted-foreground transition-colors hover:text-accent-foreground"
                onClick={handleItemClick}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

function handleItemClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const url = e.currentTarget.getAttribute("href") ?? ""
  const title = e.currentTarget.textContent ?? ""
  const depth = Number(e.currentTarget.getAttribute("data-depth"))
  trackEvent({
    name: "toc_inline_item_click",
    properties: { url, title, depth },
  })
}
