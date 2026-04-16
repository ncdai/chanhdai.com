"use client"

import { useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import type { VolumeIconHandle } from "@/components/animated-icons/volume"
import { VolumeIcon } from "@/components/animated-icons/volume"
import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { useSound } from "@/registry/hooks/sound/use-sound"

export function PronounceMyName({
  className,
  namePronunciationUrl,
}: {
  className?: string
  namePronunciationUrl: string
}) {
  const [play] = useSound(namePronunciationUrl)

  const volumeIconRef = useRef<VolumeIconHandle>(null)

  const handlePlayClick = () => {
    volumeIconRef.current?.startAnimation()
    play()
    trackEvent({
      name: "play_name_pronunciation",
    })
  }

  useHotkeys("p", handlePlayClick)

  return (
    <button
      className={cn(
        "relative after:absolute after:-inset-2",
        "touch-manipulation text-muted-foreground transition-[color,scale] select-none hover:text-foreground active:scale-[0.9]",
        className
      )}
      onClick={handlePlayClick}
      aria-label="Pronounce my name"
    >
      <VolumeIcon ref={volumeIconRef} className="size-4.5" />
    </button>
  )
}
