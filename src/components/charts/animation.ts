import type { Transition } from "motion/react"

/** Default clip-reveal easing for cartesian charts. */
export const DEFAULT_ANIMATION_EASING = "cubic-bezier(0.85, 0, 0.15, 1)"

export const DEFAULT_ANIMATION_DURATION_MS = 1100

/** Default enter transition — matches the original line chart reveal. */
export const DEFAULT_CHART_ENTER_TRANSITION: Transition = {
  type: "tween",
  duration: DEFAULT_ANIMATION_DURATION_MS / 1000,
  ease: [0.85, 0, 0.15, 1],
}

/**
 * Clip-path width reveal must use tween — spring does not reliably animate SVG width.
 */
export function clipRevealTransition(enterTransition?: Transition): Transition {
  if (enterTransition?.type === "tween") {
    return {
      ...enterTransition,
      ease: enterTransition.ease ?? DEFAULT_CHART_ENTER_TRANSITION.ease,
    }
  }

  const duration =
    typeof enterTransition?.duration === "number"
      ? enterTransition.duration
      : DEFAULT_ANIMATION_DURATION_MS / 1000

  return {
    type: "tween",
    duration,
    ease: DEFAULT_CHART_ENTER_TRANSITION.ease,
  }
}

/*
 * Polar grid enter — the radar chart standard (RadarGrid / RadarAxis /
 * RadarLabels), shared by the radial and ring charts so every circular grid
 * draws in the same way: rings grow out of the center one after another,
 * spokes extend outward, then labels fade in.
 */

/** Delay between concentric grid rings, seconds. */
export const GRID_RING_STAGGER_S = 0.08
/** Grid rings scale (and fade) in from the center. */
export const GRID_RING_SPRING: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 1,
}
/** Delay between spokes, seconds. */
export const GRID_SPOKE_STAGGER_S = 0.05
/** Spokes extend from their inner end outward. */
export const GRID_SPOKE_SPRING: Transition = {
  type: "spring",
  stiffness: 80,
  damping: 15,
  mass: 1,
}
/** Delay between value (level) labels, seconds. */
export const GRID_VALUE_LABEL_STAGGER_S = 0.06
/** Delay between angle (category) labels, seconds. */
export const GRID_ANGLE_LABEL_STAGGER_S = 0.08
/** Angle label fade duration, seconds. */
export const GRID_ANGLE_LABEL_FADE_S = 0.5

/** Labels start once half of the `ringCount` grid rings have started. */
export function gridLabelDelay(
  ringCount: number,
  ringStagger: number = GRID_RING_STAGGER_S
): number {
  return ringCount * ringStagger * 0.5
}
