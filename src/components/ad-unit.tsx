"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

type AdUnitProps = {
  slot: string
  className?: string
}

export default function AdUnit({ slot, className }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (!ADSENSE_CLIENT) return

    const el = insRef.current
    if (!el) return

    if (el.getAttribute("data-adsbygoogle-status")) return

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error("AdSense push error:", e)
    }
  }, [])

  if (!ADSENSE_CLIENT) return null

  return (
    // Collapse the whole unit when unfilled. The "unfill-optimized" status
    // stays visible because AdSense fills that space itself.
    <div className={cn("has-data-[ad-status=unfilled]:hidden", className)}>
      <div className="h-2" />
      <ins
        ref={insRef}
        className="adsbygoogle mx-auto block h-25 w-[320px] max-w-full md:h-22.5 md:w-182"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
      <div className="h-2" />
      <div className="screen-line-bottom h-px" />
    </div>
  )
}
