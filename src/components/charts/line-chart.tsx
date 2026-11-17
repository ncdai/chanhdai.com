"use client"

import {
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react"
import type { Transition } from "motion/react"
import { domAnimation, LazyMotion } from "motion/react"

import { cn } from "@/lib/utils"

import { useStableMargin, type LineConfig, type Margin } from "./chart-context"
import { ChartLoadingLabel } from "./chart-loading-label"
import { ParentSize } from "./chart-parent-size"
import {
  DEFAULT_CHART_STATUS,
  DEFAULT_Y_DOMAIN_TWEEN_MS,
  resolveRestingChartPhase,
  type ChartPhase,
  type ChartStatus,
} from "./chart-phase"
import { Line, type LineProps } from "./line"
import {
  timeSeriesChartHasRoom,
  TimeSeriesChartInner,
} from "./time-series-chart-shell"

export interface LineChartProps {
  /** Data array - each item should have a date field and numeric values */
  data: Record<string, unknown>[]
  /** Key in data for the x-axis (date). Default: "date" */
  xDataKey?: string
  /** Chart margins */
  margin?: Partial<Margin>
  /** Animation duration in milliseconds. Default: 1100 */
  animationDuration?: number
  /** CSS easing for clip-reveal. Default: cubic-bezier(0.85, 0, 0.15, 1) */
  animationEasing?: string
  enterTransition?: Transition
  revealSignature?: string
  /** Aspect ratio as "width / height". Default: "2 / 1". Omit to fill a sized parent. */
  aspectRatio?: string
  /** Additional class name for the container */
  className?: string
  /** Loading vs ready — drives chart phase and loading chrome. Default: `"ready"`. */
  status?: ChartStatus
  /** Centered shimmer label while loading. */
  loadingLabel?: string
  /** Animate y-domain over this duration (ms) on status transitions. Default: 500. */
  yDomainTweenDuration?: number
  /** Animate y-domain when status or target domain changes. Default: true */
  yDomainTween?: boolean
  /** Visible x-domain for brush zoom. */
  xDomain?: [Date, Date]
  /** Full dataset length for x-scale padding when `xDomain` is set. */
  xDomainSlotCount?: number
  /** Tween y-domain when brush changes the visible x-range. Default: false */
  tweenYDomainOnXDomainChange?: boolean
  /**
   * Fixed y-domain max for single-axis charts: the domain becomes
   * `[0, yScaleDomainMax × 1.1]` instead of following the data max. Use it to
   * leave headroom above the series. Default: data max.
   */
  yScaleDomainMax?: number
  /** Inline container styles (e.g. fixed height for brush strip). */
  style?: CSSProperties
  /** Fires when the internal chart phase changes (e.g. OG capture readiness). */
  onPhaseChange?: (phase: ChartPhase) => void
  /** Child components (Line, Grid, ChartTooltip, etc.) */
  children: ReactNode
}

const DEFAULT_MARGIN: Margin = { top: 40, right: 40, bottom: 40, left: 40 }

/** Series renderers that carry a dataKey but must not drive the shared y-domain. */
const LINE_DOMAIN_EXCLUDED_NAMES = new Set([
  "ProfitLossLine",
  "LineSeriesTerminalMarker",
  "LineBackdrop",
  "Area",
  "SeriesBar",
  "Scatter",
  "Candlestick",
  "Bar",
  "PatternArea",
  "Band",
  "TrendLine",
])

function getChildComponentName(child: ReactElement) {
  const childType = child.type as { displayName?: string; name?: string }
  return typeof child.type === "function"
    ? childType.displayName || childType.name || ""
    : ""
}

function registersLineDomain(
  child: ReactElement,
  props: LineProps | undefined
) {
  if (!props?.dataKey) {
    return false
  }

  const componentName = getChildComponentName(child)
  if (componentName === "Line" || child.type === Line) {
    return true
  }
  if (LINE_DOMAIN_EXCLUDED_NAMES.has(componentName)) {
    return false
  }
  // MDX / duplicate bundle instances may not share the same `Line` reference.
  return typeof props.dataKey === "string" && props.dataKey.length > 0
}

function extractLineConfigs(children: ReactNode): LineConfig[] {
  const configs: LineConfig[] = []

  const visit = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) {
        return
      }

      const props = child.props as LineProps | undefined

      if (registersLineDomain(child, props) && props?.dataKey) {
        configs.push({
          dataKey: props.dataKey,
          stroke: props.stroke || "var(--chart-line-primary)",
          strokeWidth: props.strokeWidth || 2.5,
          yAxisId: props.yAxisId,
        })
        return
      }

      const childProps = child.props as { children?: ReactNode } | undefined
      if (childProps?.children) {
        visit(childProps.children)
      }
    })
  }

  visit(children)
  return configs
}

export function LineChart({
  data,
  xDataKey = "date",
  margin: marginProp,
  animationDuration = 1100,
  animationEasing,
  enterTransition,
  revealSignature,
  aspectRatio = "2 / 1",
  className = "",
  status = DEFAULT_CHART_STATUS,
  loadingLabel,
  yDomainTweenDuration = DEFAULT_Y_DOMAIN_TWEEN_MS,
  yDomainTween = true,
  xDomain,
  xDomainSlotCount,
  tweenYDomainOnXDomainChange = false,
  yScaleDomainMax,
  style,
  onPhaseChange,
  children,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const margin = useStableMargin({ ...DEFAULT_MARGIN, ...marginProp })
  const lines = useMemo(() => extractLineConfigs(children), [children])
  const [chartPhase, setChartPhase] = useState<ChartPhase>(() =>
    resolveRestingChartPhase(status)
  )
  const handlePhaseChange = useCallback(
    (phase: ChartPhase) => {
      setChartPhase(phase)
      onPhaseChange?.(phase)
    },
    [onPhaseChange]
  )

  const showLoadingLabel = Boolean(
    loadingLabel?.trim() &&
    (chartPhase === "loading" ||
      chartPhase === "exiting" ||
      chartPhase === "gridTweenReady" ||
      chartPhase === "revealingLoading")
  )

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={cn("relative w-full", className)}
        ref={containerRef}
        style={{
          ...(aspectRatio ? { aspectRatio } : undefined),
          touchAction: "none",
          ...style,
        }}
      >
        <ParentSize debounceTime={10}>
          {({ width, height }) =>
            timeSeriesChartHasRoom(width, height) ? (
              <TimeSeriesChartInner
                animationDuration={animationDuration}
                animationEasing={animationEasing}
                chartStatus={status}
                clipPathId="chart-grow-clip"
                containerRef={containerRef}
                data={data}
                enterTransition={enterTransition}
                height={height}
                lines={lines}
                loadingLabel={loadingLabel}
                margin={margin}
                onPhaseChange={handlePhaseChange}
                revealSignature={revealSignature}
                tweenYDomainOnXDomainChange={tweenYDomainOnXDomainChange}
                width={width}
                xDataKey={xDataKey}
                xDomain={xDomain}
                xDomainSlotCount={xDomainSlotCount}
                yDomainTween={yDomainTween}
                yDomainTweenDuration={yDomainTweenDuration}
                yScaleDomainMax={yScaleDomainMax}
              >
                {children}
              </TimeSeriesChartInner>
            ) : null
          }
        </ParentSize>
        {showLoadingLabel ? (
          <ChartLoadingLabel
            exiting={chartPhase !== "loading"}
            text={loadingLabel}
          />
        ) : null}
      </div>
    </LazyMotion>
  )
}

export { Line, type LineProps } from "./line"

export default LineChart
