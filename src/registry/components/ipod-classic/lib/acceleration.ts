import {
  ACCELERATION_STALE_MS,
  MAX_SMOOTHED_SPEED,
  SPEED_SMOOTHING,
  type Acceleration,
} from "./constants"

/** Degrees per second. */
export function wheelSpeed(degrees: number, elapsedMs: number) {
  return elapsedMs > 0 ? (degrees / elapsedMs) * 1000 : 0
}

export function tierFor(config: Acceleration, heldMs: number) {
  const index = Math.min(
    config.tiers.length - 1,
    Math.floor(heldMs / config.tierMs)
  )
  return config.tiers[index]
}

/**
 * Turns a steady fast spin into bigger steps, climbing a tier every
 * `tierMs` while the smoothed speed stays above `minSpeed`.
 */
export function createAccelerator(config: Acceleration) {
  let smoothed = 0
  let lastDirection: number | undefined
  let lastTime: number | undefined
  let fastSince: number | undefined

  function reset() {
    smoothed = 0
    lastDirection = undefined
    lastTime = undefined
    fastSince = undefined
  }

  function next(speed: number, direction: number, active: boolean) {
    if (!active) {
      reset()
      return config.tiers[0]
    }
    const now = performance.now()
    const isStale =
      lastTime !== undefined && now - lastTime > ACCELERATION_STALE_MS
    lastTime = now
    const clamped = Math.min(speed, MAX_SMOOTHED_SPEED)

    if (direction !== lastDirection || isStale) {
      smoothed = clamped
      lastDirection = direction
      fastSince = undefined
    } else {
      smoothed += SPEED_SMOOTHING * (clamped - smoothed)
    }

    if (smoothed <= config.minSpeed) {
      fastSince = undefined
      return config.tiers[0]
    }
    fastSince ??= now
    return tierFor(config, now - fastSince)
  }

  return { next, reset }
}
