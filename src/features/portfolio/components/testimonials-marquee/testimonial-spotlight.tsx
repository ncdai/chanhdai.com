"use client"

import { useRef, useState } from "react"

import { cn } from "@/lib/utils"
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/registry/components/testimonial"

import type { Testimonial as TestimonialType } from "../../types/testimonials"

const SPOTLIGHT_OPACITY = 0.5

type Position = {
  x: number
  y: number
}

export function TestimonialSpotlight({
  className,
  authorAvatar,
  authorName,
  authorTagline,
  url,
  quote,
  spotlightColor = "rgba(255,255,255,0.2)",
}: TestimonialType & {
  className?: string
  spotlightColor?: `rgba(${number},${number},${number},${number})`
}) {
  const itemRef = useRef<HTMLAnchorElement>(null)

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

  const handleMouseMove: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (!itemRef.current || isFocused) return

    const rect = itemRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <a
      ref={itemRef}
      className={cn(
        "relative flex h-full overflow-hidden rounded-xl bg-accent-muted ring-1 ring-foreground/8 ring-inset",
        className
      )}
      href={url}
      target="_blank"
      rel="noopener"
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

      <Testimonial>
        <TestimonialQuote className="text-pretty">
          <p>{quote}</p>
        </TestimonialQuote>

        <TestimonialAuthor>
          <TestimonialAvatar>
            <TestimonialAvatarImg src={authorAvatar} alt={authorName} />
            <TestimonialAvatarRing />
          </TestimonialAvatar>

          <TestimonialAuthorName>{authorName}</TestimonialAuthorName>

          <TestimonialAuthorTagline>{authorTagline}</TestimonialAuthorTagline>
        </TestimonialAuthor>
      </Testimonial>
    </a>
  )
}
