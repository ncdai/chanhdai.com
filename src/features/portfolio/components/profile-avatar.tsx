"use client"

import type { JSX } from "react"
import { useEffect, useRef, useState } from "react"

import { ElectricBorder } from "@/components/react-bits/electric-border"

export function ProfileAvatar({ children }: { children: JSX.Element }) {
  const [isHovered, setIsHovered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(
      "https://assets.chanhdai.com/audio/electromagnetic.mp3"
    )
    audio.preload = "auto"
    audio.volume = 0.3
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)

    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    const playPromise = audio.play()

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // ignore playback errors (autoplay policy, etc.)
      })
    }
  }

  const handleMouseLeave = () => {
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
