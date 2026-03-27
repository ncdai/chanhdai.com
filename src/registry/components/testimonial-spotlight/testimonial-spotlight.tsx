"use client"

import { useRef, useState } from "react"

import { cn } from "@/lib/utils"

type Position = {
  x: number
  y: number
}

const SPOTLIGHT_OPACITY = 0.5

export function TestimonialSpotlight({
  children,
  className,
  spotlightColor = "rgba(255,255,255,0.2)",
}: {
  children: React.ReactNode
  className?: string
  spotlightColor?: `rgba(${number},${number},${number},${number})`
}) {
  const itemRef = useRef<HTMLDivElement>(null)

  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [opacity, setOpacity] = useState<number>(0)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

  const handleFocus = () => {
    setIsFocused(true)
    setOpacity(SPOTLIGHT_OPACITY)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setOpacity(0)
  }

  const handleMouseEnter = () => {
    setOpacity(SPOTLIGHT_OPACITY)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!itemRef.current || isFocused) return

    const rect = itemRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={itemRef}
      className={cn(
        "relative overflow-hidden rounded-xl bg-card/50 ring-1 ring-foreground/10 ring-inset",
        className
      )}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
        }}
      />
      {children}
    </div>
  )
}
