"use client"

import { useTheme } from "next-themes"

import { DotGridSpotlight } from "@/registry/components/dot-grid-spotlight"

const DOT_COLOR = {
  light: {
    default: "rgba(0, 0, 0, 0.08)",
    active: "rgba(0, 0, 0, 0.16)",
  },
  dark: {
    default: "rgba(255, 255, 255, 0.06)",
    active: "rgba(255, 255, 255, 0.12)",
  },
} as const

export default function DotGridSpotlightDemo() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <div className="relative aspect-square w-xs max-w-full overflow-hidden rounded-xl border bg-black/1 dark:bg-white/5">
      <DotGridSpotlight
        dotColor={DOT_COLOR[theme]?.default}
        activeDotColor={DOT_COLOR[theme]?.active}
      />
    </div>
  )
}
