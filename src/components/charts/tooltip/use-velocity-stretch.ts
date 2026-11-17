"use client"

import { useLayoutEffect, useRef } from "react"
import {
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react"

/** Tuning for the date pill's velocity swell (see `ChartTooltip` `datePillVelocity`). */
export interface DatePillVelocityConfig {
  /** Uniform growth at full speed (`0.06` = 6% bigger). Default: `0.06` */
  scale?: number
  /** Extra horizontal stretch along the direction of travel at full speed. Default: `0.08` */
  stretch?: number
  /** Speed (px/s) that counts as "full speed". Default: `1600` */
  maxVelocity?: number
}

const DEFAULTS: Required<DatePillVelocityConfig> = {
  scale: 0.06,
  stretch: 0.08,
  maxVelocity: 1600,
}

/**
 * Settles the swell: fast enough to track a flick, damped so it eases back to
 * rest instead of wobbling when the pointer stops.
 */
const SWELL_SPRING = { stiffness: 420, damping: 32, mass: 0.6 }

export function resolveDatePillVelocity(
  value: boolean | DatePillVelocityConfig | undefined
): Required<DatePillVelocityConfig> | null {
  if (!value) {
    return null
  }
  return value === true ? DEFAULTS : { ...DEFAULTS, ...value }
}

/** `0…1` swell for a speed: ease-out so small moves already register. */
export function velocitySwell(velocity: number, maxVelocity: number): number {
  if (maxVelocity <= 0) {
    return 0
  }
  const t = Math.min(Math.abs(velocity) / maxVelocity, 1)
  return t * (2 - t)
}

/**
 * Glass-menu style swell: as `x` moves, the element grows slightly and
 * stretches along the motion, then springs back to `1` at rest. Pure motion
 * values — pointer moves never re-render React. Returns `scale: 1` values when
 * `config` is `null` (off or reduced motion).
 */
export function useVelocityStretch(
  x: MotionValue<number>,
  config: Required<DatePillVelocityConfig> | null
): { scaleX: MotionValue<number>; scaleY: MotionValue<number> } {
  // Transforms read the latest config from a ref, so a new config object
  // (or toggling off) applies without rebuilding the motion values.
  const configRef = useRef(config)
  useLayoutEffect(() => {
    configRef.current = config
  })
  const velocity = useVelocity(x)
  const swell = useTransform(velocity, (v) => {
    const c = configRef.current
    return c ? velocitySwell(v, c.maxVelocity) : 0
  })
  const smooth = useSpring(swell, SWELL_SPRING)
  const scaleX = useTransform(smooth, (a) => {
    const c = configRef.current
    return c ? 1 + a * (c.scale + c.stretch) : 1
  })
  const scaleY = useTransform(smooth, (a) => {
    const c = configRef.current
    return c ? 1 + a * c.scale : 1
  })
  return { scaleX, scaleY }
}
