"use client"

import { memo, useEffect, useMemo, type CSSProperties } from "react"
import { m, useReducedMotion, useSpring } from "motion/react"
import { createPortal } from "react-dom"

import {
  resolveTooltipBoxMotion,
  useChartConfig,
  type SpringConfig,
} from "../chart-config-context"
import {
  chartCssVars,
  DISCRETE_INTERACTION_LABEL_THRESHOLD,
  useChart,
  useChartPortalContainer,
  useChartStable,
  type LineConfig,
  type Margin,
  type TooltipData,
} from "../chart-context"
import { formatBandRange, weekdayDateFmt } from "../chart-formatters"
import { registerDatePill } from "../date-pill-store"
import type { IndicatorFadeEdges } from "../indicator-fade"
import {
  DateTicker,
  type DateTickerAnimation,
  type DateTickerVariant,
} from "./date-ticker"
import { TooltipBox, type TooltipBoxProps } from "./tooltip-box"
import { TooltipContent, type TooltipRow } from "./tooltip-content"
import { TooltipDot } from "./tooltip-dot"
import { TooltipIndicator } from "./tooltip-indicator"
import {
  resolveDatePillVelocity,
  useVelocityStretch,
  type DatePillVelocityConfig,
} from "./use-velocity-stretch"

/** Props passed to a custom `datePill` renderer. */
export interface ChartTooltipDatePillRenderProps {
  /** Hovered row's label (from `dateLabels`). */
  label: string
  /** Hovered row index. */
  index: number
  /** Hovered data row. */
  point: Record<string, unknown>
}

