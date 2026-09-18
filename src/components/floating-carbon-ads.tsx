"use client"

import { useEffect, useRef, useState } from "react"
import { XIcon } from "lucide-react"

import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { useIsScrolled } from "@/hooks/use-is-scrolled"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { CarbonAds } from "@/components/carbon-ads"
import {
  HandwrittenArrow,
  HandwrittenNote,
} from "@/features/portfolio/components/handwritten-note"

const DISMISSED_KEY = "carbonAdsDismissed"

function readDismissed() {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === "true"
  } catch {
    return false
  }
}

export function FloatingCarbonAds() {
  const isDesktop = useMediaQuery("(min-width: 1280px)")
  const scrolled = useIsScrolled()
  const [dismissed, setDismissed] = useState(readDismissed)
  const visible = isDesktop && scrolled === false && !dismissed

  // Load once visible so a mid-page landing counts no impression, then stay
  // mounted: a remount would request a new ad.
  const [loaded, setLoaded] = useState(false)
  if (visible && !loaded) {
    setLoaded(true)
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const [shownAt, setShownAt] = useState<number | null>(null)

  // carbon.js may fill the slot late or never, so the close button waits.
  useEffect(() => {
    const container = containerRef.current
    if (!container || shownAt !== null) return

    const observer = new MutationObserver(() => {
      if (container.querySelector("#carbonads")) {
        setShownAt(performance.now())
      }
    })
    observer.observe(container, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [loaded, shownAt])

  const close = (shownAt: number) => {
    trackEvent({
      name: "carbon_ads_close",
      properties: {
        surface: "home_floating",
        seconds_to_close: Math.round((performance.now() - shownAt) / 1000),
      },
    })

    try {
      sessionStorage.setItem(DISMISSED_KEY, "true")
    } catch {
      // Blocked storage: closes for this page view only.
    }

    setDismissed(true)
  }

  if (dismissed || !loaded) return null

  return (
    <div
      ref={containerRef}
      data-visible={visible}
      className={cn(
        // 100%, not 100vw, so a classic scrollbar cannot push it onto the
        // content. 400px is as wide as Carbon's responsive unit grows.
        "[--gap:--spacing(4)]",
        "fixed right-(--gap) bottom-(--gap) z-51 w-[calc((100%-var(--container-3xl))/2-var(--gap)*2)] max-w-100",
        "flex flex-col gap-2",
        "transition-[opacity,visibility] duration-300 data-[visible=false]:invisible data-[visible=false]:opacity-0"
      )}
    >
      {shownAt !== null && (
        // Outside the ad box: Carbon forbids covering any part of the ad.
        <div className="flex items-end justify-between gap-2">
          <HandwrittenNote
            className="relative ml-auto flex items-end text-base/none"
            aria-hidden
          >
            <span className="translate-x-3 -translate-y-4 -rotate-6 text-right">
              this ad pays
              <span className="block" />
              my AI bill
            </span>
            <HandwrittenArrow className="size-6" />
          </HandwrittenNote>

          <Button
            className="size-7 translate-x-2 rounded-lg border-none text-muted-foreground"
            variant="ghost"
            size="icon-sm"
            aria-label="Close ad"
            onClick={() => close(shownAt)}
          >
            <XIcon />
          </Button>
        </div>
      )}

      <CarbonAds />
    </div>
  )
}
