"use client"

import { useState } from "react"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { IconSwap, IconSwapItem } from "@/registry/components/icon-swap"

const ICONS = {
  sun: SunIcon,
  moon: MoonIcon,
  monitor: MonitorIcon,
} as const

type IconKey = keyof typeof ICONS

export default function IconSwapDemo() {
  const [icon, setIcon] = useState<IconKey>("sun")

  const Icon = ICONS[icon]

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        className="relative will-change-transform"
        variant="outline"
        size="icon-sm"
        aria-label={icon}
      >
        <IconSwap>
          <IconSwapItem key={icon}>
            <Icon />
          </IconSwapItem>
        </IconSwap>
      </Button>

      <div className="flex gap-0.5 rounded-lg p-0.5 ring-1 ring-line">
        {Object.keys(ICONS).map((key) => (
          <Button
            key={key}
            className="rounded-md border-none capitalize"
            size="xs"
            variant={icon === key ? "secondary" : "ghost"}
            onClick={() => setIcon(key as IconKey)}
          >
            {key}
          </Button>
        ))}
      </div>
    </div>
  )
}
