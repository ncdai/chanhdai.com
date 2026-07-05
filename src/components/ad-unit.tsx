"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

type AdUnitProps = {
  slot: string
  format?: string
  responsive?: boolean
  className?: string
}

export default function AdUnit({
  slot,
  // format = "auto",
  // responsive = true,
  className,
}: AdUnitProps) {
  const pathname = usePathname()
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
  }, [pathname])

  if (!ADSENSE_CLIENT) return null

  return (
    <div className={className}>
      <ins
        ref={insRef}
        className="adsbygoogle mx-auto block h-25 w-[320px] max-w-full overflow-hidden rounded-lg md:h-22.5 md:w-182"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        // data-ad-format={format}
        // data-full-width-responsive={responsive}
      />
    </div>
  )
}
