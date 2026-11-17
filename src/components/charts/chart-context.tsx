"use client"

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react"
import {
  scaleLinear,
  type ScaleBand as D3ScaleBand,
  type ScaleLinear as D3ScaleLinear,
  type ScaleTime as D3ScaleTime,
} from "d3-scale"
import type { Transition } from "motion/react"

import type { ChartPhase, ChartStatus } from "./chart-phase"
import type { ReferenceAreaConfig } from "./reference-area-config"
import type { ChartSelection } from "./use-chart-interaction"
import { DEFAULT_Y_AXIS_ID } from "./y-axis-scales"
import type { YDomain } from "./y-domain-utils"

// The unused input parameter keeps the visx-era two-argument signatures valid
/* eslint-disable @typescript-eslint/no-unused-vars */
type ScaleLinear<Output, _Input = number> = D3ScaleLinear<Output, Output>
type ScaleTime<Output, _Input = Date | number> = D3ScaleTime<Output, Output>
/* eslint-enable @typescript-eslint/no-unused-vars */
type ScaleBand<Domain extends { toString(): string }> = D3ScaleBand<Domain>

// CSS variable references for theming
export const chartCssVars = {
  background: "var(--chart-background)",
  foreground: "var(--chart-foreground)",
  foregroundMuted: "var(--chart-foreground-muted)",
  label: "var(--chart-label)",
  linePrimary: "var(--chart-line-primary)",
  lineSecondary: "var(--chart-line-secondary)",
  crosshair: "var(--chart-crosshair)",
  grid: "var(--chart-grid)",
  indicatorColor: "var(--chart-indicator-color)",
  indicatorSecondaryColor: "var(--chart-indicator-secondary-color)",
  markerBackground: "var(--chart-marker-background)",
  markerBorder: "var(--chart-marker-border)",
  markerForeground: "var(--chart-marker-foreground)",
  badgeBackground: "var(--chart-marker-badge-background)",
  badgeForeground: "var(--chart-marker-badge-foreground)",
  segmentBackground: "var(--chart-segment-background)",
  segmentLine: "var(--chart-segment-line)",
  brushBorder: "var(--chart-brush-border)",
  tooltipBackground: "var(--chart-tooltip-background)",
}

/** Default scatter series colors from the chart palette (`--chart-1` … `--chart-5`). */
export const defaultScatterColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

/**
 * Above this many x labels, `ChartTooltip` switches to discrete interaction:
 * the crosshair, tooltip box and dots snap between points instead of
 * springing (springs would lag behind a dense series). The hover highlight
 * band follows the same rule.
 */
export const DISCRETE_INTERACTION_LABEL_THRESHOLD = 60

export interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

export interface TooltipData {
  /** The data point being hovered */
  point: Record<string, unknown>
  /** Index in the data array */
  index: number
  /** X position in pixels (relative to chart area) */
  x: number
  /** Y positions for each line, keyed by dataKey */
  yPositions: Record<string, number>
  /** X positions for each series (for grouped bars), keyed by dataKey */
  xPositions?: Record<string, number>
  /**
   * Series whose point is hovered when hover snaps to the nearest point
   * (`ScatterChart` with `jitter`). The tooltip dot and panel follow this
   * point.
   */
  activeDataKey?: string
}

export interface LineConfig {
  dataKey: string
  stroke: string
  strokeWidth: number
  /** Scale group id (Recharts `yAxisId`). Default: `"left"`. */
  yAxisId?: string | number
}

/** Y-domain and tooltip inputs collected from a `<Band>` child. */
export interface BandConfig {
  yAxisId: string
  upperKey: string
  lowerKey: string
  /** Tooltip swatch / edge-dot colour (the band's `fill`). */
  color: string
  /** Tooltip row label. */
  label: string
  /** Whether the band adds a range row and edge dots to `ChartTooltip`. */
  showInTooltip: boolean
}

