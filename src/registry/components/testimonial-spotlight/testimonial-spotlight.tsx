"use client"

import { useRef, useState } from "react"

import { cn } from "@/lib/utils"

type Position = {
  x: number
  y: number
}

const SPOTLIGHT_OPACITY = 0.5

export type TestimonialSpotlightProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  | "children"
  | "onFocus"
  | "onBlur"
  | "onMouseEnter"
  | "onMouseLeave"
  | "onMouseMove"
> & {
  children: React.ReactNode
  /** The color of the spotlight effect.
   * @defaultValue "rgba(255,255,255,0.2)"
   */
  spotlightColor?: string
  /**
   * The opacity of the spotlight effect.
   * @defaultValue 0.5
   */
  spotlightOpacity?: number
  /**
   * The size of the spotlight effect.
   * @defaultValue "60%"
   */
  spotlightSize?: string
}

export function TestimonialSpotlight({
  children,
  className,
  spotlightColor = "rgba(255,255,255,0.2)",
  spotlightOpacity = SPOTLIGHT_OPACITY,
  spotlightSize = "60%",
  ...props
}: TestimonialSpotlightProps) {
  const itemRef = useRef<HTMLDivElement>(null)

  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [opacity, setOpacity] = useState<number>(0)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

  const handleFocus = () => {
    setIsFocused(true)
    setOpacity(spotlightOpacity)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setOpacity(0)
  }

  const handleMouseEnter = () => {
    setOpacity(spotlightOpacity)
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
      data-slot="testimonial-spotlight"
      className={cn(
        "relative overflow-hidden rounded-xl bg-card/50 ring-1 ring-foreground/10 ring-inset",
        className
      )}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, var(--spotlight-color, ${spotlightColor}), transparent var(--spotlight-size, ${spotlightSize}))`,
        }}
      />
      {children}
    </div>
  )
}
