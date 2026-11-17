"use client"

import type { RefObject } from "react"
import { useLayoutEffect, useRef, useState } from "react"
import {
  animate,
  AnimatePresence,
  cancelFrame,
  domAnimation,
  frame,
  frameData,
  LazyMotion,
  m,
  useReducedMotion,
  useReducedMotionConfig,
  useSpring,
  type AnimationPlaybackControls,
  type MotionValue,
  type Process,
} from "motion/react"
import { createPortal, flushSync } from "react-dom"

import { cn } from "@/lib/utils"

import { useChartConfig, type SpringConfig } from "../chart-config-context"
import { chartCssVars, useChartPortalContainer } from "../chart-context"

export interface TooltipBoxProps {
  /** X position in pixels (relative to container) */
  x: number
  /** Y position in pixels (relative to container) */
  y: number
  /** Whether the tooltip is visible */
  visible: boolean
  /** Container ref for portal rendering */
  containerRef: RefObject<HTMLDivElement | null>
  /** Container width for flip detection */
  containerWidth: number
  /** Container height for bounds clamping */
  containerHeight: number
  /** Offset from the target position */
  offset?: number
  /** Custom class name */
  className?: string
  /** Tooltip content */
  children: React.ReactNode
  /** Override left position (bypasses internal calculation) */
  left?: number | ReturnType<typeof useSpring>
  /** Override top position (bypasses internal calculation) */
  top?: number | ReturnType<typeof useSpring>
  /** Force flip direction (for custom positioning) */
  flipped?: boolean
  /**
   * X (container px) that decides which side the panel opens on. Default: `x`.
   * Nearest-point hover passes the column x so every point in a column opens
   * on the same side (no flip — and entrance replay — between nearby points).
   */
  flipX?: number
  /** Per-chart override; falls back to `ChartConfigProvider.tooltipBoxSpring`. */
  springConfig?: SpringConfig
  /** Animate panel position with a spring. Default: true */
  animate?: boolean
  /** Fade/scale the panel on show. Default: true */
  entrance?: boolean
  /**
   * Fade the panel out when `visible` turns false (via `AnimatePresence`).
   * Requires `entrance`. Keep the box mounted and toggle `visible` (rather
   * than unmounting it) so the exit can play. Default: true
   */
  exit?: boolean
  /**
   * Replay the panel entrance when it flips sides. `false` springs the panel
   * across instead (used by nearest-point hover, where neighbouring points
   * can sit on either side of the flip line). Default: true
   */
  replayOnFlip?: boolean
  /**
   * Tween the panel to its new size when the content grows or shrinks (e.g.
   * longer values, marker content). Off under reduced motion and when
   * `animate` or `entrance` is false. Default: true
   */
  animateSize?: boolean
  /** Inline styles for the inner tooltip panel. */
  panelStyle?: React.CSSProperties
  /**
   * Tooltip panel background color (CSS variable or color value).
   * Default: `var(--chart-tooltip-background)`.
   */
  backgroundColor?: string
}

/**
 * Rounded panel with a 1px ring layered over the shadow (instead of a border,
 * so it takes no layout space). Background and blur are appended at render.
 */
export const TOOLTIP_PANEL_CLASS_NAME =
  "relative min-w-35 rounded-lg text-chart-tooltip-foreground shadow-lg ring-1 ring-foreground/10 dark:ring-foreground/15"

/** Clips content to the panel's radius. */
export const TOOLTIP_PANEL_INNER_CLASS_NAME = "overflow-hidden rounded-lg"

/** Panel scale/fade-in on show. */
const PANEL_ENTRANCE_SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 25,
} as const

/**
 * Panel size tween when its content grows or shrinks. Critically damped (no
 * overshoot, so a shrinking panel never dips under its content) and a little
 * quicker than the entrance, so it reads as the panel hugging the new content.
 */
const PANEL_SIZE_SPRING = {
  type: "spring",
  stiffness: 500,
  damping: 45,
} as const

/** Layout sizes (unaffected by transforms) of the panel and its clip box. */
interface PanelSizes {
  panelWidth: number
  panelHeight: number
  clipWidth: number
  clipHeight: number
}

const mixNumber = (from: number, to: number, progress: number) =>
  from + (to - from) * progress