/**
 * Hover/selection state — every field here changes on mouse movement.
 * Lives in its own context so cold consumers (Grid, YAxis, PatternArea, …)
 * can subscribe to the stable slice and skip re-rendering on every hover.
 */
export interface ChartHoverContextValue {
  // Tooltip state
  tooltipData: TooltipData | null
  setTooltipData: Dispatch<SetStateAction<TooltipData | null>>

  // Selection state (optional - only present when useChartInteraction is used)
  /** Current drag/pinch selection range */
  selection?: ChartSelection | null
  /** Clear the current selection */
  clearSelection?: () => void

  // Bar chart hover (optional - only present in BarChart)
  /** Index of currently hovered bar */
  hoveredBarIndex?: number | null
  /** Setter for hovered bar index */
  setHoveredBarIndex?: (index: number | null) => void

  // Candlestick hover (optional - only present in CandlestickChart)
  /** Index of currently hovered candle */
  hoveredCandleIndex?: number | null
  /** Setter for hovered candle index */
  setHoveredCandleIndex?: (index: number | null) => void
}

export interface ChartContextValue extends ChartHoverContextValue {
  // Data
  data: Record<string, unknown>[]
  /** Decimated subset for SVG path rendering; equals `data` when no decimation is needed. */
  renderData: Record<string, unknown>[]

  // Scales
  xScale: ScaleTime<number, number>
  /** Primary (left) y-scale — alias for `yScales[DEFAULT_Y_AXIS_ID]`. */
  yScale: ScaleLinear<number, number>
  /** Per-axis y-scales keyed by `yAxisId`. */
  yScales: Record<string, ScaleLinear<number, number>>

  // Dimensions
  width: number
  height: number
  innerWidth: number
  innerHeight: number
  margin: Margin

  // Column width for spacing calculations
  columnWidth: number

  // Container ref for portals
  containerRef: RefObject<HTMLDivElement | null>

  // Line configurations (extracted from children)
  lines: LineConfig[]

  /** `<Band>` configs (time-series charts) — tooltip range rows and edge dots. */
  bands?: BandConfig[]

  /** {@link ReferenceArea} bands — drives y-axis label colors in range. */
  referenceAreas: ReferenceAreaConfig[]

  // Loading / lifecycle (LineChart status transitions)
  chartPhase: ChartPhase
  chartStatus: ChartStatus
  /** Centered label while `chartPhase` shows loading chrome. */
  loadingLabel?: string
  /** Y-domain tween duration when transitioning loading ↔ ready (ms). */
  yDomainTweenDuration: number
  /** Nice’d y-domains per axis from skeleton data (placeholder). */
  yDomainSkeletonByAxis: Record<string, YDomain>
  /** Nice’d y-domains per axis from the current target data. */
  yDomainTargetByAxis: Record<string, YDomain>

  // Animation state
  isLoaded: boolean
  animationDuration: number
  /** CSS easing for clip-reveal / line draw (cartesian charts). */
  animationEasing?: string
  /** Motion enter transition (spring or tween) — drives clip reveal when spring. */
  enterTransition?: Transition
  /** Increments when enter animation should replay. */
  revealEpoch?: number
  /** Fired when a one-shot loading pulse (exit / enter) completes. */
  notifyLoadingPulseComplete?: () => void

  // X accessor - how to get the x value from data points
  xAccessor: (d: Record<string, unknown>) => Date

  // Pre-computed date labels for ticker animation
  dateLabels: string[]

  /** Active brush zoom range — when set, axis ticks align to visible data rows. */
  xDomain?: [Date, Date]
  /** Full dataset length when brush zoom is enabled (for zoom vs full-range detection). */
  xDomainSlotCount?: number

