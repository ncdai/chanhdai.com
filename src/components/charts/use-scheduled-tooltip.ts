"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

export interface ScheduledTooltipControls<T> {
  tooltipData: T | null
  setTooltipData: React.Dispatch<React.SetStateAction<T | null>>
  scheduleTooltip: (tooltip: T, dedupeKey?: string) => void
  clearTooltip: () => void
  resetTooltipDedupe: () => void
}

function defaultDedupeKey<T>(tooltip: T): string {
  if (
    typeof tooltip === "object" &&
    tooltip !== null &&
    "index" in tooltip &&
    typeof (tooltip as { index: unknown }).index === "number"
  ) {
    const { index, x, activeDataKey } = tooltip as {
      index: number
      x?: number
      activeDataKey?: string
    }
    // Nearest-point hover: several series can share a row — key on the series too.
    const suffix = activeDataKey === undefined ? "" : `:${activeDataKey}`
    if (typeof x === "number") {
      return `${index}:${Math.round(x)}${suffix}`
    }
    return `${index}${suffix}`
  }
  return JSON.stringify(tooltip)
}

/**
 * rAF-coalesced tooltip updates. Keeps the tooltip in React state, or in the
 * caller's store when `setExternal` is given (then `tooltipData` stays `null`
 * here — read it from the store).
 */
export function useScheduledTooltip<T>(
  setExternal?: React.Dispatch<React.SetStateAction<T | null>>
): ScheduledTooltipControls<T> {
  const [tooltipData, setLocalTooltipData] = useState<T | null>(null)
  const setTooltipData = setExternal ?? setLocalTooltipData
  const lastKeyRef = useRef<string | null>(null)
  const pendingRef = useRef<T | null>(null)
  const rafRef = useRef<number | null>(null)
  const pendingKeyRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const commitTooltip = useCallback(
    (tooltip: T, dedupeKey: string) => {
      if (dedupeKey === lastKeyRef.current) {
        return
      }
      lastKeyRef.current = dedupeKey
      setTooltipData(tooltip)
    },
    [setTooltipData]
  )

  const scheduleTooltip = useCallback(
    (tooltip: T, dedupeKey?: string) => {
      const key = dedupeKey ?? defaultDedupeKey(tooltip)
      pendingRef.current = tooltip
      pendingKeyRef.current = key
      if (key === lastKeyRef.current) {
        return
      }
      if (rafRef.current !== null) {
        return
      }
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const next = pendingRef.current
        const nextKey = pendingKeyRef.current
        if (next && nextKey) {
          // Commit inside this frame: a plain setState from rAF is
          // default-priority and would render after the frame paints,
          // showing the tooltip one frame late.
          flushSync(() => commitTooltip(next, nextKey))
        }
      })
    },
    [commitTooltip]
  )

  const clearTooltip = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    pendingRef.current = null
    pendingKeyRef.current = null
    lastKeyRef.current = null
    setTooltipData(null)
  }, [setTooltipData])

  const resetTooltipDedupe = useCallback(() => {
    lastKeyRef.current = null
  }, [])

  return {
    tooltipData,
    setTooltipData,
    scheduleTooltip,
    clearTooltip,
    resetTooltipDedupe,
  }
}
