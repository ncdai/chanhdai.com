"use client"

import { Volume2Icon } from "lucide-react"
import { useRef } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function BrandPronunciation({ audioUrl }: { audioUrl: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.preload = "auto"
    }
    audioRef.current.play()
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="relative top-0.75 inline-flex transition-[scale] outline-none active:scale-[0.97] sm:top-1"
          onClick={playAudio}
        >
          <Volume2Icon className="size-[1em]" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-mono">/ˈkwɑː.rɪk/</p>
      </TooltipContent>
    </Tooltip>
  )
}