  // Bar chart specific (optional - only present in BarChart)
  /** Band scale for categorical x-axis (bar charts) */
  barScale?: ScaleBand<string>
  /** Width of each bar band */
  bandWidth?: number
  /** X accessor for bar charts (returns string instead of Date) */
  barXAccessor?: (d: Record<string, unknown>) => string
  /** Bar chart orientation */
  orientation?: "vertical" | "horizontal"
  /** Whether bars are stacked */
  stacked?: boolean
  /** Stack offsets: Map of data index -> Map of dataKey -> cumulative offset */
  stackOffsets?: Map<number, Map<string, number>>
  /** Squares variant — snap tooltip to top square and size ring dots. */
  squareSnap?: { squareGap: number; groupGap?: number; fit?: boolean }

  // ComposedChart + SeriesBar (optional)
  /** `SeriesBar` dataKeys in tree order, for grouped columns at each x */
  composedBarDataKeys?: string[]
  /** Target bar width in px (Recharts `barSize` style). */
  composedBarSize?: number
  /** Max bar width in px (Recharts `maxBarSize`). */
  composedMaxBarSize?: number
  /** Gap between grouped `SeriesBar` columns in px. */
  composedBarGap?: number
  /** When true, `SeriesBar` segments stack in child order at each x. */
  composedStacked?: boolean
  /** Per-row cumulative offsets for stacked `SeriesBar` (data index → dataKey → offset). */
  composedStackOffsets?: Map<number, Map<string, number>>
  /** Vertical gap in px between stacked `SeriesBar` segments. Default: 0 */
  composedStackGap?: number

  /**
   * Hover resolves to the nearest point in 2D rather than the nearest x column
   * (e.g. `ScatterChart` with `jitter`). `ChartTooltip` hides its crosshair
   * line by default when set, since the line would not mark a single x value.
   */
  nearestPointHover?: boolean
}

/**
 * Stable slice of the chart context — everything that doesn't change on hover
 * (data, scales, dimensions, animation state, layout config). Consumers that
 * subscribe via `useChartStable()` skip re-renders on every mouse move.
 */
export type ChartStableContextValue = Omit<
  ChartContextValue,
  keyof ChartHoverContextValue
>

/** `useLayoutEffect` in the browser, `useEffect` on the server (no SSR warning). */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

const ChartStableContext = createContext<ChartStableContextValue | null>(null)
const ChartHoverContext = createContext<ChartHoverContextValue | null>(null)

/**
 * Subscribable hover/selection state. Time-series charts keep hover in one of
 * these instead of React state, so a pointer move re-renders only the
 * components that read hover — not the chart shell and its layers.
 */
export interface ChartHoverStore {
  getSnapshot: () => ChartHoverContextValue
  subscribe: (listener: () => void) => () => void
}

/** A {@link ChartHoverStore} the owning chart writes to. */
export interface WritableChartHoverStore extends ChartHoverStore {
  setTooltipData: Dispatch<SetStateAction<TooltipData | null>>
  setSelection: (selection: ChartSelection | null) => void
}

const ChartHoverStoreContext = createContext<ChartHoverStore | null>(null)

export function createChartHoverStore(): WritableChartHoverStore {
  const listeners = new Set<() => void>()
  let tooltipData: TooltipData | null = null
  let selection: ChartSelection | null = null
  const emit = () => {
    snapshot = { ...snapshot, tooltipData, selection }
    for (const listener of listeners) {
      listener()
    }
  }
  const setTooltipData: Dispatch<SetStateAction<TooltipData | null>> = (
    action
  ) => {
    const next = typeof action === "function" ? action(tooltipData) : action
    if (next === tooltipData) {
      return
    }
    tooltipData = next
    emit()
  }
  const setSelection = (next: ChartSelection | null) => {
    if (next === selection) {
      return
    }
    selection = next
    emit()
  }
  let snapshot: ChartHoverContextValue = {
    tooltipData,
    setTooltipData,
    selection,
    clearSelection: () => setSelection(null),
  }
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    setTooltipData,
    setSelection,
  }
}

const noop = () => undefined