function mixPanelSizes(
  from: PanelSizes,
  to: PanelSizes,
  progress: number
): PanelSizes {
  return {
    panelWidth: mixNumber(from.panelWidth, to.panelWidth, progress),
    panelHeight: mixNumber(from.panelHeight, to.panelHeight, progress),
    clipWidth: mixNumber(from.clipWidth, to.clipWidth, progress),
    clipHeight: mixNumber(from.clipHeight, to.clipHeight, progress),
  }
}

/** One 60 Hz frame (ms). */
const FRAME_MS = 1000 / 60

/** Observe border-box sizes (what `readBorderBox` reads). */
const BORDER_BOX: ResizeObserverOptions = { box: "border-box" }

const samePanelSizes = (a: PanelSizes, b: PanelSizes) =>
  a.panelWidth === b.panelWidth &&
  a.panelHeight === b.panelHeight &&
  a.clipWidth === b.clipWidth &&
  a.clipHeight === b.clipHeight

/** Pixel radius from the computed top-left radius, or `null` (e.g. `%`). */
function readPxRadius(element: HTMLElement): number | null {
  const value = getComputedStyle(element).borderTopLeftRadius
  return value.endsWith("px") ? Number.parseFloat(value) : null
}

/**
 * Radius `r` (px) as per-axis percentages of the drawn (scaled) size, so the
 * corners stay round while the box is scaled — Motion's own correction.
 */
function correctedRadius(r: number, width: number, height: number): string {
  const x = width === 0 ? 0 : (r / width) * 100
  const y = height === 0 ? 0 : (r / height) * 100
  return `${x}% / ${y}%`
}

const ratio = (drawn: number, layout: number) =>
  layout === 0 ? 1 : drawn / layout

interface PanelRadii {
  panel: number | null
  clip: number | null
  panelInline: string
  clipInline: string
}

/** Border-box layout size (fractional, unaffected by transforms). */
function readBorderBox(element: HTMLElement): [number, number] {
  const style = getComputedStyle(element)
  let width = Number.parseFloat(style.width)
  let height = Number.parseFloat(style.height)
  if (!(Number.isFinite(width) && Number.isFinite(height))) {
    return [element.offsetWidth, element.offsetHeight]
  }
  if (style.boxSizing !== "border-box") {
    width +=
      Number.parseFloat(style.paddingLeft) +
      Number.parseFloat(style.paddingRight) +
      Number.parseFloat(style.borderLeftWidth) +
      Number.parseFloat(style.borderRightWidth)
    height +=
      Number.parseFloat(style.paddingTop) +
      Number.parseFloat(style.paddingBottom) +
      Number.parseFloat(style.borderTopWidth) +
      Number.parseFloat(style.borderBottomWidth)
  }
  return [width, height]
}

function readPanelSizes(panel: HTMLElement, clip: HTMLElement): PanelSizes {
  const [panelWidth, panelHeight] = readBorderBox(panel)
  const [clipWidth, clipHeight] = readBorderBox(clip)
  return { panelWidth, panelHeight, clipWidth, clipHeight }
}

/**
 * One frame of the size tween at `progress` (0–1): the panel scaled to the
 * drawn size, the clip kept at its unscaled offset (the border) inside it and
 * scaled to its own drawn size, the content counter-scaled to 1.
 */
function drawPanelTween(
  {
    panel,
    clip,
    content,
  }: { panel: HTMLElement; clip: HTMLElement; content: HTMLElement },
  radii: PanelRadii,
  from: PanelSizes,
  target: PanelSizes,
  progress: number
) {
  const drawn = mixPanelSizes(from, target, progress)
  const scaleX = ratio(drawn.panelWidth, target.panelWidth)
  const scaleY = ratio(drawn.panelHeight, target.panelHeight)
  const clipScaleX = ratio(drawn.clipWidth, target.clipWidth)
  const clipScaleY = ratio(drawn.clipHeight, target.clipHeight)
  panel.style.transform = `scale(${scaleX}, ${scaleY})`
  const offsetX = clip.offsetLeft / scaleX - clip.offsetLeft
  const offsetY = clip.offsetTop / scaleY - clip.offsetTop
  const translate =
    offsetX || offsetY ? `translate3d(${offsetX}px, ${offsetY}px, 0px) ` : ""
  clip.style.transform = `${translate}scale(${clipScaleX / scaleX}, ${
    clipScaleY / scaleY
  })`
  content.style.transform = `scale(${1 / clipScaleX}, ${1 / clipScaleY})`
  if (radii.panel !== null) {
    panel.style.borderRadius = correctedRadius(
      radii.panel,
      drawn.panelWidth,
      drawn.panelHeight
    )
  }
  if (radii.clip !== null) {
    clip.style.borderRadius = correctedRadius(
      radii.clip,
      drawn.clipWidth,
      drawn.clipHeight
    )
  }
}

