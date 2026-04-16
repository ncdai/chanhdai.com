"use client"

import type { JSX } from "react"
import { useEffect, useRef, useState } from "react"

import { ElectricBorder } from "@/components/react-bits/electric-border"
import { useSound } from "@/hooks/soundcn/use-sound"
import { laserSmall001Sound } from "@/lib/soundcn/laser-small-001"

const HOVER_DELAY_MS = 150

export function AvatarElectricEffect({ children }: { children: JSX.Element }) {
  const [isHovered, setIsHovered] = useState(false)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [play] = useSound(laserSmall001Sound, { volume: 0.2 })

  const clearHoverTimeout = () => {
    if (!hoverTimeoutRef.current) return

    clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = null
  }

  useEffect(() => {
    return () => {
      clearHoverTimeout()
    }
  }, [])

  const handleMouseEnter = () => {
    clearHoverTimeout()

    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true)
      play()
    }, HOVER_DELAY_MS)
  }

  const handleMouseLeave = () => {
    clearHoverTimeout()
    setIsHovered(false)
  }

  return (
    <ElectricBorder
      chaos={0.03}
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
