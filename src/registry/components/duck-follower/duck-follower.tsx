"use client"

import { useReducedMotion } from "motion/react"
import dynamic from "next/dynamic"
import { useMemo } from "react"

import { useIsClient } from "@/hooks/use-is-client"

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

const DuckFollowerCore = dynamic(
  () => import("@/registry/components/duck-follower/duck-follower-core"),
  {
    ssr: false,
  }
)

export function DuckFollower() {
  const isClient = useIsClient()
  const shouldReduceMotion = useReducedMotion()

  const isTouch = useMemo(() => {
    if (!isClient) return true
    return isTouchDevice()
  }, [isClient])

  const shouldRender = isClient && !shouldReduceMotion && !isTouch

  if (!shouldRender) return null

  return <DuckFollowerCore />
}
