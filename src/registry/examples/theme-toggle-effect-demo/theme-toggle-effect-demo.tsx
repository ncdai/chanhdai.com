"use client"

import { MoonIcon, SunMediumIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { useSound } from "@/hooks/soundcn/use-sound"
import { clickSoftSound } from "@/lib/soundcn/click-soft"

import { ThemeToggleEffectSelector } from "./theme-toggle-effect-selector"

export default function ThemeToggleEffectDemo() {
  const { resolvedTheme, setTheme } = useTheme()
  const [play] = useSound(clickSoftSound, { volume: 0.2 })

  const switchTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const handleThemeToggleClick = () => {
    play()
    if (!document.startViewTransition) switchTheme()
    else document.startViewTransition(switchTheme)
  }

  return (
    <div className="flex gap-2">
      <ThemeToggleEffectSelector />

      <Button
        variant="outline"
        size="icon"
        aria-label="Theme Toggle"
        onClick={handleThemeToggleClick}
      >
        <MoonIcon className="hidden [html.dark_&]:block" />
        <SunMediumIcon className="hidden [html.light_&]:block" />
      </Button>
    </div>
  )
}