/** Read-only store over a plain hover value (re-created when it changes). */
function staticChartHoverStore(value: ChartHoverContextValue): ChartHoverStore {
  return {
    getSnapshot: () => value,
    subscribe: () => noop,
  }
}

/**
 * Publishes a hover store to `useChartHover()` (whole slice, re-renders on
 * every change) and `useChartHoverSelector()` (re-renders only when the
 * selected value changes). Only this provider re-renders on a hover change;
 * `children` keeps its identity, so the subtree is skipped apart from hover
 * consumers.
 */
export function ChartHoverStoreProvider({
  children,
  store,
}: {
  children: ReactNode
  store: ChartHoverStore
}) {
  const hover = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  )
  return (
    <ChartHoverStoreContext.Provider value={store}>
      <ChartHoverContext.Provider value={hover}>
        {children}
      </ChartHoverContext.Provider>
    </ChartHoverStoreContext.Provider>
  )
}

/**
 * Splits the merged `value` into a stable slice and a volatile hover slice,
 * publishing each to its own context. Each slice is memoized on its own
 * field identities, so changing `tooltipData` does not bust the stable
 * slice — consumers of `useChartStable()` skip re-renders on hover.
 */
export function ChartProvider({
  children,
  value,
}: {
  children: ReactNode
  value: ChartContextValue
}) {
  const stable = useMemo<ChartStableContextValue>(
    () => ({
      data: value.data,
      renderData: value.renderData,
      xScale: value.xScale,
      yScale: value.yScale,
      yScales: value.yScales,
      width: value.width,
      height: value.height,
      innerWidth: value.innerWidth,
      innerHeight: value.innerHeight,
      margin: value.margin,
      columnWidth: value.columnWidth,
      containerRef: value.containerRef,
      lines: value.lines,
      bands: value.bands,
      referenceAreas: value.referenceAreas,
      chartPhase: value.chartPhase,
      chartStatus: value.chartStatus,
      loadingLabel: value.loadingLabel,
      yDomainTweenDuration: value.yDomainTweenDuration,
      yDomainSkeletonByAxis: value.yDomainSkeletonByAxis,
      yDomainTargetByAxis: value.yDomainTargetByAxis,
      isLoaded: value.isLoaded,
      animationDuration: value.animationDuration,
      animationEasing: value.animationEasing,
      enterTransition: value.enterTransition,
      revealEpoch: value.revealEpoch,
      notifyLoadingPulseComplete: value.notifyLoadingPulseComplete,
      xAccessor: value.xAccessor,
      dateLabels: value.dateLabels,
      xDomain: value.xDomain,
      xDomainSlotCount: value.xDomainSlotCount,
      barScale: value.barScale,
      bandWidth: value.bandWidth,
      barXAccessor: value.barXAccessor,
      orientation: value.orientation,
      stacked: value.stacked,
      stackOffsets: value.stackOffsets,
      composedBarDataKeys: value.composedBarDataKeys,
      composedBarSize: value.composedBarSize,
      composedMaxBarSize: value.composedMaxBarSize,
      composedBarGap: value.composedBarGap,
      composedStacked: value.composedStacked,
      composedStackOffsets: value.composedStackOffsets,
      composedStackGap: value.composedStackGap,
      nearestPointHover: value.nearestPointHover,
    }),
    [
      value.data,
      value.renderData,
      value.xScale,
      value.yScale,
      value.yScales,
      value.width,
      value.height,
      value.innerWidth,
      value.innerHeight,
      value.margin,
      value.columnWidth,
      value.containerRef,
      value.lines,
      value.bands,
      value.referenceAreas,
      value.chartPhase,
      value.chartStatus,
      value.loadingLabel,
      value.yDomainTweenDuration,
      value.yDomainSkeletonByAxis,
      value.yDomainTargetByAxis,
      value.isLoaded,
      value.animationDuration,
      value.animationEasing,
      value.enterTransition,
      value.revealEpoch,
      value.notifyLoadingPulseComplete,
      value.xAccessor,
      value.dateLabels,
      value.xDomain,
      value.xDomainSlotCount,
      value.barScale,
      value.bandWidth,
      value.barXAccessor,
      value.orientation,
      value.stacked,
      value.stackOffsets,
      value.composedBarDataKeys,
      value.composedBarSize,
      value.composedMaxBarSize,
      value.composedBarGap,
      value.composedStacked,
      value.composedStackOffsets,
      value.composedStackGap,
      value.nearestPointHover,
    ]
  )

  const hover = useMemo<ChartHoverContextValue>(
    () => ({
      tooltipData: value.tooltipData,
      setTooltipData: value.setTooltipData,
      selection: value.selection,
      clearSelection: value.clearSelection,
      hoveredBarIndex: value.hoveredBarIndex,
      setHoveredBarIndex: value.setHoveredBarIndex,
      hoveredCandleIndex: value.hoveredCandleIndex,
      setHoveredCandleIndex: value.setHoveredCandleIndex,
    }),
    [
      value.tooltipData,
      value.setTooltipData,
      value.selection,
      value.clearSelection,
      value.hoveredBarIndex,
      value.setHoveredBarIndex,
      value.hoveredCandleIndex,
      value.setHoveredCandleIndex,
    ]
  )

  const hoverStore = useMemo(() => staticChartHoverStore(hover), [hover])

  return (
    <ChartStableContext.Provider value={stable}>
      <ChartHoverStoreContext.Provider value={hoverStore}>
        <ChartHoverContext.Provider value={hover}>
          {children}
        </ChartHoverContext.Provider>
      </ChartHoverStoreContext.Provider>
    </ChartStableContext.Provider>
  )
}

