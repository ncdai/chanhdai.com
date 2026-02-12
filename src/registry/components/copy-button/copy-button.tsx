"use client"

import { CheckIcon, CircleXIcon, CopyIcon } from "lucide-react"
import type { HTMLMotionProps, Variants } from "motion/react"
import { AnimatePresence, motion } from "motion/react"

import { Button } from "@/components/ui/button"
import type { CopyState } from "@/hooks/use-copy-to-clipboard"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export const motionIconVariants: Variants = {
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

export function CopyStateIcon({ state }: { state: CopyState }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {state === "idle" ? (
        <motion.span key="idle" {...motionIconProps}>
          <CopyIcon />
        </motion.span>
      ) : state === "done" ? (
        <motion.span key="done" {...motionIconProps}>
          <CheckIcon strokeWidth={3} />
        </motion.span>
      ) : state === "error" ? (
        <motion.span key="error" {...motionIconProps}>
          <CircleXIcon />
        </motion.span>
      ) : null}
    </AnimatePresence>
  )
}

export type CopyButtonProps = React.ComponentProps<typeof Button> & {
  text: string | (() => string)
  onCopySuccess?: (text: string) => void
  onCopyError?: (error: Error) => void
}

export function CopyButton({
  size = "icon",
  children,
  text,
  onCopySuccess,
  onCopyError,
  onClick,
  ...props
}: CopyButtonProps) {
  const { state, copy } = useCopyToClipboard({
    onCopySuccess,
    onCopyError,
  })

  return (
    <Button
      size={size}
      onClick={(e) => {
        copy(text)
        onClick?.(e)
      }}
      aria-label="Copy"
      {...props}
    >
      <CopyStateIcon state={state} />
      {children}
    </Button>
  )
}
