"use client"

import { Children, useEffect, useState } from "react"
import type { Transition, Variants } from "motion/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const defaultTransition: Transition = {
  type: "spring",
  visualDuration: 0.35,
  bounce: 0,
}

const exitTransition: Transition = { duration: 0.2, ease: "easeOut" }

const defaultVariants: Variants = {
  initial: { y: "-0.25em", opacity: 0, filter: "blur(2px)" },
  animate: { y: "0em", opacity: 1, filter: "blur(0px)" },
  exit: {
    y: "0.25em",
    opacity: 0,
    filter: "blur(2px)",
    transition: exitTransition,
  },
}

// `animate` stays shared: it is what the server renders with `initial={false}`,
// and the client reads the media query before hydrating.
const reducedMotionVariants: Variants = {
  ...defaultVariants,
  initial: { opacity: 0 },
  exit: { opacity: 0, transition: exitTransition },
}

type MotionElement = typeof motion.p | typeof motion.span | typeof motion.code

export type TextFlipProps = {
  /**
   * Motion element to render.
   * @defaultValue motion.p
   * */
  as?: MotionElement
  className?: string
  /** Array of children to cycle through. */
  children: React.ReactNode[]

  /**
   * Time in seconds between each flip.
   * @defaultValue 2
   * */
  interval?: number
  /**
   * Motion transition for the enter animation. The default exit is faster and
   * sets its own transition.
   * @defaultValue { type: "spring", visualDuration: 0.35, bounce: 0 }
   * */
  transition?: Transition
  /**
   * Motion variants for enter/exit animations. Replaces the defaults, including
   * their reduced motion fallback.
   * */
  variants?: Variants

  /** Controls whether the flip animation runs. */
  play?: boolean

  /** Called with the new index after each flip. */
  onIndexChange?: (index: number) => void
}

export function TextFlip({
  as: Component = motion.p,
  className,
  children,

  interval = 2,
  transition = defaultTransition,
  variants,
  play = true,

  onIndexChange,
}: TextFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  const items = Children.toArray(children)

  useEffect(() => {
    if (!play) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % items.length
        onIndexChange?.(next)
        return next
      })
    }, interval * 1000)

    return () => clearInterval(timer)
  }, [play, interval, items.length, onIndexChange])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Component
        key={currentIndex}
        className={cn("inline-block", className)}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        variants={
          variants ??
          (shouldReduceMotion ? reducedMotionVariants : defaultVariants)
        }
      >
        {items[currentIndex]}
      </Component>
    </AnimatePresence>
  )
}