export interface ChartTooltipProps {
  /**
   * Show the date pill on the x-axis under the crosshair. Default: `true`.
   * With `false`, `XAxis` highlights the labels near the crosshair instead of
   * fading them (see `XAxis` `hoverEffect`).
   */
  showDatePill?: boolean
  /**
   * How the pill label changes as you hover: `"roll"` scrolls month and
   * day/year like a slot machine, `"static"` swaps the label in place (only
   * the width springs). Above 60 labels the pill is always `"static"`.
   * Default: `"roll"`.
   */
  datePillAnimation?: DateTickerAnimation
  /**
   * Pill surface: `"solid"` dark capsule, or `"glass"` — liquid glass that
   * refracts what's behind it (Chromium; frosted blur elsewhere).
   * Default: `"solid"`.
   */
  datePillVariant?: DateTickerVariant
  /**
   * Swell the pill with speed, like a glass menu: it grows slightly and
   * stretches along the motion, then springs back at rest. `true` uses the
   * defaults; pass an object to tune. Off under reduced motion and for
   * discrete (60+ label) charts. Default: `false`.
   */
  datePillVelocity?: boolean | DatePillVelocityConfig
  /**
   * Classes merged (tailwind-merge) over the default pill surface
   * (`rounded-full bg-zinc-900 px-4 py-1 text-white shadow-lg …`).
   */
  datePillClassName?: string
  /** Inline styles for the pill surface (e.g. `background`, `color`). */
  datePillStyle?: CSSProperties
  /**
   * Replace the pill's contents entirely. The result is still positioned
   * under the crosshair and follows the tooltip spring.
   */
  datePill?: (props: ChartTooltipDatePillRenderProps) => React.ReactNode
  /**
   * Whether to show the crosshair indicator line. Default: `true` for
   * line / area / composed / scatter charts, `false` inside `BarChart`
   * (vertical and horizontal) and `ScatterChart` with `jitter` (hover snaps to
   * the nearest point, not a date) — pass `showCrosshair` to opt in.
   */
  showCrosshair?: boolean
  /** Whether to show dots on the lines. Default: true */
  showDots?: boolean
  /**
   * Dot style: filled circle with a soft same-color halo, or transparent ring.
   * Default: "dot"
   */
  dotVariant?: "dot" | "ring"
  /** Dot core / ring radius in pixels. Default: 5 */
  dotSize?: number
  /**
   * `dot` variant: halo radius as a multiple of the core radius. `0` hides the halo.
   * Default: `2.6`
   */
  dotHaloScale?: number
  /** `dot` variant: halo opacity (0–1). Default: `0.3` */
  dotHaloOpacity?: number
  /** `dot` variant: blur (px) on the halo for a soft glow. `0` = crisp disc. Default: `0` */
  dotHaloBlur?: number
  /** Ring corner radius as a fraction of side length (0 = square, 0.5 = circle). */
  dotRadiusFraction?: number
  /** Multiplier applied to the computed dot / ring pixel radius. Default: 1 */
  dotScale?: number
  /**
   * Ring stroke width in pixels (default `1.5`). For the `dot` variant, draws a
   * background-colored outline around the core (default `0`, none).
   */
  dotStrokeWidth?: number
  /**
   * Color for the crosshair/indicator line. When a function, receives the hovered point
   * (e.g. for candlestick: match candle color from close vs open). Default: --chart-crosshair.
   */
  indicatorColor?: string | ((point: Record<string, unknown>) => string)
  /**
   * Bottom colour of a vertical crosshair ramp: the crosshair blends from
   * `indicatorColor` (top) to this colour (bottom). Composes with the fade.
   */
  indicatorEndColor?: string
  /**
   * Where the crosshair ends: `"plot"` spans the full plot height, `"point"`
   * stops at the hovered point (the topmost dot). Default: `"plot"`.
   */
  indicatorEnd?: "plot" | "point"
  /** Custom content renderer for the tooltip box */
  content?: (props: {
    point: Record<string, unknown>
    index: number
  }) => React.ReactNode
  /** Custom row renderer - return array of TooltipRow */
  rows?: (point: Record<string, unknown>) => TooltipRow[]
  /** Optional mapping of dataKey to label for default row generation */
  rowLabels?: Record<string, string>
  /**
   * Override tooltip dot fill. When omitted and `rows` is set, dot colors match row colors.
   * When a function, receives the hovered point and line config.
   */
  dotColor?:
    | string
    | ((point: Record<string, unknown>, line: LineConfig) => string)
  /** Additional content to show below rows (e.g., markers) */
  children?: React.ReactNode
  /** Custom class name */
  className?: string
  /** Optional labels aligned with chart data for the x-axis ticker. */
  dateLabels?: string[]
  /** Per-chart override for the crosshair / dot / date-pill spring. */
  springConfig?: SpringConfig
  /**
   * When `true`, the floating panel uses the crosshair spring and stays in sync.
   * Default `false` — panel follow uses `damping` (`20`).
   */
  matchCrosshair?: boolean
  /**
   * Spring damping for the floating tooltip panel when `matchCrosshair` is `false`.
   * `0` disables spring motion (instant). Default: `20`.
   */
  damping?: number
  /** SVG stroke dash pattern for the crosshair. Omit for solid. */
  indicatorDasharray?: string
  /** Vertical crosshair fade: `both`, `top`, `bottom`, or `none` (solid). Default: `both`. */
  indicatorFadeEdges?: IndicatorFadeEdges
  /** Crosshair fade zone size (% of height). Default: `10`. */
  indicatorFadeLength?: number
  /** Per-chart override for the floating-panel spring. */
  boxSpringConfig?: SpringConfig
  /** Inline styles for the tooltip panel (background, blur, etc.). */
  panelStyle?: React.CSSProperties
  /**
   * Tooltip panel background color (CSS variable or color value).
   * Default: `var(--chart-tooltip-background)`.
   */
  backgroundColor?: string
  /** Fade the panel out when hover ends. Default: true */
  exit?: boolean
  /**
   * Tween the panel to its new size when the content grows or shrinks. Off
   * under reduced motion and with `damping={0}`. Default: true
   */
  animateSize?: boolean
  /**
   * Extra gap (px) between the top of the plot and the panel when it is pinned
   * to the top (vertical charts without a single active point). Default: `0`.
   */
  topOffset?: number
}

interface ChartTooltipInnerProps extends ChartTooltipProps {
  container: HTMLElement
}

/**
 * Hovered point for nearest-point hover: `activeDataKey`'s point, else the
 * first series with a value in the row. Positions are plot-relative.
 */
