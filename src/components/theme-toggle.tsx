"use client"

import { useTheme } from "next-themes"
import { useCallback } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import { META_THEME_COLORS } from "@/config/site"
import { useMetaColor } from "@/hooks/use-meta-color"
import { useSound } from "@/hooks/use-sound"

import { MoonIcon } from "./animated-icons/moon"
import { SunMediumIcon } from "./animated-icons/sun-medium"
import { Tooltip, TooltipContent, TooltipTrigger } from "./base/ui/tooltip"
import { Button } from "./ui/button"
import { Kbd } from "./ui/kbd"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const { setMetaColor } = useMetaColor()

  const playClick = useSound("/audio/ui-sounds/click.wav")

  const switchTheme = useCallback(() => {
    playClick(0.5)
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    )
  }, [resolvedTheme, setTheme, setMetaColor, playClick])

  useHotkeys("d", switchTheme)

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            onClick={switchTheme}
            // onClick={() => {
            //   if (!document.startViewTransition) switchTheme();
            //   document.startViewTransition(switchTheme);
            // }}
          />
        }
      >
        <MoonIcon className="relative hidden after:absolute after:-inset-2 [html.dark_&]:block" />
        <SunMediumIcon className="relative hidden after:absolute after:-inset-2 [html.light_&]:block" />
        <span className="sr-only">Theme Toggle</span>
      </TooltipTrigger>

      <TooltipContent className="pr-2 pl-3">
        <div className="flex items-center gap-3">
          Toggle Mode
          <Kbd>D</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
