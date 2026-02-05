"use client"

import type { HTMLAttributes, ReactNode } from "react"
import React, { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: number
  disabled?: boolean
  magnetStrength?: number
  activeTransition?: string
  inactiveTransition?: string
  wrapperClassName?: string
  innerClassName?: string
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 64,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const magnetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return

      const { left, top, width, height } =
        magnetRef.current.getBoundingClientRect()

      const centerX = left + width / 2
      const centerY = top + height / 2

      const distX = Math.abs(centerX - e.clientX)
      const distY = Math.abs(centerY - e.clientY)

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true)
        const offsetX = (e.clientX - centerX) / magnetStrength
        const offsetY = (e.clientY - centerY) / magnetStrength
        setPosition({ x: offsetX, y: offsetY })
      } else {
        setIsActive(false)
        setPosition({ x: 0, y: 0 })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [padding, disabled, magnetStrength])

  const finalPosition = disabled ? { x: 0, y: 0 } : position
  const transitionStyle = isActive ? activeTransition : inactiveTransition

  return (
    <div
      ref={magnetRef}
      className={cn("relative inline-block", wrapperClassName)}
      {...props}
    >
      <div
        className={cn("will-change-transform", innerClassName)}
        style={{
          transform: `translate3d(${finalPosition.x}px, ${finalPosition.y}px, 0)`,
          transition: transitionStyle,
        }}
      >
        {children}
      </div>
    </div>
  )
}
