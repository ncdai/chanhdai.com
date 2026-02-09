"use client"

import { CheckIcon, CircleXIcon, CopyIcon } from "lucide-react"
import type { HTMLMotionProps, Variants } from "motion/react"
import { AnimatePresence, motion } from "motion/react"
import { useOptimistic, useTransition } from "react"

import type { Event } from "@/lib/events"
import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"

import { Button } from "./ui/button"

export function copyToClipboardWithEvent(value: string, event?: Event) {
  if (event) {
    trackEvent(event)
  }
  return navigator.clipboard.writeText(value)
}

const motionIconVariants: Variants = {
  initial: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.8 },
}

export const motionIconProps: HTMLMotionProps<"span"> = {
  variants: motionIconVariants,
  initial: "initial",
  animate: "animate",
  exit: "exit",
  transition: { duration: 0.15, ease: "easeOut" },
}

export function CopyButton({
  value,
  getValue,
  event,
  className,
  ...props
}: {
  value?: string
  getValue?: () => string
  event?: Event["name"]
  className?: string
}) {
  const [state, setState] = useOptimistic<"idle" | "copied" | "failed">("idle")
  const [, startTransition] = useTransition()

  const getValueToCopy = () => {
    if (getValue) return getValue()
    if (value) return value
    return ""
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      className={cn("z-10 size-6 rounded-md", className)}
      onClick={() => {
        startTransition(async () => {
          try {
            setState("copied")
            const value = getValueToCopy()
            copyToClipboardWithEvent(
              value,
              event
                ? {
                    name: event,
                    properties: {
                      code: value,
                    },
                  }
                : undefined
            )
          } catch {
            setState("failed")
          }
          await new Promise((resolve) => setTimeout(resolve, 1500))
        })
      }}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {state === "idle" ? (
          <motion.span key="idle" {...motionIconProps}>
            <CopyIcon className="size-3" />
          </motion.span>
        ) : state === "copied" ? (
          <motion.span key="copied" {...motionIconProps}>
            <CheckIcon className="size-3" strokeWidth={3} />
          </motion.span>
        ) : state === "failed" ? (
          <motion.span key="failed" {...motionIconProps}>
            <CircleXIcon className="size-3" />
          </motion.span>
        ) : null}
      </AnimatePresence>
      <span className="sr-only">Copy</span>
    </Button>
  )
}
