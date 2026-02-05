"use client"

import { useRef } from "react"

import type { VolumeIconHandle } from "@/components/animated-icons/volume"
import { VolumeIcon } from "@/components/animated-icons/volume"
import { useSoundLazy } from "@/hooks/use-sound"
import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"

export function PronounceMyName({
  className,
  namePronunciationUrl,
}: {
  className?: string
  namePronunciationUrl: string
}) {
  const { play, preload } = useSoundLazy(namePronunciationUrl)

  const volumeIconRef = useRef<VolumeIconHandle>(null)

  return (
    <button
      className={cn(
        "relative text-muted-foreground transition-[color,scale] select-none hover:text-foreground active:scale-[0.9]",
        "after:absolute after:-inset-1",
        className
      )}
      onPointerEnter={() => preload()}
      onClick={() => {
        volumeIconRef.current?.startAnimation()
        play()
        trackEvent({
          name: "play_name_pronunciation",
        })
      }}
    >
      <VolumeIcon ref={volumeIconRef} className="size-4.5" />
      <span className="sr-only">Pronounce my name</span>
    </button>
  )
}
