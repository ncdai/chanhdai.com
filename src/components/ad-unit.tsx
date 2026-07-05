"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

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
    <div
      className={cn(
        "bg-black/0.75 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center [--pattern-foreground:var(--color-zinc-950)]/5 max-md:hidden dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5",
        className
      )}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", margin: "0 auto", width: 728, height: 90 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        // data-ad-format={format}
        // data-full-width-responsive={responsive}
      />

      <p className="mt-4 text-center text-xs text-balance text-muted-foreground">
        Testing ads for project sustainability. Huge thanks to the sponsors for
        their ongoing support.
      </p>
    </div>
  )
}
