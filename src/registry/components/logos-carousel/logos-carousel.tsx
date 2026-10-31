"use client"

import { Children, memo, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import {
  AnimatePresence,
  motion,
  useInView,
  usePageInView,
  useReducedMotion,
} from "motion/react"
import type { Transition } from "motion/react"

import { cn } from "@/lib/utils"

const DEFAULT_COLUMN_COUNT = 4

/** How long each logo stays visible before cycling to the next one (ms). */
const CYCLE_INTERVAL = 2400

/**
 * Delay between adjacent columns within a single wave (ms). Kept smaller than
 * the enter/exit duration so neighbouring transitions overlap into a ripple.
 */
const STAGGER_DELAY = 125

/** Duration of a single enter or exit transition (s). */
const TRANSITION_DURATION = 0.5

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const

type WaveDirection = "ltr" | "rtl"

export type LogosCarouselProps = {
  /** Logo elements to cycle through. Each child is rendered as a single logo. */
  children: ReactNode
  /**
   * Number of columns to spread the logos across. Capped at the number of logos.
   * @defaultValue 4
   */
  columnCount?: number
  /**
   * Direction the ripple travels: left-to-right or right-to-left.
   * @defaultValue "ltr"
   */
  direction?: WaveDirection
  className?: string
}

export function LogosCarousel({
  children,
  columnCount = DEFAULT_COLUMN_COUNT,
  direction = "ltr",
  className,
}: LogosCarouselProps) {
  const columns = useMemo(
    () => distributeLogos(Children.toArray(children), columnCount),
    [children, columnCount]
  )

  const reduceMotion = useReducedMotion() ?? false

  const containerRef = useRef<HTMLDivElement>(null)
  const isPageInView = usePageInView()
  const isInView = useInView(containerRef, { margin: "100px" })

  const [step, setStep] = useState(0)
  const shouldPlay = isPageInView && isInView

  useEffect(() => {
    if (!shouldPlay) return

    const beatId = setInterval(
      () => setStep((prev) => prev + 1),
      CYCLE_INTERVAL
    )

    return () => clearInterval(beatId)
  }, [shouldPlay])

  return (
    <div
      ref={containerRef}
      data-slot="logos-carousel"
      className={cn("grid", className)}
      style={{
        gridTemplateColumns: `repeat(var(--column-count,${columns.length}), minmax(0, 1fr))`,
      }}
    >
      {columns.map((columnLogos, columnIndex) => {
        const waveIndex =
          direction === "rtl" ? columns.length - 1 - columnIndex : columnIndex

        return (
          <LogoColumn
            key={columnIndex}
            logos={columnLogos}
            columnIndex={columnIndex}
            waveIndex={waveIndex}
            activeIndex={step % columnLogos.length}
            reduceMotion={reduceMotion}
          />
        )
      })}
    </div>
  )
}

type LogoColumnProps = {
  logos: ReactNode[]
  columnIndex: number
  waveIndex: number
  activeIndex: number
  reduceMotion: boolean
}

const LogoColumn = memo(function LogoColumn({
  logos,
  columnIndex,
  waveIndex,
  activeIndex,
  reduceMotion,
}: LogoColumnProps) {
  const transition: Transition = {
    ease: EASE_OUT_QUAD,
    duration: TRANSITION_DURATION,
    delay: waveIndex * (STAGGER_DELAY / 1000),
  }

  const enterTransition = getEnterTransition(reduceMotion, transition)
  const logo = getLogoVariants(reduceMotion, transition, enterTransition)

  return (
    <motion.div
      data-slot="logos-carousel-column"
      className="relative"
      initial={{ opacity: 0, transform: "translateY(60%)" }}
      animate={{ opacity: 1, transform: "translateY(0%)" }}
      transition={enterTransition}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`${columnIndex}-${activeIndex}`}
          data-slot="logos-carousel-logo"
          className="flex size-full items-center justify-center"
          initial={logo.initial}
          animate={logo.animate}
          exit={logo.exit}
        >
          {logos[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
})

/**
 * `initial` and `animate` must not branch on reduced motion: the server renders
 * `initial` without knowing the preference, and a mismatch leaves its transform
 * stuck in the DOM. Travel and blur jump instead, while opacity is still 0.
 */
function getEnterTransition(
  reduceMotion: boolean,
  transition: Transition
): Transition {
  if (!reduceMotion) return transition

  return {
    ...transition,
    transform: { duration: 0 },
    filter: { duration: 0 },
  }
}

function getLogoVariants(
  reduceMotion: boolean,
  transition: Transition,
  enterTransition: Transition
) {
  return {
    initial: { opacity: 0, transform: "translateY(60%)", filter: "blur(2px)" },
    animate: {
      opacity: 1,
      transform: "translateY(0%)",
      filter: "blur(0px)",
      transition: enterTransition,
    },
    exit: reduceMotion
      ? { opacity: 0, transition }
      : {
          opacity: 0,
          transform: "translateY(-50%)",
          filter: "blur(3px)",
          transition,
        },
  }
}

function distributeLogos(
  logos: ReactNode[],
  columnCount: number
): ReactNode[][] {
  const effectiveCount = Math.min(columnCount, logos.length)
  const columns: ReactNode[][] = Array.from(
    { length: effectiveCount },
    () => []
  )

  logos.forEach((logo, index) => {
    columns[index % effectiveCount].push(logo)
  })

  return columns
}
