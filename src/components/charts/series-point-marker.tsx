"use client"

import { memo, useLayoutEffect, useRef } from "react"
import { MotionGlobalConfig } from "motion/react"

import { DEFAULT_ANIMATION_EASING } from "./animation"

export interface SeriesPointMarkerStyle {
  /** Fill color for the inner circle */
  fill?: string
  /** Outer ring stroke color. Default: same as `fill` */
  stroke?: string
  /** Outer ring stroke width in px. Default: 2. Set to 0 to disable. */
  strokeWidth?: number
  /** Gap between the inner fill and outer ring in px. Default: 2 */
  ringGap?: number
  /** Optional outer outline beyond the ring. Default: 0 */
  outlineWidth?: number
  /** Outer outline color. Default: same as `stroke` */
  outlineColor?: string
  /** Point radius in px. Default: 5 */
  radius?: number
  /** Dim non-active points while hovering. Default: true */
  fadeOnHover?: boolean
  /** Opacity for non-hovered points when `fadeOnHover` is true. Default: 0.5 */
  inactiveOpacity?: number
  /**
   * Blur in px for non-hovered points when `fadeOnHover` is true.
   * Applied once on the dimmed layer (not per dot) for performance. Default: 2
   */
  inactiveBlur?: number
  /** Initial blur in px during enter animation. Default: 2 */
  enterBlur?: number
  /** Enlarge the active point while hovering. Default: true */
  showActiveHighlight?: boolean
}

interface MarkerCirclesProps {
  fill?: string
  stroke?: string
  strokeWidth: number
  ringGap: number
  outlineWidth: number
  outlineColor?: string
  radius: number
}

function MarkerCircles({
  fill,
  stroke,
  strokeWidth,
  ringGap,
  outlineWidth,
  outlineColor,
  radius,
}: MarkerCirclesProps) {
  const resolvedStroke = stroke ?? fill ?? "currentColor"
  const resolvedOutlineColor = outlineColor ?? resolvedStroke
  const ringOuter = strokeWidth > 0 ? radius + ringGap + strokeWidth : radius
  const outlineRadius = outlineWidth > 0 ? ringOuter + outlineWidth / 2 : 0

  return (
    <>
      {outlineWidth > 0 ? (
        <circle
          cx={0}
          cy={0}
          fill="none"
          r={outlineRadius}
          stroke={resolvedOutlineColor}
          strokeWidth={outlineWidth}
        />
      ) : null}
      <circle cx={0} cy={0} fill={fill} r={radius} />
      {strokeWidth > 0 ? (
        <circle
          cx={0}
          cy={0}
          fill="none"
          r={radius + ringGap + strokeWidth / 2}
          stroke={resolvedStroke}
          strokeWidth={strokeWidth}
        />
      ) : null}
    </>
  )
}

export interface StaticSeriesPointMarkerProps extends SeriesPointMarkerStyle {
  cx: number
  cy: number
  scale?: number
}

export const StaticSeriesPointMarker = memo(function StaticSeriesPointMarker({
  cx,
  cy,
  scale = 1,
  fill,
  stroke,
  strokeWidth = 2,
  ringGap = 2,
  outlineWidth = 0,
  outlineColor,
  radius = 5,
}: StaticSeriesPointMarkerProps) {
  // Plain dot (no ring / outline): one positioned circle instead of a
  // translated group, halving DOM nodes for large scatter plots. Scaling a
  // lone circle about its centre is the same as scaling its radius.
  if (strokeWidth <= 0 && outlineWidth <= 0) {
    return <circle cx={cx} cy={cy} fill={fill} r={radius * scale} />
  }
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      <MarkerCircles
        fill={fill}
        outlineColor={outlineColor}
        outlineWidth={outlineWidth}
        radius={radius}
        ringGap={ringGap}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </g>
  )
})

export interface SeriesPointMarkerProps extends SeriesPointMarkerStyle {
  dataKey: string
  index: number
  cx: number
  cy: number
  revealDelay: number
  revealEpoch: number
  enterDuration: number
}

/** Marker style once the enter fade has finished (what Motion left inline). */
const MARKER_ENTERED_STYLE = { opacity: 1, filter: "blur(0px)" } as const

/**
 * Enter marker — used only while the chart reveal is running.
 *
 * The fade/unblur is a Web Animation, not a Motion component: same keyframes,
 * delay, duration and easing (`DEFAULT_ANIMATION_EASING` is the chart enter
 * curve `[0.85, 0, 0.15, 1]`), but run by the browser, so a reveal with many
 * markers costs no per-frame JS and no Motion visual element per point. The
 * element renders its entered style and the animation's `backwards` fill
 * holds the hidden keyframe through the delay, before first paint. Like
 * Motion's mount animation the timing is fixed when it starts (a new
 * `revealEpoch` replays it), and `MotionGlobalConfig.skipAnimations` (OG
 * screenshots) shows the end state.
 */
export function SeriesPointMarker({
  dataKey,
  index,
  cx,
  cy,
  enterBlur = 2,
  revealDelay,
  revealEpoch,
  enterDuration,
  fill,
  stroke,
  strokeWidth = 2,
  ringGap = 2,
  outlineWidth = 0,
  outlineColor,
  radius = 5,
}: SeriesPointMarkerProps) {
  const enterRef = useRef<SVGGElement>(null)
  const timingRef = useRef({ enterBlur, revealDelay, enterDuration })
  // Declared before the replay effect so it runs first and the timing is fresh
  useLayoutEffect(() => {
    timingRef.current = { enterBlur, revealDelay, enterDuration }
  })

  // Replays per reveal epoch only; the timing is read when it starts.
  useLayoutEffect(() => {
    const element = enterRef.current
    if (
      !element ||
      typeof element.animate !== "function" ||
      MotionGlobalConfig.skipAnimations ||
      MotionGlobalConfig.instantAnimations
    ) {
      return
    }
    const timing = timingRef.current
    const animation = element.animate(
      [
        { opacity: 0, filter: `blur(${timing.enterBlur}px)` },
        MARKER_ENTERED_STYLE,
      ],
      {
        delay: timing.revealDelay * 1000,
        duration: timing.enterDuration * 1000,
        easing: DEFAULT_ANIMATION_EASING,
        fill: "backwards",
      }
    )
    return () => animation.cancel()
  }, [revealEpoch])

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <g
        key={`${dataKey}-${index}-${revealEpoch}`}
        ref={enterRef}
        style={MARKER_ENTERED_STYLE}
      >
        <MarkerCircles
          fill={fill}
          outlineColor={outlineColor}
          outlineWidth={outlineWidth}
          radius={radius}
          ringGap={ringGap}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </g>
    </g>
  )
}

export function getSeriesMarkerVisualExtent(
  style: Pick<
    SeriesPointMarkerStyle,
    | "radius"
    | "strokeWidth"
    | "ringGap"
    | "outlineWidth"
    | "showActiveHighlight"
  >
): number {
  const radius = style.radius ?? 5
  const strokeWidth = style.strokeWidth ?? 2
  const ringGap = style.ringGap ?? 2
  const outlineWidth = style.outlineWidth ?? 0
  const showActiveHighlight = style.showActiveHighlight ?? true
  const ring = strokeWidth > 0 ? ringGap + strokeWidth : 0
  const outline = outlineWidth > 0 ? outlineWidth : 0
  const highlightPad = showActiveHighlight ? radius * 0.35 : 0
  return radius + ring + outline + highlightPad + 2
}
