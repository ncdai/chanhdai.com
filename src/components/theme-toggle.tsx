"use client"

import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"

import { META_THEME_COLORS } from "@/config/site"
import { useSound } from "@/hooks/soundcn/use-sound"
import { useMetaColor } from "@/hooks/use-meta-color"
import { clickSoftSound } from "@/lib/soundcn/click-soft"

import { MoonIcon } from "./animated-icons/moon"
import { SunMediumIcon } from "./animated-icons/sun-medium"
import { Tooltip, TooltipContent, TooltipTrigger } from "./base/ui/tooltip"
import { Button } from "./ui/button"
import { Kbd } from "./ui/kbd"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const { setMetaColor } = useMetaColor()

  const [play] = useSound(clickSoftSound, { volume: 0.2 })

  const switchTheme = () => {
    play()
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
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
            className="border-none"
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle Mode"
            onClick={() => switchTheme()}
          >
            <MoonIcon className="relative hidden after:absolute after:-inset-2 [html.dark_&]:block" />
            <SunMediumIcon className="relative hidden after:absolute after:-inset-2 [html.light_&]:block" />
          </Button>
        }
      />
      <TooltipContent className="pr-2 pl-3">
        <div className="flex items-center gap-3">
          Toggle Mode
          <Kbd>D</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
