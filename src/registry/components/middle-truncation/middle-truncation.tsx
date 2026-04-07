"use client"

import React, { useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

let cachedCanvas: HTMLCanvasElement | null = null
let cachedCtx: CanvasRenderingContext2D | null = null

/**
 * Returns a singleton canvas 2D context for text measurement.
 * Creates the canvas on first call and reuses it for all subsequent calls.
 *
 * @throws {Error} If canvas 2D context creation fails.
 */
function getCanvas(): CanvasRenderingContext2D {
  if (!cachedCtx) {
    cachedCanvas = document.createElement("canvas")
    const ctx = cachedCanvas.getContext("2d")
    if (!ctx) {
      throw new Error("Failed to get 2d context from canvas")
    }
    cachedCtx = ctx
  }
  return cachedCtx
}

function measureText(text: string, font: string) {
  const ctx = getCanvas()
  ctx.font = font
  return ctx.measureText(text).width
}

function getComputedFont(el: HTMLElement) {
  const cs = window.getComputedStyle(el)
  return `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
}

/**
 * Creates a debounced version of a function that syncs execution with the browser's paint cycle.
 *
 * Combines debouncing (waits for inactivity) with requestAnimationFrame (syncs with browser rendering)
 * to ensure smooth UI updates without jank.
 *
 * @template Args - The argument types of the function.
 * @template Return - The return type of the function (ignored in debounced version).
 * @param fn - The function to debounce.
 * @param delay - Milliseconds to wait before executing after the last call.
 * @returns A debounced version that executes on the next animation frame after the delay.
 *
 * @example
 * const debouncedScroll = debounceWithRAF(handleScroll, 150)
 * window.addEventListener('scroll', debouncedScroll)
 */
function debounceWithRAF<Args extends unknown[], Return = void>(
  fn: (...args: Args) => Return,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let rafId: number | undefined

  return (...args: Args): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    if (rafId !== undefined) {
      cancelAnimationFrame(rafId)
    }

    timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(() => {
        fn(...args)
      })
    }, delay)
  }
}

/**
 * Truncates text in the middle, preserving the start and end portions.
 *
 * Uses binary search to find the optimal truncation point based on pixel width,
 * ensuring the result fits within the container. The truncated text will be in
 * the format: "start{ellipsis}end".
 *
 * @param text - The text to truncate.
 * @param end - Fixed number of characters to preserve at the end. Mutually exclusive with minEnd.
 * @param minEnd - Minimum characters at the end when splitting evenly. Mutually exclusive with end.
 * @param containerW - Available width in pixels.
 * @param font - CSS font string for accurate measurement.
 * @param ellipsis - The string to use as separator in the middle.
 * @returns The original text if it fits, otherwise truncated text with ellipsis in the middle.
 *
 * @example
 * // Fixed end: always preserve exactly 4 chars at the end
 * computeTruncated("very-long-filename.txt", 4, undefined, 100, "16px Arial", "...")
 * // Returns: "very-long-file...txt"
 *
 * @example
 * // MinEnd: split evenly, but ensure at least 4 chars at the end
 * computeTruncated("document.pdf", undefined, 4, 100, "16px Arial", "...")
 * // Returns: "doc....pdf" (prioritizes minEnd when width is small)
 *
 * @example
 * // No constraints: split evenly in the middle
 * computeTruncated("abcdefghijklmnop", undefined, undefined, 100, "16px Arial", "...")
 * // Returns: "abcd...mnop"
 */
function computeTruncated(
  text: string,
  end: number | undefined,
  minEnd: number | undefined,
  containerW: number,
  font: string,
  ellipsis: string
): string {
  const fullW = measureText(text, font)
  if (fullW <= containerW) return text

  // Strategy 1: Fixed end (always preserve exactly X chars at the end)
  if (end !== undefined) {
    const endStr = text.slice(-end)
    const endW = measureText(ellipsis + endStr, font)
    const available = containerW - endW

    let lo = 0
    let hi = text.length - end
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2)
      if (measureText(text.slice(0, mid), font) <= available) lo = mid
      else hi = mid - 1
    }

    return text.slice(0, lo) + ellipsis + endStr
  }

  // Strategy 2: Split evenly (with optional minEnd constraint)
  const ellipsisW = measureText(ellipsis, font)
  const availableForText = containerW - ellipsisW

  let lo = 0
  let hi = text.length
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)

    let startLen: number
    let endLen: number

    if (minEnd !== undefined) {
      endLen = Math.max(Math.ceil(mid / 2), minEnd)
      startLen = Math.max(0, mid - endLen)
    } else {
      startLen = Math.floor(mid / 2)
      endLen = Math.ceil(mid / 2)
    }

    const startStr = text.slice(0, startLen)
    const endStr = text.slice(-endLen)
    const combinedW = measureText(startStr + endStr, font)

    if (combinedW <= availableForText) lo = mid
    else hi = mid - 1
  }

  let startLen: number
  let endLen: number

  if (minEnd !== undefined) {
    endLen = Math.max(Math.ceil(lo / 2), minEnd)
    startLen = Math.max(0, lo - endLen)
  } else {
    startLen = Math.floor(lo / 2)
    endLen = Math.ceil(lo / 2)
  }

  return text.slice(0, startLen) + ellipsis + text.slice(-endLen)
}

type BaseProps = React.ComponentPropsWithoutRef<"span"> & {
  /** The text content to truncate. */
  children: string
  /** Custom ellipsis string to show in the middle. @default "..." */
  ellipsis?: string
}

export type MiddleTruncationProps = BaseProps &
  (
    | {
        /** Fixed number of characters to always preserve at the end. Cannot be used with minEnd. */
        end: number
        minEnd?: never
      }
    | {
        /** When splitting evenly, ensure at least this many characters at the end. Cannot be used with end. */
        minEnd: number
        end?: never
      }
    | {
        /** When neither end nor minEnd is provided, splits text evenly in the middle. */
        end?: never
        minEnd?: never
      }
  )

export function MiddleTruncation({
  className,
  children,
  end,
  minEnd,
  ellipsis = "...",
  ...props
}: MiddleTruncationProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const [displayed, setDisplayed] = useState<string>(children)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const recalculate = (width: number) => {
      const font = getComputedFont(el)
      setDisplayed(
        computeTruncated(children, end, minEnd, width, font, ellipsis)
      )
    }

    const debouncedRecalculate = debounceWithRAF(recalculate, 150)

    const ro = new ResizeObserver(([entry]) => {
      debouncedRecalculate(entry.contentRect.width)
    })

    recalculate(el.offsetWidth)
    ro.observe(el)

    return () => ro.disconnect()
  }, [children, end, minEnd, ellipsis])

  return (
    <span
      ref={containerRef}
      className={cn(
        "block overflow-hidden text-ellipsis whitespace-nowrap",
        className
      )}
      title={children}
      {...props}
    >
      {displayed}
    </span>
  )
}
