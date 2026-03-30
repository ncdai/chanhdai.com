"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export type GlowCardGridProps = React.ComponentPropsWithoutRef<"div"> & {
  // Card parameters
  cardRadius?: number

  // Icon parameters
  iconBlur?: number
  iconSaturate?: number
  iconBrightness?: number
  iconScale?: number
  iconOpacity?: number

  // Border parameters
  borderWidth?: number
  borderBlur?: number
  borderSaturate?: number
  borderBrightness?: number
  borderContrast?: number

  children: React.ReactNode
}

export function GlowCardGrid({
  cardRadius = 16,

  iconBlur = 25,
  iconSaturate = 5.0,
  iconBrightness = 1.3,
  iconScale = 4,
  iconOpacity = 0.3,

  borderWidth = 3,
  borderBlur = 10,
  borderSaturate = 4.2,
  borderBrightness = 2.5,
  borderContrast = 2.5,

  className,
  style,
  ...props
}: GlowCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!gridRef.current) return

      const cards = gridRef.current.querySelectorAll<HTMLElement>(
        "[data-slot='glow-card']"
      )

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()

        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const x = (event.clientX - centerX) / (rect.width / 2)
        const y = (event.clientY - centerY) / (rect.height / 2)

        card.style.setProperty("--pointer-x", x.toFixed(3))
        card.style.setProperty("--pointer-y", y.toFixed(3))
      })
    }

    document.addEventListener("pointermove", handlePointerMove)

    return () => document.removeEventListener("pointermove", handlePointerMove)
  }, [])

  return (
    <div
      ref={gridRef}
      className={cn(
        "grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3",
        className
      )}
      style={
        {
          "--card-radius": `${cardRadius}px`,
          "--card-icon-blur": `${iconBlur}px`,
          "--card-icon-saturate": iconSaturate,
          "--card-icon-brightness": iconBrightness,
          "--card-icon-scale": iconScale,
          "--card-icon-opacity": iconOpacity,
          "--card-border-width": `${borderWidth}px`,
          "--card-border-blur": `${borderBlur}px`,
          "--card-border-saturate": borderSaturate,
          "--card-border-brightness": borderBrightness,
          "--card-border-contrast": borderContrast,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
