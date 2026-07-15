"use client"

import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"

import { META_THEME_COLORS } from "@/config/site"
import { useClickSound } from "@/hooks/soundcn/use-click-sound"
import { useMetaColor } from "@/hooks/use-meta-color"

import { MoonIcon } from "./animated-icons/moon-icon"
import { SunMediumIcon } from "./animated-icons/sun-medium-icon"
import { Tooltip, TooltipContent, TooltipTrigger } from "./base/ui/tooltip"
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
            <MoonIcon className="hidden [html.dark_&]:block" aria-hidden />
            <SunMediumIcon
              className="hidden [html.light_&]:block"
              aria-hidden
            />
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