/** Stable-slice context, for chart shells that build the slice themselves. */
export const ChartStableContextProvider = ChartStableContext.Provider

/**
 * Stable slice — data, scales, dimensions, animation state, layout config.
 * Subscribers skip re-renders on hover (the hover slice lives in a separate
 * context). Prefer this in cold consumers like axes, grid, pattern fills.
 */
export function useChartStable(): ChartStableContextValue {
  const context = useContext(ChartStableContext)
  if (!context) {
    throw new Error(
      "useChartStable must be used within a ChartProvider. " +
        "Make sure your component is wrapped in <LineChart>, <AreaChart>, <BarChart>, or <ComposedChart>."
    )
  }
  return context
}

/**
 * Resolves a chart container element to use as a `createPortal` target.
 *
 * The element is kept in state: it is seeded once from the ref (already
 * attached when the chart renders after its container measured), then
 * re-captured after mount. Returns `null` during SSR and when the ref is not
 * attached on the first render.
 *
 * - Layout effect: when the container is a sibling or ancestor already
 *   attached, the synchronous re-render puts portalled axes and tooltips in
 *   the same painted frame as the plot.
 * - Passive effect: React attaches refs child-first in the layout phase, so a
 *   portal rendered *inside* its container (heatmap, choropleth tooltips) sees
 *   `null` above. By the passive phase every ref is attached; this picks it up.
 */
export function useChartPortalContainer<T extends HTMLElement>(
  containerRef: RefObject<T | null> | undefined
): T | null {
  // Not seeded from the ref: reading it during render breaks react-hooks/refs.
  // The layout effect still sets it before the first paint.
  const [container, setContainer] = useState<T | null>(null)
  useIsomorphicLayoutEffect(() => {
    setContainer(containerRef?.current ?? null)
  }, [containerRef])
  useEffect(() => {
    const element = containerRef?.current ?? null
    setContainer((previous) => (previous === element ? previous : element))
  }, [containerRef])
  return container
}

/**
 * Same margin object while its four numbers are unchanged, so an inline
 * `margin={{…}}` (or the default merge) doesn't defeat memoised chart cores.
 */
export function useStableMargin(margin: Margin): Margin {
  const { top, right, bottom, left } = margin
  return useMemo(
    () => ({ top, right, bottom, left }),
    [top, right, bottom, left]
  )
}

