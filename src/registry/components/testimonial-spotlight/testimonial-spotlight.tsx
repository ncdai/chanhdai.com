"use client"

import { useRef } from "react"

import { cn } from "@/lib/utils"

export type TestimonialSpotlightProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children" | "onMouseMove"
> & {
  children: React.ReactNode
}

export function TestimonialSpotlight({
  children,
  className,
  ...props
}: TestimonialSpotlightProps) {
  const itemRef = useRef<HTMLDivElement>(null)

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!itemRef.current) return

    const rect = itemRef.current.getBoundingClientRect()

    itemRef.current.style.setProperty(
      "--spotlight-x",
      `${e.clientX - rect.left}px`
    )
    itemRef.current.style.setProperty(
      "--spotlight-y",
      `${e.clientY - rect.top}px`
    )
  }

  return (
    <div
      ref={itemRef}
      data-slot="testimonial-spotlight"
      className={cn(
        "group/testimonial-spotlight relative overflow-hidden rounded-xl bg-card/50 inset-ring-1 inset-ring-foreground/10 [--spotlight-color:rgba(15,23,42,0.05)] dark:[--spotlight-color:rgba(255,255,255,0.15)]",
        className
      )}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover/testimonial-spotlight:opacity-(--spotlight-opacity,0.5)"
        style={{
          background: `radial-gradient(circle at var(--spotlight-x) var(--spotlight-y), var(--spotlight-color,rgba(15,23,42,0.05)), transparent var(--spotlight-size,60%))`,
        }}
      />
      {children}
    </div>
  )
}
