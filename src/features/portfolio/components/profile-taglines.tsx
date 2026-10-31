"use client"

import { useRef } from "react"
import { useInView, usePageInView } from "motion/react"

import { TextSwap } from "@/registry/components/text-swap"

export function ProfileTaglines({
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children" | "ref"> & {
  children: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isPageInView = usePageInView()
  const isInView = useInView(ref)

  return (
    <div ref={ref} {...props}>
      <TextSwap
        className="font-mono text-sm text-balance text-muted-foreground"
        interval={3}
        play={isPageInView && isInView}
      >
        {children}
      </TextSwap>
    </div>
  )
}