/**
 * Tooltip panel size tween: the same FLIP scale Motion's `layout="size"`
 * produced, without the layout/projection feature bundle (so charts can use
 * `m` + `domAnimation`).
 *
 * When the panel's layout size changes, it is drawn at its previous size and
 * scaled to the new one with `PANEL_SIZE_SPRING` — a 0 → 1000 progress with
 * velocity 0 that starts on the next frame, like Motion's layout animation.
 * The clip box follows the panel (kept at its unscaled border offset) and the
 * content is counter-scaled, so it is drawn at its final size and revealed by
 * the clip — text never stretches. Radii are corrected per axis so the
 * corners stay round. A change mid-tween restarts from the size drawn now.
 *
 * Sizes are layout sizes (computed `width` / `height`, unaffected by
 * transforms), so the layout box (and the `offsetWidth` / `offsetHeight`
 * callers use for flip and clamp) is always the final size and a scaled
 * ancestor (entrance, Studio zoom) does not skew the tween. They are read in a
 * `ResizeObserver` callback (after layout, before paint — the frame the new
 * size first shows), so a re-render never forces a layout of its own; without
 * `ResizeObserver` they are checked after every render. The first
 * measurement only records the size: the entrance owns the mount.
 */
function usePanelSizeTween(
  panelRef: RefObject<HTMLDivElement | null>,
  clipRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  enabled: boolean
) {
  const checkRef = useRef<(() => void) | null>(null)

  useLayoutEffect(() => {
    const panel = panelRef.current
    const clip = clipRef.current
    const content = contentRef.current
    if (!(enabled && panel && clip && content)) {
      return
    }

    const observing = typeof ResizeObserver !== "undefined"
    let target = readPanelSizes(panel, clip)
    let from: PanelSizes | null = null
    let progress = 1
    let controls: AnimationPlaybackControls | undefined
    let pendingStart: Process | undefined
    // Read when a tween starts; the inline values are restored when it ends.
    let radii: PanelRadii | null = null

    const stop = () => {
      if (pendingStart) {
        cancelFrame(pendingStart)
        pendingStart = undefined
      }
      controls?.stop()
      controls = undefined
    }

    const reset = () => {
      panel.style.transform = ""
      clip.style.transform = ""
      content.style.transform = ""
      if (radii) {
        panel.style.borderRadius = radii.panelInline
        clip.style.borderRadius = radii.clipInline
        radii = null
      }
    }

    const draw = (latest: number) => {
      progress = latest
      if (from && radii) {
        drawPanelTween({ panel, clip, content }, radii, from, target, latest)
      }
    }

    const check = () => {
      const next = readPanelSizes(panel, clip)
      if (samePanelSizes(next, target)) {
        return
      }
      from =
        from && progress < 1 ? mixPanelSizes(from, target, progress) : target
      target = next
      stop()
      radii ??= {
        panel: readPxRadius(panel),
        clip: readPxRadius(clip),
        panelInline: panel.style.borderRadius,
        clipInline: clip.style.borderRadius,
      }
      // This frame draws the old size; the spring starts on the next one.
      draw(0)
      const startTween = (elapsed: number) => {
        controls = animate(0, 1000, {
          ...PANEL_SIZE_SPRING,
          elapsed,
          velocity: 0,
          onUpdate: (latest) => draw(latest / 1000),
          onComplete: () => {
            progress = 1
            from = null
            controls = undefined
            reset()
          },
        })
      }
      // The observer reports after this frame's Motion batch: date the spring
      // from that batch, as if it had started in it (t = 0 is this frame).
      // No batch ran this frame: start now, which still ticks next frame.
      if (observing) {
        const sinceFrame = performance.now() - frameData.timestamp
        startTween(sinceFrame >= 0 && sinceFrame < FRAME_MS ? sinceFrame : 0)
        return
      }
      pendingStart = frame.update(() => {
        pendingStart = undefined
        startTween(0)
      })
    }

    if (!observing) {
      checkRef.current = check
      return () => {
        checkRef.current = null
        stop()
        reset()
      }
    }
    // Size changes are read after layout, before paint — never forcing a
    // layout per render — so the old size is drawn in the frame the new
    // layout first shows.
    const observer = new ResizeObserver(check)
    observer.observe(panel, BORDER_BOX)
    observer.observe(clip, BORDER_BOX)
    return () => {
      observer.disconnect()
      stop()
      reset()
    }
  }, [panelRef, clipRef, contentRef, enabled])

  // No `ResizeObserver`: measure after every render (new content) instead.
  useLayoutEffect(() => {
    checkRef.current?.()
  })
}