function resolveActivePoint(
  tooltipData: TooltipData | null,
  lines: LineConfig[]
): { line: LineConfig; index: number; x: number; y: number } | null {
  if (!tooltipData) {
    return null
  }
  const { activeDataKey, xPositions, yPositions } = tooltipData
  const hasY = (line: LineConfig) => yPositions[line.dataKey] !== undefined
  const line =
    lines.find((l) => l.dataKey === activeDataKey && hasY(l)) ??
    lines.find(hasY)
  const y = line ? yPositions[line.dataKey] : undefined
  if (!line || y === undefined) {
    return null
  }
  return {
    line,
    index: lines.indexOf(line),
    x: xPositions?.[line.dataKey] ?? tooltipData.x,
    y,
  }
}

/** Smallest (topmost) hovered y across series — `indicatorEnd="point"`. */
function resolveTopmostPointY(
  tooltipData: TooltipData | null,
  lines: LineConfig[]
): number | undefined {
  if (!tooltipData) {
    return undefined
  }
  let topmost: number | undefined
  for (const line of lines) {
    const y = tooltipData.yPositions[line.dataKey]
    if (y !== undefined && (topmost === undefined || y < topmost)) {
      topmost = y
    }
  }
  return topmost
}

/** TooltipBox position props for the hovered row / point. */
function resolveBoxPlacement({
  activePoint,
  tooltipData,
  lines,
  margin,
  isHorizontal,
  xWithMargin,
  topOffset,
}: {
  activePoint: ReturnType<typeof resolveActivePoint>
  tooltipData: TooltipData | null
  lines: LineConfig[]
  margin: Margin
  isHorizontal: boolean
  xWithMargin: number
  topOffset: number
}): Pick<TooltipBoxProps, "x" | "y" | "top" | "flipX" | "replayOnFlip"> {
  if (activePoint) {
    // Beside the hovered point, vertically centred + clamped. The side is
    // picked from the column so a column's points share it, and a flip springs
    // across rather than replaying the entrance.
    return {
      flipX: xWithMargin,
      replayOnFlip: false,
      x: activePoint.x + margin.left,
      y: activePoint.y + margin.top,
    }
  }
  if (isHorizontal) {
    // Horizontal charts: centre on the first line's y (middle of the bar).
    const firstLineDataKey = lines[0]?.dataKey
    const firstLineY = firstLineDataKey
      ? (tooltipData?.yPositions[firstLineDataKey] ?? 0)
      : 0
    return { x: xWithMargin, y: firstLineY + margin.top }
  }
  const top = margin.top + topOffset
  return { top, x: xWithMargin, y: top }
}

