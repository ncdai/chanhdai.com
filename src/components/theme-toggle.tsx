"use client"

import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"

import { META_THEME_COLORS } from "@/config/site"
import { useClickSound } from "@/hooks/soundcn/use-click-sound"
import { useMetaColor } from "@/hooks/use-meta-color"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// import { MoonIcon } from "./animated-icons/moon-icon"
// import { SunMediumIcon } from "./animated-icons/sun-medium-icon"
import { Button } from "./ui/button"
import { Kbd } from "./ui/kbd"

export function ThemeToggle() {
  const { resolvedTheme, systemTheme, setTheme } = useTheme()

  const { setMetaColor } = useMetaColor()

  const [click] = useClickSound()

  const switchTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark"

    click()
    setTheme(next === systemTheme ? "system" : next)
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    )
  }

  useHotkeys("d", () => switchTheme())

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="relative touch-manipulation border-none"
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle mode"
            onClick={() => switchTheme()}
          >
            <span
              className="absolute size-12 pointer-fine:hidden"
              aria-hidden
            />
            {/* <MoonIcon className="hidden [html.dark_&]:block" aria-hidden />
            <SunMediumIcon
              className="hidden [html.light_&]:block"
              aria-hidden
            /> */}
            <DarkSideIcon />
          </Button>
        }
      />
      <TooltipContent className="pr-2 pl-3">
        <div className="flex items-center gap-3">
          Toggle mode
          <Kbd>D</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

// Adapted from toggles.dev "Dark Side".
// `transition-transform!` overrides the `transition: none !important` that
// `next-themes` applies during theme changes (`disableTransitionOnChange`).
function DarkSideIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
    >
      <path
        d="M16 .5C7.4.5.5 7.4.5 16S7.4 31.5 16 31.5 31.5 24.6 31.5 16 24.6.5 16 .5zm0 28.1V3.4C23 3.4 28.6 9 28.6 16S23 28.6 16 28.6z"
        className="origin-center motion-safe:transition-transform! motion-safe:duration-500 motion-safe:ease-[ease] dark:rotate-180"
      />
    </svg>
  )
}
