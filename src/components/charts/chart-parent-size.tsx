"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react"

/** `useLayoutEffect` in the browser, `useEffect` on the server (no SSR warning). */
export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

export interface ElementSize {
  width: number
  height: number
}

const ZERO_SIZE: ElementSize = { width: 0, height: 0 }

/**
 * Layout size of `element`, unaffected by CSS transforms. Fractional like
 * `ResizeObserver`'s `contentRect`, so the observer's first notification
 * matches and doesn't trigger a second render.
 */
function readElementSize(element: HTMLElement): ElementSize {
  const style = getComputedStyle(element)
  const width = Number.parseFloat(style.width)
  const height = Number.parseFloat(style.height)
  return {
    width: Number.isFinite(width) ? width : element.clientWidth,
    height: Number.isFinite(height) ? height : element.clientHeight,
  }
}

export interface ElementSizeOptions {
  /**
   * - `"layout"` (default): measure in a layout effect so the sized render
   *   commits before the first paint; later `ResizeObserver` changes are
   *   throttled to one update per `debounceTime`.
   * - `"observer"`: visx `useParentSize` timing, for charts whose enter
   *   motion was tuned on it. Stays 0×0 until the observer's first
   *   notification (applied in the next animation frame), reads the
   *   content-box size (`contentRect`), and debounces like visx: the first
   *   change applies at once, later ones once `debounceTime` passes without
   *   another.
   */
  timing?: "layout" | "observer"
}

const sameSize = (a: ElementSize, b: ElementSize) =>
  a.width === b.width && a.height === b.height

/**
 * visx `debounce(fn, wait, { leading: true })`: fires on the first call, then
 * once more with the latest argument `wait` ms after the last call (only if
 * there were calls after the leading one).
 */
function leadingDebounce<A>(fn: (arg: A) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let pending: { arg: A } | null = null
  const debounced = (arg: A) => {
    if (timeout === undefined) {
      fn(arg)
      pending = null
    } else {
      pending = { arg }
    }
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = undefined
      if (pending !== null) {
        fn(pending.arg)
        pending = null
      }
    }, wait)
  }
  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = undefined
    pending = null
  }
  return debounced
}

/**
 * Tracks an element's size. The first measurement happens in a layout effect,
 * so the sized render commits before the browser paints its first frame
 * (no blank frame while a `ResizeObserver` round-trips). Later changes come
 * from a `ResizeObserver`; `debounceTime` coalesces bursts after an
 * immediate leading update. `timing: "observer"` keeps visx `useParentSize`
 * behaviour instead (see {@link ElementSizeOptions}).
 */
export function useElementSize<T extends HTMLElement>(
  ref: RefObject<T | null>,
  debounceTime = 0,
  { timing = "layout" }: ElementSizeOptions = {}
): ElementSize {
  const [size, setSize] = useState<ElementSize>(ZERO_SIZE)

  // visx useParentSize: passive effect, rAF-deferred observer callbacks.
  useEffect(() => {
    const element = ref.current
    if (
      timing !== "observer" ||
      !element ||
      typeof ResizeObserver === "undefined"
    ) {
      return
    }
    const resize = leadingDebounce<ElementSize>((next) => {
      setSize((prev) => (sameSize(prev, next) ? prev : next))
    }, debounceTime)
    let frame = 0
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        frame = requestAnimationFrame(() => resize({ width, height }))
      }
    })
    observer.observe(element)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.cancel()
    }
  }, [ref, debounceTime, timing])

  useIsomorphicLayoutEffect(() => {
    const element = ref.current
    if (timing !== "layout" || !element) {
      return
    }
    const apply = () => {
      const next = readElementSize(element)
      setSize((prev) => (sameSize(prev, next) ? prev : next))
    }
    apply()

    if (typeof ResizeObserver === "undefined") {
      return
    }
    let timeout: ReturnType<typeof setTimeout> | null = null
    let trailing = false
    const observer = new ResizeObserver(() => {
      if (debounceTime <= 0) {
        apply()
        return
      }
      if (timeout !== null) {
        trailing = true
        return
      }
      apply()
      const flush = () => {
        if (trailing) {
          trailing = false
          apply()
          timeout = setTimeout(flush, debounceTime)
          return
        }
        timeout = null
      }
      timeout = setTimeout(flush, debounceTime)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      if (timeout !== null) {
        clearTimeout(timeout)
      }
    }
  }, [ref, debounceTime, timing])

  return size
}

export interface ChartParentSizeProps {
  children: (size: { width: number; height: number }) => ReactNode
  className?: string
  debounceTime?: number
  style?: CSSProperties
}

/**
 * Drop-in for visx `<ParentSize>` without its `overflow: hidden` measuring
 * layer, so tooltips, markers, and strokes at the chart edge aren't clipped.
 * Measures before first paint (see {@link useElementSize}).
 */
export function ParentSize({
  children,
  className,
  debounceTime,
  style,
}: ChartParentSizeProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const { width, height } = useElementSize(parentRef, debounceTime ?? 300)
  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <div ref={parentRef} style={{ position: "absolute", inset: 0 }}>
        {children({ width, height })}
      </div>
    </div>
  )
}
