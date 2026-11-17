"use client"

import {
  memo,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react"
import { curveNatural, type CurveFactory } from "d3-shape"

import {
  chartCssVars,
  useChartStable,
  useSettledYScale,
  useYScale,
} from "./chart-context"
import type { ChartPhase, LoadingStyle } from "./chart-phase"
import {
  fadeGradientStops,
  horizontalPaintStops,
  resolveFadeSides,
  resolveStrokeGradientStops,
  viewportFadeGradientAttrs,
  type FadeEdges,
  type PaintGradientStop,
  type StrokeGradient,
} from "./fade-edges"
import {
  LineLoadingPulseStroke,
  resolveLineLoadingPulseMode,
  type LineLoadingPulseMode,
} from "./line-loading-pulse"
import { LINE_LOADING_LOOP_PAUSE_MS } from "./line-loading-timing"
import { LinePath } from "./line-path"
import { LineLoadingSweep } from "./loading-sweep"
import {
  resolveDashTailBounds,
  usePathStrokeMetrics,
} from "./path-stroke-utils"
import { SeriesDashTailOverlay } from "./series-dash-tail-overlay"
import { SeriesHighlightLayer } from "./series-highlight-layer"
import { SeriesHoverDim } from "./series-hover-dim"
import { SeriesMarkers } from "./series-markers"
import type { SeriesPointMarkerStyle } from "./series-point-marker"
import { useAnimatedSeriesPath } from "./use-animated-series-path"

/** Soft outer glow drawn as a blurred copy of the stroke behind the line. */
export interface LineGlow {
  /** Gaussian blur radius (SVG `stdDeviation`) in px. Default: 6 */
  blur?: number
  /** Glow opacity (0–1). Default: 0.7 */
  opacity?: number
  /** Glow stroke width in px. Default: 2× `strokeWidth` */
  strokeWidth?: number
}

const DEFAULT_GLOW_BLUR = 6
const DEFAULT_GLOW_OPACITY = 0.7
const DEFAULT_HIGHLIGHT_DIM_OPACITY = 0.3

/** Styling for the hover highlight segment (`showHighlight`). */
export interface LineHighlight {
  /**
   * Segment colour. Default: the line's paint — `strokeGradient` (without the
   * edge fade) or `stroke`.
   */
  stroke?: string
  /** Segment colour ramp across the plot, left → right. Overrides `stroke`. */
  strokeGradient?: StrokeGradient
  /** Segment stroke width in px. Default: the line's `strokeWidth` */
  strokeWidth?: number
  /** Data points either side of the hovered point the segment covers. Default: 1 */
  span?: number
  /**
   * Soft ends: fade the segment in / out over this percentage (0–50) of its
   * width at each side. `0` = hard edges. Default: 0
   */
  fadeLength?: number
  /** Glow behind the segment (same options as `glow`). Default: false */
  glow?: boolean | LineGlow
  /** Opacity the rest of the line dims to while hovering. Default: 0.3 */
  dimOpacity?: number
}

export interface LineProps {
  /** Key in data to use for y values */
  dataKey: string
  /** Y-scale group id (Recharts `yAxisId`). Default: `"left"`. */
  yAxisId?: string | number
  /** Stroke color. Default: var(--chart-line-primary) */
  stroke?: string
  /** Stroke width. Default: 2.5 */
  strokeWidth?: number
  /** Curve function. Default: curveNatural */
  curve?: CurveFactory
  /** Whether to animate the line. Default: true */
  animate?: boolean
  /**
   * Fade the line stroke toward transparent at the chart edges.
   * - `true` fades both edges, `false` disables the fade entirely.
   * - `"left"` / `"right"` fades only that side.
   * Default: true
   */
  fadeEdges?: FadeEdges
  /**
   * Horizontal stroke colour gradient across the plot, left → right. Plain
   * colours are spaced evenly; `{ offset, color }` stops (offset 0–1) place
   * them explicitly. Composes with `fadeEdges`. Overrides `stroke` for the
   * line paint (`stroke` still colours markers and the tooltip dot).
   */
  strokeGradient?: StrokeGradient
  /**
   * Soft outer glow — a blurred copy of the stroke behind the line. `true`
   * uses the defaults; pass `{ blur, opacity, strokeWidth }` to tune it.
   * Default: false
   */
  glow?: boolean | LineGlow
  /** Whether to show highlight segment on hover. Default: true */
  showHighlight?: boolean
  /**
   * Hover highlight styling: colour / gradient override, soft ends
   * (`fadeLength`), `glow`, `span`, `strokeWidth` and the `dimOpacity` of the
   * rest of the line.
   */
  highlight?: LineHighlight
  /** Render scatter-style circle markers at each data point. Default: false */
  showMarkers?: boolean
  /** Marker styling (same options as Scatter). */
  markers?: SeriesPointMarkerStyle
  /**
   * Data index from which the line stroke becomes dashed (inclusive).
   * Useful for projecting incomplete periods, e.g. dashed from yesterday through today.
   */
  dashFromIndex?: number
  /** Dash pattern for the tail segment when `dashFromIndex` is set. Default: "6,4" */
  dashArray?: string
  /**
   * Show the loading pulse overlay. Default: follows chart loading phase.
   * Set `false` to disable even during loading.
   */
  loading?: boolean
  /** Stroke color for the loading pulse overlay. Default: var(--foreground) */
  loadingStroke?: string
  /** Loading pulse stroke opacity. Default: 0.5 */
  loadingStrokeOpacity?: number
  /** Override pulse animation mode (loop / exit / enter). */
  loadingPulseMode?: LineLoadingPulseMode
  /** Called when a loop-mode pulse cycle completes. */
  onLoadingPulseCycleComplete?: () => void
  /**
   * Loading animation while the chart is in loading status: the default
   * traveling `"pulse"`, or a diagonal `"sweep"` shimmer across the skeleton
   * line. Default: `"pulse"`.
   */
  loadingStyle?: LoadingStyle
}

function LineSeriesStroke({
  animatedPathD,
  filter,
  pathRef,
  staticPathD,
  strokeOpacity,
  strokeWidth,
  drawAnimatedPath,
  visibleStroke,
}: {
  animatedPathD: string
  filter?: string
  pathRef?: RefObject<SVGPathElement | null>
  /** `d` of the resting line (unused while `drawAnimatedPath`). */
  staticPathD: string
  strokeOpacity?: number
  strokeWidth: number
  drawAnimatedPath: boolean
  visibleStroke: string
}) {
  if (drawAnimatedPath) {
    return (
      <path
        d={animatedPathD}
        fill="none"
        filter={filter}
        ref={pathRef}
        stroke={visibleStroke}
        strokeLinecap="round"
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
      />
    )
  }

  return (
    <LinePath
      d={staticPathD}
      filter={filter}
      innerRef={pathRef}
      stroke={visibleStroke}
      strokeLinecap="round"
      strokeOpacity={strokeOpacity}
      strokeWidth={strokeWidth}
    />
  )
}

// Memoised: a series re-render (data update, every morph frame) passes the
// same props, so the overlays and their children are skipped.
const LineLoadingOverlays = memo(function LineLoadingOverlays({
  curve,
  handleLoadingPulseComplete,
  innerWidth,
  loadingStroke,
  loadingStrokeOpacity,
  loadingStyle,
  pathD,
  pulseEpoch,
  pulseMode,
  showLoadingPulse,
  strokeWidth,
}: {
  curve: CurveFactory
  handleLoadingPulseComplete: () => void
  innerWidth: number
  loadingStroke: string
  loadingStrokeOpacity: number
  loadingStyle: LoadingStyle
  pathD: string | null
  pulseEpoch: number
  pulseMode: LineLoadingPulseMode | null
  showLoadingPulse: boolean
  strokeWidth: number
}) {
  const sweepLoading =
    showLoadingPulse && innerWidth > 0 && loadingStyle === "sweep"
  const pulseLoading = showLoadingPulse && innerWidth > 0 && !sweepLoading

  return (
    <>
      {sweepLoading ? (
        <LineLoadingSweep
          curve={curve}
          key="loading-sweep"
          mode={pulseMode ?? "loop"}
          onTransitionComplete={handleLoadingPulseComplete}
          stroke={loadingStroke}
          strokeOpacity={loadingStrokeOpacity}
          strokeWidth={strokeWidth}
        />
      ) : null}
      {pulseLoading && pathD ? (
        <LineLoadingPulseStroke
          key="loading-pulse"
          loopEpoch={pulseEpoch}
          mode={pulseMode ?? undefined}
          onCycleComplete={handleLoadingPulseComplete}
          pathD={pathD}
          stroke={loadingStroke}
          strokeOpacity={loadingStrokeOpacity}
          strokeWidth={strokeWidth}
        />
      ) : null}
    </>
  )
})

function resolveLineGlow(
  glow: boolean | LineGlow,
  strokeWidth: number
): Required<LineGlow> | null {
  if (!glow) {
    return null
  }
  const options = glow === true ? {} : glow
  return {
    blur: options.blur ?? DEFAULT_GLOW_BLUR,
    opacity: options.opacity ?? DEFAULT_GLOW_OPACITY,
    strokeWidth: options.strokeWidth ?? strokeWidth * 2,
  }
}

function GradientStops({ stops }: { stops: PaintGradientStop[] }) {
  return stops.map((stop) => (
    <stop
      key={stop.offset}
      offset={stop.offset}
      style={{ stopColor: stop.color, stopOpacity: stop.opacity }}
    />
  ))
}

/**
 * Resolved hover-highlight paint. The highlight re-strokes at full opacity, so
 * by default it keeps the line's colour ramp but not the edge fade;
 * `highlight.strokeGradient` / `.stroke` override the line's paint.
 */
function useLineHighlightPaint({
  colorStops,
  enabled,
  glowFilterId,
  gradientId,
  highlight,
  stroke,
  strokeWidth,
}: {
  colorStops: ReturnType<typeof resolveStrokeGradientStops>
  enabled: boolean
  glowFilterId: string
  gradientId: string
  highlight: LineHighlight | undefined
  stroke: string
  strokeWidth: number
}) {
  const gradient = highlight?.strokeGradient
  const color = highlight?.stroke
  const stops = useMemo(() => {
    const ownStops = gradient ? resolveStrokeGradientStops(gradient) : null
    if (ownStops) {
      return horizontalPaintStops({
        color: color ?? stroke,
        colorStops: ownStops,
        fadeStops: null,
      })
    }
    if (color || !colorStops) {
      return null
    }
    return horizontalPaintStops({ color: stroke, colorStops, fadeStops: null })
  }, [colorStops, color, gradient, stroke])
  const width = highlight?.strokeWidth ?? strokeWidth
  const glow = resolveLineGlow(
    enabled ? (highlight?.glow ?? false) : false,
    width
  )
  return {
    stops,
    stroke: stops ? `url(#${gradientId})` : (color ?? stroke),
    strokeWidth: width,
    /** Filter def to render, or `null` when the segment has no glow. */
    glowFilter: glow ? { id: glowFilterId, blur: glow.blur } : null,
    /** `HighlightSegment` glow props. */
    segmentGlow: glow
      ? {
          filter: `url(#${glowFilterId})`,
          opacity: glow.opacity,
          strokeWidth: glow.strokeWidth,
        }
      : undefined,
    dimOpacity: highlight?.dimOpacity ?? DEFAULT_HIGHLIGHT_DIM_OPACITY,
  }
}

function GlowFilter({
  blur,
  id,
  innerHeight,
  innerWidth,
}: {
  blur: number
  id: string
  innerHeight: number
  innerWidth: number
}) {
  // Filter region in user space: a near-flat line has a thin bounding box, so
  // the default objectBoundingBox region would crop the blur vertically.
  const pad = blur * 3
  return (
    <filter
      colorInterpolationFilters="sRGB"
      filterUnits="userSpaceOnUse"
      height={innerHeight + pad * 2}
      id={id}
      width={innerWidth + pad * 2}
      x={-pad}
      y={-pad}
    >
      <feGaussianBlur stdDeviation={blur} />
    </filter>
  )
}

// Memoised for the same reason as `LineLoadingOverlays`.
const LineStrokeDefs = memo(function LineStrokeDefs({
  glowBlur,
  glowFilterId,
  gradientId,
  highlightGlow,
  highlightGradientId,
  highlightStops,
  innerHeight,
  innerWidth,
  paintStops,
}: {
  glowBlur: number
  glowFilterId: string | null
  gradientId: string
  highlightGlow: { id: string; blur: number } | null
  highlightGradientId: string
  highlightStops: PaintGradientStop[] | null
  innerHeight: number
  innerWidth: number
  paintStops: PaintGradientStop[] | null
}) {
  if (!(paintStops || highlightStops || glowFilterId || highlightGlow)) {
    return null
  }
  return (
    <defs>
      {paintStops ? (
        <linearGradient
          id={gradientId}
          {...viewportFadeGradientAttrs(innerWidth)}
        >
          <GradientStops stops={paintStops} />
        </linearGradient>
      ) : null}
      {highlightStops ? (
        <linearGradient
          id={highlightGradientId}
          {...viewportFadeGradientAttrs(innerWidth)}
        >
          <GradientStops stops={highlightStops} />
        </linearGradient>
      ) : null}
      {glowFilterId ? (
        <GlowFilter
          blur={glowBlur}
          id={glowFilterId}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
        />
      ) : null}
      {highlightGlow ? (
        <GlowFilter
          blur={highlightGlow.blur}
          id={highlightGlow.id}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
        />
      ) : null}
    </defs>
  )
})

/** Loading pulse mode for the line, or `null` when no pulse shows. */
function resolveLinePulseMode(
  chartPhase: ChartPhase,
  loading: boolean | undefined,
  loadingPulseMode: LineLoadingPulseMode | undefined
): LineLoadingPulseMode | null {
  if (loading === false) {
    return null
  }
  return (
    loadingPulseMode ??
    (loading === true ? "loop" : resolveLineLoadingPulseMode(chartPhase))
  )
}

export function Line({
  dataKey,
  yAxisId,
  stroke = chartCssVars.linePrimary,
  strokeWidth = 2.5,
  curve = curveNatural,
  animate = true,
  fadeEdges = true,
  strokeGradient,
  glow = false,
  showHighlight = true,
  highlight,
  showMarkers = false,
  markers,
  dashFromIndex,
  dashArray = "6,4",
  loading,
  loadingStroke = chartCssVars.foreground,
  loadingStrokeOpacity = 0.5,
  loadingPulseMode,
  onLoadingPulseCycleComplete,
  loadingStyle = "pulse",
}: LineProps) {
  // Stable slice only: hover state lives inside `<SeriesHoverDim>` and
  // `<SeriesHighlightLayer>` so this component (and its expensive
  // <SeriesDashTailOverlay> child) does not re-render on cursor motion.
  // The reveal-clip is now a single shared clipPath at the chart-shell
  // level (`time-series-chart-shell.tsx`); we no longer render a per-line
  // `<ChartRevealClip>` or read `revealEpoch` here.
  const {
    data,
    renderData,
    xScale,
    innerHeight,
    innerWidth,
    xAccessor,
    lines,
    chartPhase,
    notifyLoadingPulseComplete,
    yDomainTweenDuration,
  } = useChartStable()
  const yScale = useYScale(yAxisId)
  const settledYScale = useSettledYScale(yAxisId)
  const useDataTransitionPath = animate && chartPhase === "ready"
  const { pathD: animatedPathD } = useAnimatedSeriesPath({
    chartPhase,
    curve,
    dataKey,
    durationMs: yDomainTweenDuration,
    enabled: useDataTransitionPath,
    innerWidth,
    renderData,
    settledYScale,
    xAccessor,
    xScale,
    yScale,
  })

  const pulseMode = resolveLinePulseMode(chartPhase, loading, loadingPulseMode)
  const showLoadingPulse = pulseMode != null
  const [pulseEpoch, setPulseEpoch] = useState(0)
  const effectiveShowHighlight = showHighlight && !showLoadingPulse

  const handleLoadingPulseComplete = useCallback(() => {
    onLoadingPulseCycleComplete?.()
    if (pulseMode === "loop") {
      window.setTimeout(() => {
        setPulseEpoch((epoch) => epoch + 1)
      }, LINE_LOADING_LOOP_PAUSE_MS)
      return
    }
    notifyLoadingPulseComplete?.()
  }, [notifyLoadingPulseComplete, onLoadingPulseCycleComplete, pulseMode])

  const seriesIndex = useMemo(() => {
    const index = lines.findIndex((line) => line.dataKey === dataKey)
    return index >= 0 ? index : 0
  }, [lines, dataKey])

  const pathRef = useRef<SVGPathElement>(null)
  const hasDashTail = resolveDashTailBounds(dashFromIndex, data.length)
  const { pathLength, pathD } = usePathStrokeMetrics(
    pathRef,
    [
      renderData,
      innerWidth,
      dashFromIndex,
      animate,
      useDataTransitionPath ? animatedPathD : null,
    ],
    // Only the dash tail and loading pulse read the metrics; outside the
    // resting "ready" phase keep measuring so a pulse starts on a fresh path.
    hasDashTail || showLoadingPulse || chartPhase !== "ready"
  )

  const reactId = useId()
  const gradientId = `line-gradient-${dataKey}-${reactId}`
  const highlightGradientId = `${gradientId}-highlight`
  const glowFilterId = `line-glow-${dataKey}-${reactId}`

  // While the data-transition tween runs, `animatedPathD` (per frame) is drawn
  // on a plain `<path>`; at rest the same hook `pathD` (built from the same
  // scales, curve and y accessor as a `linePathD` call) is the static `d`, so
  // the path is generated once rather than twice per render.
  const drawAnimatedPath = useDataTransitionPath && Boolean(animatedPathD)

  const colorStops = useMemo(
    () => resolveStrokeGradientStops(strokeGradient),
    [strokeGradient]
  )
  const paintStops = useMemo(() => {
    const sides = resolveFadeSides(fadeEdges)
    if (!(sides.any || colorStops)) {
      return null
    }
    return horizontalPaintStops({
      color: stroke,
      colorStops,
      fadeStops: sides.any ? fadeGradientStops(sides) : null,
    })
  }, [colorStops, fadeEdges, stroke])
  const highlightPaint = useLineHighlightPaint({
    colorStops,
    enabled: effectiveShowHighlight,
    glowFilterId: `${glowFilterId}-highlight`,
    gradientId: highlightGradientId,
    highlight,
    stroke,
    strokeWidth,
  })
  const lineStroke = paintStops ? `url(#${gradientId})` : stroke
  const glowOptions = resolveLineGlow(glow, strokeWidth)
  const showSeriesStroke =
    chartPhase === "revealing" ||
    chartPhase === "ready" ||
    chartPhase === "exitingReady"
  let visibleStroke = "transparent"
  if (showSeriesStroke && !hasDashTail) {
    visibleStroke = lineStroke
  }

  return (
    <>
      <LineStrokeDefs
        glowBlur={glowOptions?.blur ?? 0}
        glowFilterId={glowOptions ? glowFilterId : null}
        gradientId={gradientId}
        highlightGlow={highlightPaint.glowFilter}
        highlightGradientId={highlightGradientId}
        highlightStops={highlightPaint.stops}
        innerHeight={innerHeight}
        innerWidth={innerWidth}
        paintStops={paintStops}
      />

      <SeriesHoverDim
        dimOpacity={highlightPaint.dimOpacity}
        enabled={effectiveShowHighlight}
        seriesIndex={seriesIndex}
      >
        {glowOptions && showSeriesStroke ? (
          <LineSeriesStroke
            animatedPathD={animatedPathD}
            drawAnimatedPath={drawAnimatedPath}
            filter={`url(#${glowFilterId})`}
            staticPathD={animatedPathD}
            strokeOpacity={glowOptions.opacity}
            strokeWidth={glowOptions.strokeWidth}
            visibleStroke={lineStroke}
          />
        ) : null}
        <LineSeriesStroke
          animatedPathD={animatedPathD}
          drawAnimatedPath={drawAnimatedPath}
          pathRef={pathRef}
          staticPathD={animatedPathD}
          strokeWidth={strokeWidth}
          visibleStroke={visibleStroke}
        />

        {/* Only mounted with a dash tail: it takes `data` as a prop. */}
        {hasDashTail ? (
          <SeriesDashTailOverlay
            dashArray={dashArray}
            dashFromIndex={dashFromIndex}
            data={data}
            innerHeight={innerHeight}
            innerWidth={innerWidth}
            pathD={pathD}
            pathLength={pathLength}
            stroke={lineStroke}
            strokeWidth={strokeWidth}
            xAccessor={xAccessor}
            xScale={xScale}
          />
        ) : null}
      </SeriesHoverDim>

      {showMarkers ? (
        <SeriesMarkers
          animate={animate}
          dataKey={dataKey}
          {...markers}
          fill={markers?.fill ?? stroke}
          stroke={markers?.stroke ?? markers?.fill ?? stroke}
        />
      ) : null}

      <SeriesHighlightLayer
        enabled={effectiveShowHighlight}
        fadeLength={highlight?.fadeLength}
        glow={highlightPaint.segmentGlow}
        height={innerHeight}
        pathRef={pathRef}
        span={highlight?.span}
        stroke={highlightPaint.stroke}
        strokeWidth={highlightPaint.strokeWidth}
      />

      <LineLoadingOverlays
        curve={curve}
        handleLoadingPulseComplete={handleLoadingPulseComplete}
        innerWidth={innerWidth}
        loadingStroke={loadingStroke}
        loadingStrokeOpacity={loadingStrokeOpacity}
        loadingStyle={loadingStyle}
        pathD={pathD}
        pulseEpoch={pulseEpoch}
        pulseMode={pulseMode}
        showLoadingPulse={showLoadingPulse}
        strokeWidth={strokeWidth}
      />
    </>
  )
}

Line.displayName = "Line"

export default Line
