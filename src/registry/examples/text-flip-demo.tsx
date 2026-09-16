"use client"

import { useRef } from "react"
import { motion, useInView, usePageInView } from "motion/react"

import { TextFlip } from "@/registry/components/text-flip"

const WORDS = ["Developer", "Designer", "Creator", "Builder"]

export default function TextFlipDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const isPageInView = usePageInView()
  const isInView = useInView(ref)
  const play = isPageInView && isInView

  return (
    <div
      ref={ref}
      className="flex items-center gap-1.5 text-2xl font-medium text-muted-foreground"
    >
      <span>I am a</span>
      <span className="inline-grid">
        {/* Placeholder for the tallest word */}
        <span className="invisible col-start-1 row-start-1" aria-hidden>
          {WORDS.reduce((a, b) => (a.length >= b.length ? a : b))}
        </span>
        <TextFlip
          as={motion.span}
          className="col-start-1 row-start-1 text-foreground"
          play={play}
        >
          {WORDS.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </TextFlip>
      </span>
    </div>
  )
}
