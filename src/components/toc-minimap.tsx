"use client"

import type { TOCItemType } from "fumadocs-core/toc"

import { trackEvent } from "@/lib/events"
import { uMiniMapOpenSound } from "@/lib/soundcn/u-mini-map-open"
import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/soundcn/use-sound"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { AnchorProvider, useActiveAnchor, useItems } from "./toc"

export function TOCMinimap({
  items,
  options,
  className,
}: {
  items: TOCItemType[]
  options?: IntersectionObserverInit
  className?: string
}) {
  const [play] = useSound(uMiniMapOpenSound, { volume: 0.3 })

  if (!items.length) {
    return null
  }

  return (
    <AnchorProvider toc={items} options={options}>
      <TOCMinimapContainer className={cn("ml-auto w-18", className)}>
        <HoverCard
          onOpenChange={(open) => {
            if (open) {
              play()
              trackEvent({ name: "toc_minimap_hover" })
            }
          }}
        >
          <HoverCardTrigger
            delay={0.1}
            closeDelay={0.1}
            render={
              <div className="flex max-h-[calc(100dvh-var(--doc-cols-top,0)+(--spacing(-24)))] flex-col gap-3 overflow-hidden py-3 pl-6 opacity-100 transition-opacity duration-200 data-popup-open:opacity-0">
                <Minimap />
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
            <div className="flex max-h-[calc(100dvh-var(--doc-cols-top,0)+(--spacing(-24)))] overflow-y-auto overscroll-contain">
              <TOCList />
            </div>
          </HoverCardContent>
        </HoverCard>
      </TOCMinimapContainer>
    </AnchorProvider>
  )
}

function TOCMinimapContainer(props: React.ComponentProps<"div">) {
  const activeAnchor = useActiveAnchor()
  return <div data-active-anchor={activeAnchor} {...props} />
}

function Minimap() {
  const items = useItems()

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          data-depth={item.original.depth}
          data-active={item.active}
          className={cn(
            "pointer-events-none h-0.5 w-6 shrink-0 rounded-xs bg-ring/50 transition-[background-color] duration-200 ease-out",
            "data-[depth=3]:ml-2 data-[depth=3]:w-4",
            "data-[depth=4]:ml-4 data-[depth=4]:w-2",
            "data-active:bg-foreground"
          )}
          aria-hidden
        />
      ))}
    </>
  )
}

function scrollToHeading(url: string) {
  history.pushState(null, "", url)
  document.getElementById(url.replace("#", ""))?.scrollIntoView({
    behavior: "smooth",
  })
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

function TOCList() {
  const items = useItems()

  return (
    <ul className="flex size-full flex-col px-6 py-4 text-sm">
      {items.map((item) => (
        <li key={item.id} className="flex py-1">
          <a
            href={item.original.url}
            data-depth={item.original.depth}
            data-active={item.active}
            className={cn(
              "line-clamp-2 w-full transition-[color] duration-200",
              "text-muted-foreground hover:text-foreground data-active:text-foreground",
              "data-[depth=3]:pl-4 data-[depth=4]:pl-8"
            )}
            onClick={handleItemClick}
          >
            {item.original.title}
          </a>
        </li>
      ))}
    </ul>
  )
}
