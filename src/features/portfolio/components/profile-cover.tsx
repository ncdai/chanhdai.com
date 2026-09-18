"use client"

import { useRef } from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { ChanhDaiMark } from "@/components/chanhdai-mark"
import { Magnet } from "@/components/react-bits/magnet"
import { DotGridSpotlight } from "@/registry/components/dot-grid-spotlight"

const DOT_COLOR = {
  light: {
    default: "rgba(0, 0, 0, 0.06)",
    active: "rgba(0, 0, 0, 0.12)",
  },
  dark: {
    default: "rgba(255, 255, 255, 0.05)",
    active: "rgba(255, 255, 255, 0.1)",
  },
}

/** @deprecated */
export function ProfileCover() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex aspect-2.5/1 items-center justify-center border-x border-line select-none sm:aspect-3.5/1",
        "screen-line-top screen-line-bottom before:-top-px after:-bottom-px",
        "bg-black/0.75 dark:bg-white/1"
      )}
    >
      <DotGridSpotlight
        dotColor={DOT_COLOR[theme]?.default}
        activeDotColor={DOT_COLOR[theme]?.active}
      />

      <Magnet
        containerRef={containerRef}
        magnetStrength={6}
        wrapperClassName="pointer-events-none"
      >
        <ChanhDaiMark className="h-12 w-24 min-[25rem]:h-14 min-[25rem]:w-28 sm:h-16 sm:w-32" />
      </Magnet>
    </div>
  )
}
