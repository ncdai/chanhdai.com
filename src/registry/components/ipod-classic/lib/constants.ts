export const BOOT_MIN_MS = 2000

/** Degrees of wheel rotation per list row. */
export const DRAG_STEP_DEGREES = 15

/** Volume moves 1% per 4.5° (100 steps per 1.25 turns). */
export const VOLUME_STEP_DEGREES = (1.25 * 360) / 100
/** Clicks while changing volume are sparser than the steps themselves. */
export const VOLUME_CLICK_DEGREES = (1.25 * 360) / 22
export const VOLUME_KEY_STEP = 5

export const LIST_ACCELERATION = {
  minSpeed: 180,
  tierMs: 500,
  /** Rows per click. */
  tiers: [1, 2, 3, 5, 8, 13, 21, 34],
}

export const SEEK_ACCELERATION = {
  minSpeed: 180,
  tierMs: 500,
  /** Seconds per click. */
  tiers: [1, 2, 3, 5],
}

export type Acceleration = typeof LIST_ACCELERATION

export const MAX_SMOOTHED_SPEED = 400
export const SPEED_SMOOTHING = 0.15
export const ACCELERATION_STALE_MS = 250

export const KEY_REPEAT_DELAY_MS = 300
export const KEY_REPEAT_INTERVAL_MS = 80
export const KEY_ARROW_STEP_DEGREES = 15

export const HOLD_MS = 1000
export const HOLD_REPEAT_MS = 500
/** Seconds jumped by each repeat while Back or Forward is held. */
export const HOLD_SEEK_STEPS = [5, 5, 5, 10, 10, 10, 20]
export const SELECT_HOLD_BRICK_MS = 5000

export const IDLE_JUMP_MS = 10_000
export const SEEK_IDLE_MS = 5000
export const SEEK_COMMIT_MS = 1000
export const VOLUME_IDLE_MS = 5000
export const VOLUME_SAVE_MS = 1000

/** Previous restarts the song instead once it has played this long. */
export const RESTART_THRESHOLD_SECONDS = 3
export const CROSSFADE_SECONDS = 2

export const BRICK_PADDLE_STEER = 0.035

/** Wheel geometry, as percentages of the 350px click wheel. */
const WHEEL_SIZE = 350
export const SELECT_BUTTON_PERCENT = (100 / WHEEL_SIZE) * 100
export const SCROLL_WHEEL_PERCENT = (276 / WHEEL_SIZE) * 100
