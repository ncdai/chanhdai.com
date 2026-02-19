"use client"

import { motion } from "motion/react"

import { TextFlip } from "@/registry/components/text-flip"

export default function TextFlipDemo() {
  return (
    <div className="text-2xl font-medium text-muted-foreground">
      <span>I am a </span>
      <TextFlip as={motion.span} className="min-w-32 text-foreground">
        <span>Developer</span>
        <span>Designer</span>
        <span>Creator</span>
        <span>Builder</span>
      </TextFlip>
    </div>
  )
}
