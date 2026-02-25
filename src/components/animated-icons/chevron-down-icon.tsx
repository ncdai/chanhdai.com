"use client"

import { motion, useAnimation } from "motion/react"
import { forwardRef, useImperativeHandle } from "react"

export type ChevronDownIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

export type ChevronDownIconProps = React.ComponentProps<"svg"> & {
  duration?: number
}

const ChevronDownIcon = forwardRef<ChevronDownIconHandle, ChevronDownIconProps>(
  ({ duration = 0.3, ...props }, ref) => {
    const controls = useAnimation()

    useImperativeHandle(ref, () => {
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      }
    })

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <motion.path
          d="M6 9L12 15L18 9"
          variants={{
            normal: {
              d: "M6 9L12 15L18 9",
            },
            animate: {
              d: "M6 15L12 9L18 15",
            },
          }}
          initial="normal"
          animate={controls}
          transition={{
            duration,
          }}
        />
      </svg>
    )
  }
)

ChevronDownIcon.displayName = "ChevronDownIcon"

export { ChevronDownIcon }