const ORIGIN_TOP_LEFT: React.CSSProperties = { transformOrigin: "0 0" }

/**
 * The tooltip panel: an entrance wrapper (scale/slide pivoting on
 * `transformOrigin`) around the styled panel (fade + size), its clip box and
 * the content.
 *
 * `animateSize` tweens the panel to its new size when the content changes
 * (`usePanelSizeTween`). That is a transform, so the panel's layout box (and
 * the `offsetWidth` / `offsetHeight` used for flip and clamp) is always the
 * final size, and position stays with the caller's springs. The clip box
 * follows the panel, and the content is scale-corrected (drawn at its final
 * size and revealed by the clip), so text never stretches. All three are
 * anchored top-left, so the tween has no translate. The entrance lives on the
 * wrapper so its pivot can differ.
 *
 * No size tween on mount (the entrance owns that) or under `MotionConfig`
 * reduced motion. Callers pass `false` under reduced motion and when the
 * position is not animated.
 */
export function TooltipPanel({
  animateSize,
  entrance,
  transformOrigin,
  className,
  style,
  children,
}: {
  animateSize: boolean
  /** Entrance scale/slide start, or `false` to only fade in. */
  entrance: { scale: number; x?: number } | false
  transformOrigin: string
  className: string
  style: React.CSSProperties
  children: React.ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // `MotionConfig reducedMotion` made Motion's layout tween instant.
  const reducedMotionConfig = useReducedMotionConfig() === true
  usePanelSizeTween(
    panelRef,
    clipRef,
    contentRef,
    animateSize && !reducedMotionConfig
  )

  return (
    <m.div
      animate={{ scale: 1, x: 0 }}
      initial={entrance === false ? false : { x: 0, ...entrance }}
      style={{ transformOrigin }}
      transition={PANEL_ENTRANCE_SPRING}
    >
      <m.div
        animate={{ opacity: 1 }}
        className={className}
        initial={{ opacity: 0 }}
        ref={panelRef}
        style={{ ...style, ...ORIGIN_TOP_LEFT }}
        transition={PANEL_ENTRANCE_SPRING}
      >
        <div
          className={TOOLTIP_PANEL_INNER_CLASS_NAME}
          ref={clipRef}
          style={ORIGIN_TOP_LEFT}
        >
          <div ref={contentRef} style={ORIGIN_TOP_LEFT}>
            {children}
          </div>
        </div>
      </m.div>
    </m.div>
  )
}

/** Spring to `value`, or jump there (no animation) when `snap`. */
function moveTo(
  spring: MotionValue<number>,
  value: number,
  snap: boolean
): void {
  if (snap) {
    spring.jump(value)
  } else {
    spring.set(value)
  }
}

const DEFAULT_TOOLTIP_WIDTH = 180
const DEFAULT_TOOLTIP_HEIGHT = 80

/**
 * Stores the box's layout size (`offsetWidth` / `offsetHeight`, unaffected by
 * the size tween's transforms) in the refs, keeping the last size when it
 * reads 0 (e.g. hidden). Returns whether it changed.
 */
function readPanelBoxSize(
  el: HTMLElement,
  widthRef: { current: number },
  heightRef: { current: number }
): boolean {
  const w = el.offsetWidth
  const h = el.offsetHeight
  const changed =
    (w > 0 && w !== widthRef.current) || (h > 0 && h !== heightRef.current)
  if (w > 0) {
    widthRef.current = w
  }
  if (h > 0) {
    heightRef.current = h
  }
  return changed
}

/** Panel position beside the cursor: flips left near the right edge and is
 * clamped vertically inside the container. */
function resolveTooltipTarget({
  x,
  flipX = x,
  y,
  width,
  height,
  offset,
  containerWidth,
  containerHeight,
}: {
  x: number
  flipX?: number
  y: number
  width: number
  height: number
  offset: number
  containerWidth: number
  containerHeight: number
}) {
  const flipped = flipX + width + offset > containerWidth
  return {
    flipped,
    left: flipped ? x - offset - width : x + offset,
    top: Math.max(
      offset,
      Math.min(y - height / 2, containerHeight - height - offset)
    ),
  }
}

// Inner-only-on-visible so `useSpring` initializes at the cursor's actual x/y
// instead of (0, 0) on first hover.
export function TooltipBox(props: TooltipBoxProps) {
  const container = useChartPortalContainer(props.containerRef)
  if (!container) {
    return null
  }
  const inner = props.visible ? (
    <TooltipBoxInner {...props} container={container} key="tooltip-box" />
  ) : null
  // Own feature scope: the box also renders outside chart roots.
  return (
    <LazyMotion features={domAnimation}>
      {props.exit !== false && props.entrance !== false ? (
        <AnimatePresence>{inner}</AnimatePresence>
      ) : (
        inner
      )}
    </LazyMotion>
  )
}

function TooltipBoxInner({
  x,
  y,
  containerWidth,
  containerHeight,
  offset = 16,
  className = "",
  children,
  left: leftOverride,
  top: topOverride,
  flipped: flippedOverride,
  flipX,
  springConfig,
  animate = true,
  entrance = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exit: _exit,
  replayOnFlip = true,
  animateSize = true,
  panelStyle,
  backgroundColor = chartCssVars.tooltipBackground,
  container,
}: Omit<TooltipBoxProps, "visible" | "containerRef"> & {
  container: HTMLElement
}) {
  const { tooltipBoxSpring } = useChartConfig()
  // Reduced motion: position jumps instead of springing and the panel skips
  // its scale/slide; opacity fades are kept.
  const reducedMotion = useReducedMotion() === true
  const effectiveSpring = springConfig ?? tooltipBoxSpring

  const tooltipRef = useRef<HTMLDivElement>(null)
  // Last measured panel size (flip and clamp are computed from it).
  const tooltipWidthRef = useRef(DEFAULT_TOOLTIP_WIDTH)
  const tooltipHeightRef = useRef(DEFAULT_TOOLTIP_HEIGHT)
  // Non-animated position: React only renders the mount position; the layout
  // effect below writes later positions straight to the element, so each
  // pointer move costs one render instead of render + sync re-render.
  const [staticPosition] = useState(() => ({ left: x, top: y }))
  // First measured position jumps (no spring from the estimated size).
  const hasPositionedRef = useRef(false)

  // Flip side + replay key for the panel entrance. Seeded from the default
  // size (the inner box mounts fresh on every show); refined from the measured
  // width in the layout effect, which only re-renders when the side changes.
  const [flip, setFlip] = useState(() => ({
    flipped: (flipX ?? x) + DEFAULT_TOOLTIP_WIDTH + offset > containerWidth,
    key: 0,
  }))
  const shouldFlipX = flip.flipped

  const [initialTarget] = useState(() =>
    resolveTooltipTarget({
      x,
      flipX,
      y,
      width: DEFAULT_TOOLTIP_WIDTH,
      height: DEFAULT_TOOLTIP_HEIGHT,
      offset,
      containerWidth,
      containerHeight,
    })
  )
  const animatedLeft = useSpring(initialTarget.left, effectiveSpring)
  const animatedTop = useSpring(initialTarget.top, effectiveSpring)

  // Re-places the panel for the latest props; set by the layout effect below
  // and called by the size observer when the panel resizes.
  const placeRef = useRef<((fromObserver: boolean) => void) | null>(null)
  // The size is read synchronously once, on show. After that a
  // `ResizeObserver` reports changes after layout (before paint), so a
  // pointer move never forces a layout just to measure the panel.
  const sizeObservedRef = useRef(false)

  useLayoutEffect(() => {
    const el = tooltipRef.current
    if (!el) {
      return
    }
    if (!sizeObservedRef.current) {
      readPanelBoxSize(el, tooltipWidthRef, tooltipHeightRef)
      sizeObservedRef.current = typeof ResizeObserver !== "undefined"
    }
    const place = (fromObserver: boolean) => {
      const target = resolveTooltipTarget({
        x,
        flipX,
        y,
        width: tooltipWidthRef.current,
        height: tooltipHeightRef.current,
        offset,
        containerWidth,
        containerHeight,
      })
      const updateFlip = () =>
        setFlip((prev) =>
          prev.flipped === target.flipped
            ? prev
            : { flipped: target.flipped, key: prev.key + 1 }
        )
      // The observer runs outside React: commit a side change before paint,
      // as the update from this layout effect would.
      if (fromObserver) {
        flushSync(updateFlip)
      } else {
        updateFlip()
      }
      const tx = target.left
      const ty = target.top
      if (!animate) {
        const left = `${tx}px`
        const top = `${ty}px`
        if (el.style.left !== left) {
          el.style.left = left
        }
        if (el.style.top !== top) {
          el.style.top = top
        }
        return
      }
      const snap = reducedMotion || !hasPositionedRef.current
      hasPositionedRef.current = true
      if (leftOverride === undefined) {
        moveTo(animatedLeft, tx, snap)
      }
      if (topOverride === undefined) {
        moveTo(animatedTop, ty, snap)
      }
    }
    placeRef.current = place
    place(false)
  }, [
    x,
    flipX,
    y,
    containerWidth,
    containerHeight,
    offset,
    leftOverride,
    topOverride,
    animate,
    animatedLeft,
    animatedTop,
    reducedMotion,
  ])

  // Content changes resize the panel: re-place it from the new size. The
  // callback runs after layout, so reading the size there is free.
  useLayoutEffect(() => {
    const el = tooltipRef.current
    if (!el || typeof ResizeObserver === "undefined") {
      return
    }
    const observer = new ResizeObserver(() => {
      if (readPanelBoxSize(el, tooltipWidthRef, tooltipHeightRef)) {
        placeRef.current?.(true)
      }
    })
    observer.observe(el, BORDER_BOX)
    return () => observer.disconnect()
  }, [])

  const flipKey = replayOnFlip ? flip.key : 0

  const finalLeft = animate
    ? (leftOverride ?? animatedLeft)
    : staticPosition.left
  const finalTop = animate ? (topOverride ?? animatedTop) : staticPosition.top
  const isFlipped = flippedOverride ?? shouldFlipX
  const transformOrigin = isFlipped ? "right top" : "left top"

  // Internal classes only (no caller className): no tailwind-merge needed.
  const panelClassName = `${TOOLTIP_PANEL_CLASS_NAME}${
    panelStyle?.backgroundColor === undefined &&
    backgroundColor === chartCssVars.tooltipBackground
      ? " bg-chart-tooltip-background"
      : ""
  }${panelStyle?.backdropFilter === undefined ? " backdrop-blur-md" : ""}`
  const panelStyleResolved = {
    ...(panelStyle?.backgroundColor === undefined && {
      backgroundColor,
    }),
    ...panelStyle,
  }

  if (!entrance) {
    return createPortal(
      <div
        className={cn("pointer-events-none absolute z-50", className)}
        ref={tooltipRef}
        style={{ left: staticPosition.left, top: staticPosition.top }}
      >
        <div
          className={panelClassName}
          style={{ transformOrigin, ...panelStyleResolved }}
        >
          <div className={TOOLTIP_PANEL_INNER_CLASS_NAME}>{children}</div>
        </div>
      </div>,
      container
    )
  }

  return createPortal(
    <m.div
      animate={{ opacity: 1 }}
      className={cn("pointer-events-none absolute z-50", className)}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      ref={tooltipRef}
      style={{ left: finalLeft, top: finalTop }}
      transition={{ duration: 0.1 }}
    >
      <TooltipPanel
        // Positions jump in the static path (a re-render mid-commit), which a
        // layout animation would read as a move, and "no motion" means none.
        animateSize={animateSize && animate && !reducedMotion}
        className={panelClassName}
        entrance={
          reducedMotion ? false : { scale: 0.85, x: isFlipped ? 20 : -20 }
        }
        key={flipKey}
        style={panelStyleResolved}
        transformOrigin={transformOrigin}
      >
        {children}
      </TooltipPanel>
    </m.div>,
    container
  )
}

TooltipBox.displayName = "TooltipBox"

export default TooltipBox
