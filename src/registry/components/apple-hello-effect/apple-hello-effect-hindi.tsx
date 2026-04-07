"use client"

import type { TargetAndTransition } from "motion/react"
import { motion } from "motion/react"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const initialProps: TargetAndTransition = {
  pathLength: 0,
  opacity: 0,
}

const animateProps: TargetAndTransition = {
  pathLength: 1,
  opacity: 1,
}

export type AppleHelloEffectProps = Omit<
  ComponentProps<typeof motion.svg>,
  "durationScale" | "onAnimationComplete"
> & {
  /**
   * Scales the duration and delay of the handwriting animation.
   * Values below 1 speed up, values above 1 slow down.
   * @defaultValue 0.8
   */
  durationScale?: number
  /** Called when the full handwriting animation completes. */
  onAnimationComplete?: () => void
}

export function AppleHelloEffectHindi({
  className,
  durationScale = 0.8,
  onAnimationComplete,
  ...props
}: AppleHelloEffectProps) {
  const calc = (x: number) => x * durationScale

  return (
    <motion.svg
      className={cn("h-20", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 605 273"
      fill="none"
      stroke="currentColor"
      strokeWidth="14.888"
      strokeLinecap="round"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      <title>नमस्ते</title>
      <motion.path
        d="M42.3842 150.002C53.2928 153.473 60.4984 162.29 60.4984 175.561C60.4984 189.953 50.3247 201.119 36.677 201.119C24.022 201.119 14.8408 192.186 14.8408 179.035C14.8408 160.269 31.2182 148.265 56.5282 149.01C82.0863 149.754 103.723 163.663 120.367 185.069"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.6),
          ease: "easeOut",
          opacity: { duration: 0.2 },
        }}
      />
      <motion.path
        d="M133.502 93.5842C124.459 153.875 117.303 209.683 111.71 264.988"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.4),
          ease: "easeOut",
          delay: calc(0.6),
          opacity: { duration: 0.2, delay: calc(0.6) },
        }}
      />
      <motion.path
        d="M216.556 90.9181C217.117 117.977 216.81 137.689 214.869 160.067C212.007 193.058 200.119 213.115 180.936 213.115C169.295 213.115 160.844 205.334 160.844 193.399C160.844 177.222 175.901 164.28 203.653 165.376C229.863 166.411 256.651 174.863 275.138 192.025"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.6),
          ease: "easeOut",
          delay: calc(1),
          opacity: { duration: 0.2, delay: calc(1) },
        }}
      />
      <motion.path
        d="M289.489 90.0085C280.255 150.162 272.672 207.783 267.379 263.003"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.4),
          ease: "easeOut",
          delay: calc(1.6),
          opacity: { duration: 0.2, delay: calc(1.6) },
        }}
      />
      <motion.path
        d="M373.949 90.0198C394.816 102.051 408.098 128.602 408.098 154.079C408.098 185.141 387.465 205.586 358.47 205.586C330.249 205.586 311.145 186.038 317.527 170.35C322.864 157.231 341.378 156.812 356.237 168.861C374.674 183.811 382.044 216.764 385.021 261.169"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.6),
          ease: "easeOut",
          delay: calc(2),
          opacity: { duration: 0.2, delay: calc(2) },
        }}
      />
      <motion.path
        d="M403.474 177.549C418.085 183.32 439.163 184.314 458.424 179.805"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.4),
          ease: "easeOut",
          delay: calc(2.6),
          opacity: { duration: 0.2, delay: calc(2.6) },
        }}
      />
      <motion.path
        d="M556.981 88.1333C546.807 149.619 538.371 207.01 531.919 262.906"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.4),
          ease: "easeOut",
          delay: calc(3),
          opacity: { duration: 0.2, delay: calc(3) },
        }}
      />
      <motion.path
        d="M536.891 222.462C541.984 183.336 528.689 152.484 496.435 152.484C472.365 152.484 453.755 175.064 453.755 203.104C453.755 223.451 461.199 245.784 475.095 261.417"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.6),
          ease: "easeOut",
          delay: calc(3.4),
          opacity: { duration: 0.2, delay: calc(3.4) },
        }}
      />
      <motion.path
        d="M521.259 45.4307C485.619 43.0134 474.856 32.3917 474.856 21.5298C474.856 12.832 482.71 7.04349 493.506 7.46568C518.289 8.37031 542.96 35.3336 555.578 70.4412"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.6),
          ease: "easeOut",
          delay: calc(4),
          opacity: { duration: 0.2, delay: calc(4) },
        }}
      />
      <motion.path
        d="M7.44434 88.6792C30.9102 88.8706 59.0093 89.2085 95.3706 89.2085C132.178 89.2085 208.165 89.2571 253.623 89.2047C295.091 89.1568 396.683 89.0223 452.784 89.0234C506.182 89.0244 552.847 88.4444 596.931 87.2836"
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.8),
          ease: "easeOut",
          delay: calc(4.6),
          opacity: { duration: 0.2, delay: calc(4.6) },
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </motion.svg>
  )
}
