"use client"

import type { CSSProperties, ReactNode, RefObject } from "react"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

import { useChartConfig, type SpringConfig } from "../chart-config-context"
import { chartCssVars, useChartPortalContainer } from "../chart-context"
import { TOOLTIP_PANEL_CLASS_NAME, TooltipPanel } from "./tooltip-box"

export interface CursorTooltipBoxProps {
  /** Whether the tooltip is visible */
  visible: boolean
  /** Chart container: pointer moves over it drive the panel position. */
  containerRef: RefObject<HTMLDivElement | null>
  /** Gap between the cursor and the panel (px). Default: 16 */
  offset?: number
  /** Custom class name */
  className?: string
  /** Tooltip content */
  children: ReactNode
  /** Fade the panel out when `visible` turns false. Default: true */
  exit?: boolean
  /** Per-chart override; falls back to `ChartConfigProvider.tooltipBoxSpring`. */
  springConfig?: SpringConfig
  /**
   * Tween the panel to its new size when the content grows or shrinks. Off
   * under reduced motion. Default: true
   */
  animateSize?: boolean
  /** Inline styles for the inner tooltip panel. */
  panelStyle?: CSSProperties
  /**
   * Tooltip panel background color (CSS variable or color value).
   * Default: `var(--chart-tooltip-background)`.
   */
  backgroundColor?: string
}

const DEFAULT_TOOLTIP_WIDTH = 180
const DEFAULT_TOOLTIP_HEIGHT = 80

/**
 * Tooltip panel that tracks the cursor across a chart container.
 *
 * Pointer moves are read by a native listener and written straight into
 * springs (the shared `tooltipBoxSpring`, like `TooltipBox`) that drive a
 * `transform`, so following the cursor never re-renders React and never
 * triggers layout. React only renders when the content changes (hover target)
 * or the panel flips sides near the right edge. The panel appears at the
 * cursor, then springs after it. Same panel styling and entrance/exit as
 * `TooltipBox`.
 */
export function CursorTooltipBox({
  visible,
  containerRef,
  offset = 16,
  exit = true,
  springConfig,
  ...panelProps
}: CursorTooltipBoxProps) {
  const container = useChartPortalContainer(containerRef)
  const { tooltipBoxSpring } = useChartConfig()
  // Reduced motion: the panel jumps to the cursor instead of springing.
  const reducedMotion = useReducedMotion() === true
  const x = useSpring(0, springConfig ?? tooltipBoxSpring)
  const y = useSpring(0, springConfig ?? tooltipBoxSpring)
  // While hidden, positions jump so the panel appears at the cursor rather
  // than springing in from where it was last shown.
  const visibleRef = useRef(visible)
  useLayoutEffect(() => {
    visibleRef.current = visible
  }, [visible])
  const pointerRef = useRef({ x: 0, y: 0 })
  const sizeRef = useRef({
    width: DEFAULT_TOOLTIP_WIDTH,
    height: DEFAULT_TOOLTIP_HEIGHT,
  })
  const [flipped, setFlipped] = useState(false)
  const flippedRef = useRef(false)

  /** Panel beside the cursor: flips left near the right edge, clamped vertically. */
  const place = useCallback(() => {
    if (!container) {
      return
    }
    const { width, height } = sizeRef.current
    const pointer = pointerRef.current
    const flip = pointer.x + offset + width > container.clientWidth
    const left = flip ? pointer.x - offset - width : pointer.x + offset
    const top = Math.max(
      offset,
      Math.min(pointer.y - height / 2, container.clientHeight - height - offset)
    )
    if (reducedMotion || !visibleRef.current) {
      x.jump(left)
      y.jump(top)
    } else {
      x.set(left)
      y.set(top)
    }
    if (flip !== flippedRef.current) {
      flippedRef.current = flip
      setFlipped(flip)
    }
  }, [container, offset, reducedMotion, x, y])

  useEffect(() => {
    if (!container) {
      return
    }
    const track = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
      place()
    }
    // `pointerover` fires before the hover target's enter handlers, so the
    // panel mounts at the cursor even when entering without a prior move.
    container.addEventListener("pointerover", track, { passive: true })
    container.addEventListener("pointermove", track, { passive: true })
    return () => {
      container.removeEventListener("pointerover", track)
      container.removeEventListener("pointermove", track)
    }
  }, [container, place])

  const onMeasure = useCallback(
    (width: number, height: number) => {
      if (width > 0 && height > 0) {
        sizeRef.current = { width, height }
        place()
      }
    },
    [place]
  )

  if (!container) {
    return null
  }
  const inner = visible ? (
    <CursorTooltipPanel
      {...panelProps}
      container={container}
      flipped={flipped}
      key="cursor-tooltip"
      onMeasure={onMeasure}
      x={x}
      y={y}
    />
  ) : null
  // Own feature scope: the box also renders outside chart roots.
  return (
    <LazyMotion features={domAnimation}>
      {exit ? <AnimatePresence>{inner}</AnimatePresence> : inner}
    </LazyMotion>
  )
}

function CursorTooltipPanel({
  container,
  x,
  y,
  flipped,
  onMeasure,
  className,
  children,
  animateSize = true,
  panelStyle,
  backgroundColor = chartCssVars.tooltipBackground,
}: Pick<
  CursorTooltipBoxProps,
  "className" | "children" | "animateSize" | "panelStyle" | "backgroundColor"
> & {
  container: HTMLElement
  x: MotionValue<number>
  y: MotionValue<number>
  flipped: boolean
  onMeasure: (width: number, height: number) => void
}) {
  const reducedMotion = useReducedMotion() === true
  const panelRef = useRef<HTMLDivElement>(null)

  // Re-measure when the content changes (new hover target), before paint.
  useLayoutEffect(() => {
    const element = panelRef.current
    if (element) {
      onMeasure(element.offsetWidth, element.offsetHeight)
    }
  }, [children, onMeasure])

  return createPortal(
    <m.div
      animate={{ opacity: 1 }}
      className={cn(
        "pointer-events-none absolute top-0 left-0 z-50",
        className
      )}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      ref={panelRef}
      style={{ x, y }}
      transition={{ duration: 0.1 }}
    >
      <TooltipPanel
        animateSize={animateSize && !reducedMotion}
        className={cn(
          TOOLTIP_PANEL_CLASS_NAME,
          panelStyle?.backgroundColor === undefined &&
            backgroundColor === chartCssVars.tooltipBackground &&
            "bg-chart-tooltip-background",
          panelStyle?.backdropFilter === undefined && "backdrop-blur-md"
        )}
        entrance={reducedMotion ? false : { scale: 0.85 }}
        style={{
          ...(panelStyle?.backgroundColor === undefined && {
            backgroundColor,
          }),
          ...panelStyle,
        }}
        transformOrigin={flipped ? "right center" : "left center"}
      >
        {children}
      </TooltipPanel>
    </m.div>,
    container
  )
}

CursorTooltipBox.displayName = "CursorTooltipBox"

export default CursorTooltipBox
