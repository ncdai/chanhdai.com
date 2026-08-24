"use client"

import { useImperativeHandle } from "react"
import type { MotionNodeAnimationOptions } from "motion/react"
import { motion, useAnimation } from "motion/react"

export type SidebarIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

export type SidebarIconProps = React.ComponentPropsWithoutRef<"svg"> & {
  ref?: React.Ref<SidebarIconHandle>
  initial?: MotionNodeAnimationOptions["initial"]
  duration?: number
}

export function SidebarIcon({
  ref,
  initial = "normal",
  duration = 0.3,
  ...props
}: SidebarIconProps) {
  const controls = useAnimation()

  useImperativeHandle(ref, () => {
    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    }
  })

  return (
    // Icon designed by @ncdai
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <rect
        x="2"
        y="3"
        width="20"
        height="18"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.rect
        x="5"
        y="6"
        rx="1"
        height="12"
        fill="currentColor"
        variants={{
          normal: {
            width: 2,
          },
          animate: {
            width: 6,
          },
        }}
        initial={initial}
        animate={controls}
        transition={{
          duration,
        }}
      />
    </svg>
  )
}
