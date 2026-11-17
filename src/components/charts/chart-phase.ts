export type ChartStatus = "loading" | "ready"

/** Loading animation style: the default traveling pulse, or a diagonal
 * shimmer that sweeps across the skeleton. */
export type LoadingStyle = "pulse" | "sweep"

/**
 * Internal visual lifecycle phase. Forward and reverse transitions add
 * intermediate phases in later stack branches.
 */
export type ChartPhase =
  | "loading"
  | "exiting"
  | "gridTweenReady"
  | "revealing"
  | "ready"
  | "exitingReady"
  | "gridTweenLoading"
  | "revealingLoading"

export const DEFAULT_CHART_STATUS: ChartStatus = "ready"

/** Default Y-domain tween when transitioning loading ↔ ready (ms). */
export const DEFAULT_Y_DOMAIN_TWEEN_MS = 500

/** Relative domain delta below which Y tween may be skipped (see plan). */
export const Y_DOMAIN_TWEEN_SKIP_THRESHOLD = 0.02

/** Resting phase for a given status before transition orchestration runs. */
export function resolveRestingChartPhase(status: ChartStatus): ChartPhase {
  return status === "loading" ? "loading" : "ready"
}

export function isChartInteractionPhase(phase: ChartPhase): boolean {
  return phase === "ready"
}

export const DEFAULT_CHART_LIFECYCLE = {
  chartPhase: "ready",
  chartStatus: "ready",
  loadingLabel: undefined,
  yDomainTweenDuration: DEFAULT_Y_DOMAIN_TWEEN_MS,
  yDomainSkeletonByAxis: { left: [0, 100] as [number, number] },
  // No target: charts without a y-domain tween (bar, candlestick, scatter,
  // live line) have no settled domain distinct from the live scale, so
  // `useSettledYScale` must fall back to it. A placeholder here made `YAxis`
  // tick 0–100 on top of the real data scale.
  yDomainTargetByAxis: {} as Record<string, [number, number]>,
} as const satisfies {
  chartPhase: ChartPhase
  chartStatus: ChartStatus
  loadingLabel: undefined
  yDomainTweenDuration: number
  yDomainSkeletonByAxis: Record<string, [number, number]>
  yDomainTargetByAxis: Record<string, [number, number]>
}