/** Y-scale for a series axis (`yAxisId` on Line / Area / YAxis). */
export function useYScale(
  yAxisId?: string | number
): ScaleLinear<number, number> {
  const { yScales, yScale } = useChartStable()
  const id =
    yAxisId == null || yAxisId === "" ? DEFAULT_Y_AXIS_ID : String(yAxisId)
  return yScales[id] ?? yScale
}

/**
 * Y-scale at the end of the y-domain tween (the target domain), for series
 * that animate toward their final pixels rather than the mid-tween scale.
 * Falls back to {@link useYScale} when no target domain is published.
 */
export function useSettledYScale(
  yAxisId?: string | number
): ScaleLinear<number, number> {
  const { yDomainTargetByAxis, innerHeight } = useChartStable()
  const liveScale = useYScale(yAxisId)
  const id =
    yAxisId == null || yAxisId === "" ? DEFAULT_Y_AXIS_ID : String(yAxisId)
  const domain =
    yDomainTargetByAxis?.[id] ?? yDomainTargetByAxis?.[DEFAULT_Y_AXIS_ID]
  const min = domain?.[0]
  const max = domain?.[1]
  const settled = useMemo(
    () =>
      min == null || max == null
        ? null
        : scaleLinear().domain([min, max]).range([innerHeight, 0]),
    [min, max, innerHeight]
  )
  return settled ?? liveScale
}

/**
 * Hover slice — tooltipData, selection, hovered bar / candle indices.
 * Subscribers re-render on every mouse move. Use only when the component
 * actually reads hover state.
 */
export function useChartHover(): ChartHoverContextValue {
  const context = useContext(ChartHoverContext)
  if (!context) {
    throw new Error(
      "useChartHover must be used within a ChartProvider. " +
        "Make sure your component is wrapped in <LineChart>, <AreaChart>, <BarChart>, or <ComposedChart>."
    )
  }
  return context
}

/**
 * One derived value from the hover slice; re-renders only when it changes
 * (by `Object.is`). Return a primitive or a reference taken from the hover
 * state (e.g. `s.tooltipData`), not a fresh object or array. Prefer this over
 * `useChartHover()` for components that only care about part of hover, such
 * as "is the chart hovered" or "which index".
 */
export function useChartHoverSelector<T>(
  selector: (hover: ChartHoverContextValue) => T
): T {
  const store = useContext(ChartHoverStoreContext)
  if (!store) {
    throw new Error(
      "useChartHoverSelector must be used within a ChartProvider. " +
        "Make sure your component is wrapped in <LineChart>, <AreaChart>, <BarChart>, or <ComposedChart>."
    )
  }
  const getSelected = () => selector(store.getSnapshot())
  return useSyncExternalStore(store.subscribe, getSelected, getSelected)
}

/**
 * The hover store itself, for components that drive motion values straight
 * from hover changes without re-rendering. `null` outside a chart.
 */
export function useChartHoverStore(): ChartHoverStore | null {
  return useContext(ChartHoverStoreContext)
}

export function selectTooltipData(
  hover: ChartHoverContextValue
): TooltipData | null {
  return hover.tooltipData
}

/** Whether the chart is hovered or a drag-selection is active. */
export function selectIsChartHovering(hover: ChartHoverContextValue): boolean {
  return hover.tooltipData !== null || hover.selection?.active === true
}

/**
 * Merged stable + hover context. Convenient for components that need both,
 * but re-renders on every hover (because hover changes). Prefer
 * `useChartStable()` or `useChartHover()` for hot consumers that only need
 * one slice.
 */
export function useChart(): ChartContextValue {
  const stable = useChartStable()
  const hover = useChartHover()
  // Identity changes on every hover (hover is the volatile slice) — that's
  // fine for consumers using this merged hook; they explicitly opted in to
  // re-rendering on hover.
  return { ...stable, ...hover }
}

export default ChartStableContext
