"use client"

import { ArrowUpIcon } from "lucide-react"
import { useMotionValueEvent, useScroll } from "motion/react"
import { useState } from "react"

import { Button } from "@/components/base/ui/button"
import { cn } from "@/lib/utils"

export function ScrollToTop({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { scrollY } = useScroll()

  const [visible, setVisible] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setVisible(latestValue >= 400)

    const prev = scrollY.getPrevious() ?? 0
    const diff = latestValue - prev
    setScrollDirection(diff > 0 ? "down" : "up")
  })

  return (
    <Button
      data-visible={visible}
      data-scroll-direction={scrollDirection}
      className={cn(
        "[--bottom:0.5rem] lg:[--bottom:2rem]",
        "fixed right-4 bottom-[calc(var(--bottom,0.5rem)+env(safe-area-inset-bottom,0px))] z-50 lg:right-8",
        "transition-[background-color,opacity] duration-300 data-[scroll-direction=down]:opacity-30 data-[scroll-direction=up]:opacity-100 data-[visible=false]:opacity-0",
        "data-[scroll-direction=down]:hover:opacity-100",
        "border-none",
        className
      )}
      variant="secondary"
      size="icon-sm"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      {...props}
    >
      <ArrowUpIcon />
      <span className="sr-only">Scroll to top</span>
    </Button>
  )
}
