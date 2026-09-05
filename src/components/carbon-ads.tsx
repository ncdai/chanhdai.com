"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { CARBON_ADS } from "@/config/ads"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    _carbonads?: {
      refresh: () => void
    }
  }
}

const SCRIPT_ID = "_carbonads_js"

type CarbonAdsProps = {
  className?: string
  format?: "cover" | "responsive"
}

export function CarbonAds({
  className,
  format = "responsive",
}: CarbonAdsProps) {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!CARBON_ADS || !container) return

    // carbon.js inserts the ad after its script tag, so the tag lives here.
    // A loading script runs its own init, so refresh only after it loaded.
    const script = document.getElementById(SCRIPT_ID)
    if (script) {
      if (container.contains(script) && script.dataset.loaded) {
        window._carbonads?.refresh()
      }
      return
    }

    const el = document.createElement("script")
    el.id = SCRIPT_ID
    el.async = true
    el.type = "text/javascript"
    el.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_ADS.serve}&placement=${CARBON_ADS.placement}&format=${format}`
    el.onload = () => {
      el.dataset.loaded = "true"
    }
    el.onerror = () => setBlocked(true)
    container.appendChild(el)
  }, [pathname, format])

  if (!CARBON_ADS || blocked) return null

  return (
    <div
      ref={containerRef}
      data-slot="carbon-ads"
      data-format={format}
      className={cn("min-h-39 data-[format=cover]:min-h-70", className)}
    />
  )
}