const ChartTooltipInner = memo(function ChartTooltipInner({
  showDatePill = true,
  datePillAnimation,
  datePillVariant,
  datePillVelocity,
  datePillClassName,
  datePillStyle,
  datePill,
  showCrosshair: showCrosshairProp,
  showDots = true,
  dotVariant = "dot",
  dotSize = 5,
  dotHaloScale,
  dotHaloOpacity,
  dotHaloBlur,
  dotRadiusFraction,
  dotScale = 1,
  dotStrokeWidth,
  indicatorColor: indicatorColorProp,
  indicatorEndColor,
  indicatorEnd = "plot",
  content,
  rows: rowsRenderer,
  rowLabels,
  dotColor: dotColorProp,
  children,
  className = "",
  container,
  springConfig,
  matchCrosshair = false,
  damping,
  indicatorDasharray,
  indicatorFadeEdges,
  indicatorFadeLength,
  boxSpringConfig,
  panelStyle,
  backgroundColor,
  dateLabels: dateLabelsProp,
  exit = true,
  animateSize = true,
  topOffset = 0,
}: ChartTooltipInnerProps) {
  const {
    tooltipData,
    width,
    height,
    innerHeight,
    margin,
    columnWidth,
    lines,
    bands,
    xAccessor,
    dateLabels: contextDateLabels,
    containerRef,
    orientation,
    barXAccessor,
    bandWidth,
    squareSnap,
    nearestPointHover,
  } = useChart()
  const tooltipBands = useMemo(
    () => (bands ?? []).filter((band) => band.showInTooltip),
    [bands]
  )
  const { tooltipSpring } = useChartConfig()
  const dateLabels = dateLabelsProp ?? contextDateLabels

  const isHorizontal = orientation === "horizontal"
  const datePillEnabled = showDatePill && !isHorizontal && dateLabels.length > 0

  // Tell `XAxis` a pill covers its labels, so it fades instead of highlights.
  useEffect(() => {
    if (!datePillEnabled) {
      return
    }
    return registerDatePill(container)
  }, [container, datePillEnabled])
  // Bar charts (any orientation) and nearest-point hover (jittered scatter)
  // hide the crosshair line by default.
  const showCrosshair =
    showCrosshairProp ?? !(barXAccessor || nearestPointHover)
  const discreteInteraction =
    dateLabels.length > DISCRETE_INTERACTION_LABEL_THRESHOLD

  const resolvedDotSize = useMemo(() => {
    if (dotVariant !== "ring" || !bandWidth || lines.length === 0) {
      return dotSize * dotScale
    }
    const seriesCount = lines.length
    const gap = squareSnap?.groupGap ?? (seriesCount > 1 ? 4 : 0)
    const squareSize = (bandWidth - gap * (seriesCount - 1)) / seriesCount
    return (squareSize / 2) * dotScale
  }, [
    bandWidth,
    dotScale,
    dotSize,
    dotVariant,
    lines.length,
    squareSnap?.groupGap,
  ])
  const boxMotion = useMemo(() => {
    if (boxSpringConfig) {
      return {
        animate: !discreteInteraction,
        springConfig: boxSpringConfig,
      }
    }
    if (matchCrosshair) {
      return {
        animate: !discreteInteraction,
        springConfig: springConfig ?? tooltipSpring,
      }
    }
    return resolveTooltipBoxMotion(damping)
  }, [
    boxSpringConfig,
    damping,
    discreteInteraction,
    matchCrosshair,
    springConfig,
    tooltipSpring,
  ])

  const visible = tooltipData !== null
  const x = tooltipData?.x ?? 0
  const xWithMargin = x + margin.left

  // Nearest-point hover (jittered scatter): the dot and panel follow the
  // hovered point, not the column / first series.
  const activePoint = nearestPointHover
    ? resolveActivePoint(tooltipData, lines)
    : null
  const boxPlacement = resolveBoxPlacement({
    activePoint,
    tooltipData,
    lines,
    margin,
    isHorizontal,
    xWithMargin,
    topOffset,
  })

  const tooltipRows = useMemo(() => {
    if (!tooltipData) {
      return []
    }

    if (rowsRenderer) {
      return rowsRenderer(tooltipData.point)
    }

    // Default: generate rows from registered lines, then `<Band>` ranges.
    // With nearest-point hover (jittered scatter) a row may hold only some
    // series — skip the rest.
    const rowLines = nearestPointHover
      ? lines.filter(
          (line) => typeof tooltipData.point[line.dataKey] === "number"
        )
      : lines
    const rows: TooltipRow[] = rowLines.map((line) => ({
      color: line.stroke,
      label: rowLabels?.[line.dataKey] || line.dataKey,
      value: (tooltipData.point[line.dataKey] as number) ?? 0,
    }))
    for (const band of tooltipBands) {
      const value = formatBandRange(
        tooltipData.point,
        band.upperKey,
        band.lowerKey
      )
      if (value != null) {
        rows.push({ color: band.color, label: band.label, value })
      }
    }
    return rows
  }, [
    tooltipData,
    lines,
    tooltipBands,
    rowsRenderer,
    rowLabels,
    nearestPointHover,
  ])

  // One dot per band edge (deduped; edges shared with a `<Line>` use its dot).
  const bandDots = useMemo(() => {
    const lineKeys = new Set(lines.map((line) => line.dataKey))
    const seen = new Set<string>()
    const dots: { key: string; color: string }[] = []
    for (const band of tooltipBands) {
      for (const key of [band.upperKey, band.lowerKey]) {
        if (lineKeys.has(key) || seen.has(key)) {
          continue
        }
        seen.add(key)
        dots.push({ key, color: band.color })
      }
    }
    return dots
  }, [lines, tooltipBands])

  const resolveDotColor = useMemo(() => {
    return (line: LineConfig, index: number): string => {
      if (rowsRenderer && tooltipRows[index]?.color) {
        return tooltipRows[index].color
      }
      if (dotColorProp != null) {
        if (typeof dotColorProp === "function" && tooltipData) {
          return dotColorProp(tooltipData.point, line)
        }
        if (typeof dotColorProp === "string") {
          return dotColorProp
        }
      }
      return line.stroke
    }
  }, [dotColorProp, rowsRenderer, tooltipData, tooltipRows])

  // Resolve indicator color (static or from hovered point)
  const indicatorColor = useMemo(() => {
    if (indicatorColorProp == null) {
      return chartCssVars.crosshair
    }
    if (typeof indicatorColorProp === "function") {
      return tooltipData
        ? indicatorColorProp(tooltipData.point)
        : chartCssVars.crosshair
    }
    return indicatorColorProp
  }, [indicatorColorProp, tooltipData])

  const indicatorBottom =
    indicatorEnd === "point"
      ? resolveTopmostPointY(tooltipData, lines)
      : undefined

  // Title from date or category
  const title = useMemo(() => {
    if (!tooltipData) {
      return undefined
    }
    // For bar charts (horizontal or vertical), use the category name
    if (barXAccessor) {
      return barXAccessor(tooltipData.point)
    }
    // For line/area charts, use the date
    return weekdayDateFmt.format(xAccessor(tooltipData.point))
  }, [tooltipData, barXAccessor, xAccessor])

  const tooltipContent = (
    <>
      {/* Crosshair indicator - rendered as SVG overlay. The indicator has no
          exit animation (it unmounts when hidden), so the overlay is only
          mounted while hovering. */}
      {showCrosshair && visible && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-visible"
          height="100%"
          width="100%"
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            <TooltipIndicator
              animate={!discreteInteraction}
              bottom={indicatorBottom}
              colorEdge={indicatorColor}
              colorEnd={indicatorEndColor}
              colorMid={indicatorColor}
              columnWidth={columnWidth}
              fadeEdges={
                indicatorDasharray ? "none" : (indicatorFadeEdges ?? "both")
              }
              fadeLength={indicatorFadeLength}
              height={innerHeight}
              springConfig={springConfig}
              strokeDasharray={indicatorDasharray}
              visible={visible}
              width="line"
              x={x}
            />
          </g>
        </svg>
      )}

      {/* Dots on bars/lines - show for vertical charts only */}
      {showDots && visible && !isHorizontal && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-visible"
          height="100%"
          width="100%"
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {nearestPointHover
              ? // One dot that springs between points (any series) instead of
                // one per series mounting / unmounting as rows change.
                activePoint && (
                  <TooltipDot
                    animate={!discreteInteraction}
                    color={resolveDotColor(activePoint.line, activePoint.index)}
                    cornerRadiusFraction={
                      dotVariant === "ring" ? dotRadiusFraction : undefined
                    }
                    haloBlur={dotHaloBlur}
                    haloOpacity={dotHaloOpacity}
                    haloScale={dotHaloScale}
                    size={resolvedDotSize}
                    springConfig={springConfig}
                    strokeColor={chartCssVars.background}
                    strokeWidth={dotStrokeWidth}
                    variant={dotVariant}
                    visible={visible}
                    x={activePoint.x}
                    y={activePoint.y}
                  />
                )
              : lines.map((line, index) => (
                  <TooltipDot
                    animate={!discreteInteraction}
                    color={resolveDotColor(line, index)}
                    cornerRadiusFraction={
                      dotVariant === "ring" ? dotRadiusFraction : undefined
                    }
                    haloBlur={dotHaloBlur}
                    haloOpacity={dotHaloOpacity}
                    haloScale={dotHaloScale}
                    key={line.dataKey}
                    size={resolvedDotSize}
                    springConfig={springConfig}
                    strokeColor={chartCssVars.background}
                    strokeWidth={dotStrokeWidth}
                    variant={dotVariant}
                    visible={visible}
                    x={tooltipData?.xPositions?.[line.dataKey] ?? x}
                    y={tooltipData?.yPositions[line.dataKey] ?? 0}
                  />
                ))}
            {bandDots.map((dot) => {
              const y = tooltipData?.yPositions[dot.key]
              if (y == null) {
                return null
              }
              return (
                <TooltipDot
                  animate={!discreteInteraction}
                  color={
                    typeof dotColorProp === "string" ? dotColorProp : dot.color
                  }
                  cornerRadiusFraction={
                    dotVariant === "ring" ? dotRadiusFraction : undefined
                  }
                  haloBlur={dotHaloBlur}
                  haloOpacity={dotHaloOpacity}
                  haloScale={dotHaloScale}
                  key={`band-${dot.key}`}
                  size={resolvedDotSize}
                  springConfig={springConfig}
                  strokeColor={chartCssVars.background}
                  strokeWidth={dotStrokeWidth}
                  variant={dotVariant}
                  visible={visible}
                  x={x}
                  y={y}
                />
              )
            })}
          </g>
        </svg>
      )}

      {/* Tooltip Box */}
      <TooltipBox
        animate={boxMotion.animate}
        animateSize={animateSize}
        backgroundColor={backgroundColor}
        className={className}
        containerHeight={height}
        containerRef={containerRef}
        containerWidth={width}
        exit={exit}
        panelStyle={panelStyle}
        springConfig={boxMotion.springConfig}
        {...boxPlacement}
        visible={visible}
      >
        {content && tooltipData
          ? content({
              point: tooltipData.point,
              index: tooltipData.index,
            })
          : !content && (
              <TooltipContent rows={tooltipRows} title={title}>
                {children}
              </TooltipContent>
            )}
      </TooltipBox>

      {/* Date/Category Ticker - only show for vertical charts */}
      <DatePillTracker
        animation={datePillAnimation}
        className={datePillClassName}
        currentIndex={tooltipData?.index ?? 0}
        discreteInteraction={discreteInteraction}
        enabled={datePillEnabled}
        labels={dateLabels}
        point={tooltipData?.point}
        render={datePill}
        springConfig={springConfig}
        style={datePillStyle}
        variant={datePillVariant}
        velocity={datePillVelocity}
        visible={visible}
        xWithMargin={xWithMargin}
      />
    </>
  )

  return createPortal(tooltipContent, container)
})

