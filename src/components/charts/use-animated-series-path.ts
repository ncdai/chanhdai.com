"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import type { CurveFactory } from "d3-shape"
import { curveLinear } from "d3-shape"
import { animate, useReducedMotion } from "motion/react"

import { LINE_LOADING_PULSE_EASE } from "./line-loading-timing"
import {
  computeSeriesPathPoints,
  flattenSeriesPath,
  interpolateSeriesPathPoints,
  morphSeriesPolylines,
  seriesDataSignature,
  seriesPathFromPoints,
  seriesPathTransitionSignatureFromData,
  type SeriesPathPoint,
} from "./series-path-utils"

export interface UseAnimatedSeriesPathOptions {
  renderData: Record<string, unknown>[]
  xAccessor: (datum: Record<string, unknown>) => Date
  xScale: (value: Date) => number | undefined
  yScale: (value: number) => number | undefined
  /**
   * Y-scale at the end of the y-domain tween. Data morphs animate toward this
   * scale so the line never chases a mid-tween domain out of the plot.
   * Default: `yScale`.
   */
  settledYScale?: (value: number) => number | undefined
  dataKey: string
  curve: CurveFactory
  chartPhase: string
  durationMs: number
  innerWidth: number
  enabled: boolean
}

/**
 * Points currently on screen. `polyline` frames are dense samples of the
 * rendered curve (vertical morph) and are drawn with `curveLinear`.
 */
interface DisplayedSeriesPath {
  points: SeriesPathPoint[]
  polyline: boolean
}

