"use client"

import { Children, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { useInView, usePageInView } from "motion/react"

import { cn } from "@/lib/utils"

const DEFAULT_COLUMN_COUNT = 4

/** How long each batch of logos stays up before the next wave (ms). */
const CYCLE_INTERVAL = 3500

/** Delay between adjacent cards inside one wave (ms). */
const STAGGER_DELAY = 160

/** Duration of a single card flip (ms). Must match the Tailwind duration below. */
const FLIP_DURATION = 600

/** Slack after the last card settles before the faces are swapped (ms). */
const RESET_BUFFER = 50

export type LogosFlipProps = Omit<React.ComponentProps<"div">, "ref"> & {
  /** Logo elements to cycle through. Each child is rendered as a single logo. */
  children: ReactNode
  /**
   * Number of cards shown at once. Capped at the number of logos. The cards
   * sit in one row by default; set `--column-count` to wrap them onto fewer
   * columns.
   * @defaultValue 4
   */
  columnCount?: number
}

export function LogosFlip({
  children,
  columnCount = DEFAULT_COLUMN_COUNT,
  className,
  style,
  ...props
}: LogosFlipProps) {
  const logos = Children.toArray(children)
  const logoCount = logos.length
  const cardCount = Math.min(columnCount, logoCount)

  const containerRef = useRef<HTMLDivElement>(null)
  const isPageInView = usePageInView()
  const isInView = useInView(containerRef, { margin: "100px" })

  const shouldPlay = isPageInView && isInView && logoCount > cardCount

  const [offset, setOffset] = useState(0)
  const [flippedCount, setFlippedCount] = useState(0)

  useEffect(() => {
    if (!shouldPlay) return

    const timeouts = new Set<number>()
    let isAnimating = false

    const schedule = (callback: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        timeouts.delete(id)
        callback()
      }, delay)
      timeouts.add(id)
    }

    const settleWave = () => {
      setOffset((prev) => prev + cardCount)
      setFlippedCount(0)
      isAnimating = false
    }

    const runWave = () => {
      if (isAnimating) return
      isAnimating = true

      for (let slot = 0; slot < cardCount; slot++) {
        schedule(() => setFlippedCount(slot + 1), slot * STAGGER_DELAY)
      }

      schedule(
        settleWave,
        (cardCount - 1) * STAGGER_DELAY + FLIP_DURATION + RESET_BUFFER
      )
    }

    const intervalId = window.setInterval(runWave, CYCLE_INTERVAL)

    return () => {
      window.clearInterval(intervalId)
      timeouts.forEach((id) => window.clearTimeout(id))
      // The grid is off screen or the tab is hidden here, so committing an
      // interrupted wave is invisible and playback resumes from its batch.
      if (isAnimating) settleWave()
    }
  }, [shouldPlay, cardCount])

  if (logoCount === 0) return null

  return (
    <div
      ref={containerRef}
      data-slot="logos-flip"
      className={cn("grid gap-2", className)}
      style={{
        gridTemplateColumns: `repeat(var(--column-count,${cardCount}), minmax(0, 1fr))`,
        ...style,
      }}
      {...props}
    >
      {Array.from({ length: cardCount }, (_, slot) => (
        <LogosFlipCard
          key={slot}
          offset={offset}
          front={logos[(slot + offset) % logoCount]}
          back={logos[(slot + offset + cardCount) % logoCount]}
          flipped={slot < flippedCount}
        />
      ))}
    </div>
  )
}

type LogosFlipCardProps = {
  offset: number
  front: ReactNode
  back: ReactNode
  flipped: boolean
}

function LogosFlipCard({ offset, front, back, flipped }: LogosFlipCardProps) {
  return (
    <div
      data-slot="logos-flip-card"
      className="h-20 min-w-0 perspective-[1000px] sm:h-24"
    >
      {/* Remounting on swap returns the card to 0deg without a transition. */}
      <div
        key={offset}
        data-slot="logos-flip-card-inner"
        className={cn(
          "relative size-full transition-transform duration-600 ease-in-out transform-3d motion-reduce:transition-none",
          flipped ? "rotate-x-180 motion-reduce:rotate-x-0" : "rotate-x-0"
        )}
      >
        <LogosFlipFace className="rotate-x-0">{front}</LogosFlipFace>
        <LogosFlipFace className="rotate-x-180">{back}</LogosFlipFace>
      </div>
    </div>
  )
}

function LogosFlipFace({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="logos-flip-face"
      className={cn(
        "absolute inset-0 flex items-center justify-center rounded-lg border bg-card px-2 backface-hidden",
        className
      )}
      {...props}
    />
  )
}
