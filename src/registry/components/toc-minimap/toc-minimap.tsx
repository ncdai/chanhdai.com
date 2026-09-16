"use client"

import { useEffect, useMemo, useState } from "react"

import { uMiniMapOpenSound } from "@/lib/soundcn/u-mini-map-open"
import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/soundcn/use-sound"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export type TOCItemType = {
  title: React.ReactNode
  url: string
  depth: number
}

export type TOCMinimapProps = {
  /** @fumadocsHref #tocitemtype */
  items: TOCItemType[]
  className?: string
}

export function TOCMinimap({ items, className }: TOCMinimapProps) {
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
    <div className={cn("ml-auto w-18", className)}>
      <HoverCard
        onOpenChange={(open) => {
          if (open) play()
        }}
      >
        <HoverCardTrigger
          delay={0}
          closeDelay={0}
          render={
            <div className="flex max-h-[50dvh] flex-col gap-3 overflow-hidden py-3 pl-6 opacity-100 transition-opacity duration-200 data-popup-open:opacity-0">
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
        >
          <div className="flex max-h-[50dvh] overflow-y-auto overscroll-contain">
            <ul className="flex size-full flex-col px-6 py-4 text-sm">
              {items.map((item) => (
                <li key={item.url} className="flex py-1">
                  <a
                    href={item.url}
                    data-depth={item.depth}
                    data-active={item.url === `#${activeHeading}`}
                    className={cn(
                      "line-clamp-2 w-full transition-[color] duration-200",
                      "text-muted-foreground hover:text-foreground data-active:text-foreground",
                      "data-[depth=3]:pl-4 data-[depth=4]:pl-8"
                    )}
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
  scrollToHeading(url)
}

function scrollToHeading(url: string) {
  history.pushState(null, "", url)
  document.getElementById(url.replace("#", ""))?.scrollIntoView({
    behavior: "smooth",
  })
}