export function useAnimatedSeriesPath({
  renderData,
  xAccessor,
  xScale,
  yScale,
  settledYScale = yScale,
  dataKey,
  curve,
  chartPhase,
  durationMs,
  innerWidth,
  enabled,
}: UseAnimatedSeriesPathOptions) {
  const reducedMotion = useReducedMotion()
  const [animatedPath, setAnimatedPath] = useState<DisplayedSeriesPath | null>(
    null
  )
  const displayedRef = useRef<DisplayedSeriesPath | null>(null)
  const animatingRef = useRef(false)

  const xScaleDomain = useMemo(() => {
    const scaleWithDomain = xScale as { domain?: () => [Date, Date] }
    return scaleWithDomain.domain?.() ?? [new Date(0), new Date(0)]
  }, [xScale])

  const targetPoints = useMemo(
    () =>
      computeSeriesPathPoints(renderData, xAccessor, xScale, yScale, dataKey),
    [renderData, xAccessor, xScale, yScale, dataKey]
  )

  const dataSignature = useMemo(
    () => seriesDataSignature(renderData, xAccessor, dataKey),
    [renderData, xAccessor, dataKey]
  )

  // Same string `seriesPathTransitionSignature` builds, without walking the
  // data a second time.
  const transitionSignature = useMemo(
    () =>
      seriesPathTransitionSignatureFromData(dataSignature, {
        innerWidth,
        xDomainMin: xScaleDomain[0]?.getTime?.() ?? 0,
        xDomainMax: xScaleDomain[1]?.getTime?.() ?? 0,
      }),
    [dataSignature, innerWidth, xScaleDomain]
  )

  const settledYDomainKey =
    (settledYScale as { domain?: () => number[] }).domain?.().join(",") ?? ""

  const prevTransitionSignatureRef = useRef(transitionSignature)
  const prevDataSignatureRef = useRef(dataSignature)
  const prevSettledYDomainKeyRef = useRef(settledYDomainKey)

  // Live scale/data inputs for the running tween. The y-domain tween rebuilds
  // `yScale` every frame, so these must not be effect deps — otherwise the
  // effect cleanup stops the path tween after its first frame.
  const latestRef = useRef({
    renderData,
    xAccessor,
    xScale,
    yScale,
    settledYScale,
    dataKey,
    curve,
  })
  // Synced in a layout effect declared before the tween effect (not during
  // render) so `renderFrame(0)` and every animation frame see this commit's
  // inputs.
  useLayoutEffect(() => {
    latestRef.current = {
      renderData,
      xAccessor,
      xScale,
      yScale,
      settledYScale,
      dataKey,
      curve,
    }
  })
  const computeLatestTarget = (settled = false) => {
    const latest = latestRef.current
    return computeSeriesPathPoints(
      latest.renderData,
      latest.xAccessor,
      latest.xScale,
      settled ? latest.settledYScale : latest.yScale,
      latest.dataKey
    )
  }

  const shouldAnimate =
    enabled &&
    !reducedMotion &&
    chartPhase === "ready" &&
    durationMs > 0 &&
    renderData.length > 0

  // Drop a stale tween frame as soon as animation is no longer allowed —
  // adjusted during render rather than via setState in the effect below.
  if (!shouldAnimate && animatedPath !== null) {
    setAnimatedPath(null)
  }

  // Layout effect so frame 0 (the previous shape) is committed before paint;
  // otherwise the new target flashes for a frame before the tween starts.
  // biome-ignore lint/correctness/useExhaustiveDependencies: scales/targets are read live via latestRef; only a new data signature should restart the tween
  useLayoutEffect(() => {
    const dataChanged = prevDataSignatureRef.current !== dataSignature
    prevDataSignatureRef.current = dataSignature
    const yDomainChanged =
      prevSettledYDomainKeyRef.current !== settledYDomainKey
    prevSettledYDomainKeyRef.current = settledYDomainKey

    if (!shouldAnimate) {
      animatingRef.current = false
      displayedRef.current = { points: targetPoints, polyline: false }
      prevTransitionSignatureRef.current = transitionSignature
      return
    }

    if (prevTransitionSignatureRef.current === transitionSignature) {
      return
    }
    prevTransitionSignatureRef.current = transitionSignature

    const from = displayedRef.current ?? {
      points: targetPoints,
      polyline: false,
    }
    if (from.points.length === 0) {
      displayedRef.current = { points: targetPoints, polyline: false }
      return
    }

    animatingRef.current = true
    // New/removed data points: morph vertically on a shared x grid so the line
    // rises and falls into shape. Same data with a moved x-domain (brush pan /
    // resize): slide points by key so the series tracks the viewport.
    const morph = dataChanged || from.polyline
    const fromPolyline = from.polyline
      ? from.points
      : flattenSeriesPath(from.points, curve)
    // When new data also moves the y-domain, hold the line in place while the
    // grid and y-axis tween to the new scale, then morph straight to its
    // settled pixels — morphing against the mid-tween scale sends the line
    // far outside the plot when the magnitude changes (e.g. ~15k → ~10).
    const holdForYDomain = morph && dataChanged && yDomainChanged

    // The morph target only depends on these inputs (the settled scale, not
    // the mid-tween one), so its flattened polyline is reused across frames
    // until one of them changes.
    let targetPolylineCache: {
      inputs: readonly unknown[]
      polyline: SeriesPathPoint[]
    } | null = null
    const settledTargetPolyline = () => {
      const latest = latestRef.current
      const inputs = [
        latest.renderData,
        latest.xAccessor,
        latest.xScale,
        latest.settledYScale,
        latest.dataKey,
        latest.curve,
      ] as const
      const cached = targetPolylineCache
      if (cached && inputs.every((input, i) => input === cached.inputs[i])) {
        return cached.polyline
      }
      const polyline = flattenSeriesPath(
        computeLatestTarget(true),
        latest.curve
      )
      targetPolylineCache = { inputs, polyline }
      return polyline
    }

    const renderFrame = (progress: number) => {
      // Morphs target the settled scale; x-domain slides (brush) track the
      // live y-domain tween so the series stays glued to the grid.
      const next: DisplayedSeriesPath = morph
        ? {
            points: morphSeriesPolylines(
              fromPolyline,
              settledTargetPolyline(),
              progress
            ),
            polyline: true,
          }
        : {
            points: interpolateSeriesPathPoints(
              from.points,
              computeLatestTarget(false),
              progress
            ),
            polyline: false,
          }
      displayedRef.current = next
      setAnimatedPath(next)
    }
    renderFrame(0)

    const control = animate(0, 1, {
      delay: holdForYDomain ? durationMs / 1000 : 0,
      duration: durationMs / 1000,
      ease: [...LINE_LOADING_PULSE_EASE],
      onUpdate: renderFrame,
      onComplete: () => {
        animatingRef.current = false
        displayedRef.current = {
          points: computeLatestTarget(),
          polyline: false,
        }
        setAnimatedPath(null)
      },
    })

    return () => {
      control.stop()
      animatingRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    transitionSignature,
    dataSignature,
    shouldAnimate,
    chartPhase,
    durationMs,
    enabled,
    reducedMotion,
    renderData.length,
  ])

  // Must run after the tween effect: on a data change the tween needs the
  // previously displayed points as its `from`, not the new target.
  useEffect(() => {
    if (!animatingRef.current) {
      displayedRef.current = { points: targetPoints, polyline: false }
    }
  }, [targetPoints])

  const pathD = useMemo(
    () =>
      animatedPath
        ? seriesPathFromPoints(
            animatedPath.points,
            animatedPath.polyline ? curveLinear : curve
          )
        : seriesPathFromPoints(targetPoints, curve),
    [animatedPath, targetPoints, curve]
  )

  return {
    pathD,
    isPathAnimating: animatedPath != null,
  }
}
