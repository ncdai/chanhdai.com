"use client"

import type { JSX } from "react"
import { useEffect, useRef, useState } from "react"

import { ElectricBorder } from "@/components/react-bits/electric-border"

const HOVER_DELAY_MS = 150

export function AvatarElectricEffect({ children }: { children: JSX.Element }) {
  const [isHovered, setIsHovered] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const audio = new Audio(
      "https://assets.chanhdai.com/audio/ui-sounds/electromagnetic.mp3?v=1"
    )
    audio.preload = "auto"
    audio.loop = true
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = () => {
    // Clear any existing timeout.
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    // Delay a bit before activating effect.
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true)

      const audio = audioRef.current
      if (!audio) return

      audio.currentTime = 0
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // ignore playback errors (autoplay policy, etc.).
        })
      }
    }, HOVER_DELAY_MS)
  }

  const handleMouseLeave = () => {
    // Clear timeout if user leaves before delay completes.
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    setIsHovered(false)

    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
  }

  return (
    <ElectricBorder
      chaos={0.06}
      borderRadius={999}
      color="#fbbf24"
      active={isHovered}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </ElectricBorder>
  )
}