export function ChartTooltip(props: ChartTooltipProps) {
  const { containerRef } = useChartStable()

  const container = useChartPortalContainer(containerRef)
  if (!container) {
    return null
  }

  return <ChartTooltipInner {...props} container={container} />
}

ChartTooltip.displayName = "ChartTooltip"

interface DatePillTrackerProps {
  enabled: boolean
  visible: boolean
  labels: string[]
  currentIndex: number
  xWithMargin: number
  discreteInteraction: boolean
  springConfig?: SpringConfig
  point?: Record<string, unknown>
  animation?: DateTickerAnimation
  className?: string
  style?: CSSProperties
  render?: ChartTooltipProps["datePill"]
  variant?: DateTickerVariant
  velocity?: ChartTooltipProps["datePillVelocity"]
}

// Inner-only-on-visible so `useSpring` initializes at the real cursor x
// instead of `margin.left` on first hover.
function DatePillTracker(props: DatePillTrackerProps) {
  if (!(props.enabled && props.visible && props.labels.length > 0)) {
    return null
  }
  return <DatePillTrackerInner {...props} />
}

function DatePillTrackerInner({
  labels,
  currentIndex,
  xWithMargin,
  discreteInteraction,
  springConfig,
  visible,
  point,
  animation,
  className,
  style,
  render,
  variant,
  velocity,
}: DatePillTrackerProps) {
  const { tooltipSpring } = useChartConfig()
  const reduceMotion = useReducedMotion() === true
  const effectiveSpring = springConfig ?? tooltipSpring
  const animatedX = useSpring(xWithMargin, effectiveSpring)
  const swell = useVelocityStretch(
    animatedX,
    reduceMotion || discreteInteraction
      ? null
      : resolveDatePillVelocity(velocity)
  )

  if (!discreteInteraction) {
    animatedX.set(xWithMargin)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to jump the animatedX when the visible prop changes
  useEffect(() => {
    animatedX.set(xWithMargin)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedX, visible])

  return (
    <m.div
      className="pointer-events-none absolute z-50 w-max"
      style={{
        left: discreteInteraction ? xWithMargin : animatedX,
        transform: "translateX(-50%)",
        bottom: 4,
      }}
    >
      <m.div style={{ scaleX: swell.scaleX, scaleY: swell.scaleY }}>
        {render && point ? (
          render({
            label: labels[currentIndex] ?? "",
            index: currentIndex,
            point,
          })
        ) : (
          <DateTicker
            animation={animation}
            className={className}
            currentIndex={currentIndex}
            labels={labels}
            style={style}
            variant={variant}
            visible={visible}
          />
        )}
      </m.div>
    </m.div>
  )
}

export default ChartTooltip
