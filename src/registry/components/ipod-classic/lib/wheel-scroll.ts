import {
  HOLD_SEEK_STEPS,
  VOLUME_CLICK_DEGREES,
  VOLUME_STEP_DEGREES,
} from "./constants"
import type { ScrollTarget } from "./types"

function divide(value: number, size: number) {
  const count = Math.floor(value / size)
  return { count, remainder: value - count * size }
}

/**
 * Turns wheel degrees into steps. Lists move a row per `dragStepDegrees`
 * (times the acceleration); volume moves 1% per 4.5° and clicks more sparsely.
 */
export function createWheelScroller({
  move,
  click,
}: {
  move: (step: number, count: number) => boolean
  click: (count: number, target: ScrollTarget) => void
}) {
  let travel = 0
  let clickTravel = 0
  let lastStep: number | undefined
  let lastWasVolume: boolean | undefined
  let volumeChanged = false

  function reset() {
    travel = 0
    clickTravel = 0
    volumeChanged = false
  }

  function scrollVolume(step: number, degrees: number) {
    const steps = divide(travel, VOLUME_STEP_DEGREES)
    travel = steps.remainder
    if (steps.count >= 1) {
      volumeChanged = move(step, steps.count) || volumeChanged
    }
    const clicks = divide(clickTravel + degrees, VOLUME_CLICK_DEGREES)
    clickTravel = clicks.remainder
    if (clicks.count >= 1) {
      if (volumeChanged) click(clicks.count, "volume")
      volumeChanged = false
    }
  }

  function scroll({
    step,
    degrees,
    target,
    multiplier,
    dragStepDegrees,
  }: {
    step: number
    degrees: number
    target: ScrollTarget
    multiplier: number
    dragStepDegrees: number
  }) {
    const isVolume = target === "volume"
    if (step !== lastStep || isVolume !== lastWasVolume) {
      lastStep = step
      lastWasVolume = isVolume
      reset()
    }
    travel += degrees
    if (isVolume) {
      scrollVolume(step, degrees)
      return
    }
    const steps = divide(travel, dragStepDegrees)
    travel = steps.remainder
    if (steps.count < 1) return
    if (move(step, steps.count * multiplier)) click(steps.count, target)
  }

  return { scroll, reset }
}

/**
 * Holding Back or Forward on Now Playing skips through the song in growing
 * jumps, starting from where it was when the hold began.
 */
export function createHoldSeeker() {
  let base: number | undefined
  let track: number | undefined
  let repeats = 0

  return {
    step(
      direction: number,
      isRepeat: boolean,
      state: {
        isInert: boolean
        isSeeking: boolean
        hasLoadedItem: boolean
        currentTrackIndex: number
        currentTime: number
        duration: number
      }
    ) {
      if (!isRepeat) {
        base = state.isInert ? undefined : state.currentTime
        track = state.currentTrackIndex
        repeats = 0
      }
      if (
        base === undefined ||
        state.isInert ||
        state.isSeeking ||
        !state.hasLoadedItem ||
        state.duration <= 0 ||
        state.currentTrackIndex !== track
      ) {
        return
      }
      const jump =
        HOLD_SEEK_STEPS[Math.min(repeats, HOLD_SEEK_STEPS.length - 1)]
      const time = Math.min(
        Math.max(base + direction * jump, 0),
        state.duration
      )
      repeats += 1
      base = time > 0 && time < state.duration ? time : undefined
      return time
    },
    cancel() {
      base = undefined
    },
  }
}
