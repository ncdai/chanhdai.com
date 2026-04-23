"use client"

import type { TOCItemType } from "fumadocs-core/toc"
import { useEffect, useMemo, useState } from "react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/base/ui/hover-card"
import { useSound } from "@/hooks/soundcn/use-sound"
import { trackEvent } from "@/lib/events"
import { uMiniMapOpenSound } from "@/lib/soundcn/u-mini-map-open"
import { cn } from "@/lib/utils"

export function TOCMinimap({ items }: { items: TOCItemType[] }) {
  const itemIds = useMemo(
    () => items.map((item) => item.url.replace("#", "")),
    [items]
  )

  const activeHeading = useActiveHeading(itemIds)

  const [play] = useSound(uMiniMapOpenSound, { volume: 0.3 })

  if (!items.length) {
    return null
  }

  return (
    <div className="sticky top-(--doc-cols-top,0px) translate-x-2 translate-y-3 opacity-0 in-data-doc-cols-ready:opacity-100">
      <div className="ml-auto w-18">
        <HoverCard
          onOpenChange={(open) => {
            if (open) {
              play()
              trackEvent({ name: "toc_minimap_hover" })
            }
          }}
        >
          <HoverCardTrigger
            delay={0}
            closeDelay={0}
            render={
              <div className="flex max-h-[calc(100dvh-var(--doc-cols-top,0)+--spacing(-24))] flex-col gap-3 overflow-hidden py-3 pl-6 opacity-100 transition-opacity duration-200 data-popup-open:opacity-0">
                {items.map((item) => (
                  <div
                    key={item.url}
                    data-depth={item.depth}
                    data-active={item.url === `#${activeHeading}`}
                    className={cn(
                      "h-0.5 w-6 shrink-0 rounded-xs bg-ring/50 transition-[background-color] duration-200",
                      "data-[depth=3]:ml-2 data-[depth=3]:w-4",
                      "data-[depth=4]:ml-4 data-[depth=4]:w-2",
                      "data-active:bg-foreground"
                    )}
                  />
                ))}
              </div>
            }
          />

          <HoverCardContent
            className="w-56 overflow-hidden p-0 duration-200 data-[side=left]:slide-in-from-right-3 data-[side=left]:slide-out-to-right-3 data-open:zoom-in-100 data-closed:zoom-out-100"
            align="start"
            alignOffset={0}
            side="left"
            sideOffset={-60}
            positionMethod="fixed"
          >
            <div className="flex max-h-[calc(100dvh-var(--doc-cols-top,0)+--spacing(-24))] overflow-y-auto overscroll-contain">
              <ul className="flex h-full flex-col px-6 py-4 text-sm">
                {items.map((item) => (
                  <li
                    key={item.url}
                    data-depth={item.depth}
                    data-active={item.url === `#${activeHeading}`}
                    className={cn(
                      "flex py-1 data-active:[&_a]:text-accent-foreground",
                      "data-[depth=3]:pl-4 data-[depth=4]:pl-8"
                    )}
                  >
                    <a
                      href={item.url}
                      data-depth={item.depth}
                      className="line-clamp-2 text-muted-foreground transition-[color] duration-200 hover:text-accent-foreground"
                      onClick={handleItemClick}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  )
}

export function useActiveHeading(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%", threshold: 0.98 }
    )

    for (const id of itemIds ?? []) {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    }

    return () => {
      for (const id of itemIds ?? []) {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      }
    }
  }, [itemIds])

  return activeId
}

function handleItemClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  const url = e.currentTarget.getAttribute("href") ?? ""
  const title = e.currentTarget.textContent ?? ""
  const depth = Number(e.currentTarget.getAttribute("data-depth"))
  trackEvent({
    name: "toc_minimap_item_click",
    properties: { url, title, depth },
  })
  scrollToHeading(url)
}

function scrollToHeading(url: string) {
  history.pushState(null, "", url)
  document.getElementById(url.replace("#", ""))?.scrollIntoView({
    behavior: "smooth",
  })
}
