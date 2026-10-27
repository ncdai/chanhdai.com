import { createAccelerator } from "./acceleration"
import {
  isAdjustingVolumeAtom,
  playbackAtom,
  seekAtom,
  type IpodStore,
  type PlaybackState,
} from "./atoms"
import {
  SEEK_ACCELERATION,
  SEEK_COMMIT_MS,
  SEEK_IDLE_MS,
  VOLUME_IDLE_MS,
} from "./constants"
import type { Playback } from "./playback"
import { createTimeout } from "./timers"

/** A mode that closes itself after a quiet spell, unless held open. */
function createIdleMode(options: {
  timeoutMs: number
  isActive: () => boolean
  enter: () => void
  onLeave: () => void
}) {
  let keptOpen = false
  const timer = createTimeout(options.timeoutMs, leave)

  function leave() {
    if (!options.isActive()) return
    timer.stop()
    options.onLeave()
  }

  function exit() {
    keptOpen = false
    leave()
  }

  return {
    restartIdleTimer() {
      if (!keptOpen) timer.start()
    },
    /** Focus on a slider holds the mode open. */
    keepOpen() {
      keptOpen = true
      timer.stop()
      if (!options.isActive()) options.enter()
    },
    release() {
      keptOpen = false
      if (options.isActive()) timer.start()
    },
    exit,
    reenter() {
      const wasKeptOpen = keptOpen
      leave()
      if (wasKeptOpen) options.enter()
    },
    /** Leaving Now Playing closes the mode. */
    handleScreenChange(isNowPlaying: boolean) {
      if (!isNowPlaying) exit()
    },
    destroy: timer.stop,
  }
}

/** Select on Now Playing: the wheel scrubs through the song. */
export function createSeekController(store: IpodStore, playback: Playback) {
  const accelerator = createAccelerator(SEEK_ACCELERATION)
  const playbackState = () => store.get(playbackAtom)
  const isSeeking = () => store.get(seekAtom).isSeeking
  const setPreview = (previewTime: number | undefined) =>
    store.set(seekAtom, (state) => ({ ...state, previewTime }))
  let pending: number | undefined
  let generation = 0
  let isDragging = false
  let enteredTrack: number | undefined
  let enteredQueue: PlaybackState["queue"] | undefined
  const commitTimer = createTimeout(SEEK_COMMIT_MS, commit)

  function commit() {
    commitTimer.stop()
    if (pending === undefined) return
    const time = pending
    pending = undefined
    const current = ++generation
    playback.seek(time).then(() => {
      if (current === generation) setPreview(undefined)
    })
  }

  function enter() {
    const { currentTrackIndex, queue } = playbackState()
    enteredTrack = currentTrackIndex
    enteredQueue = queue
    idle.restartIdleTimer()
    store.set(seekAtom, { isSeeking: true })
  }

  function leave() {
    commit()
    enteredTrack = undefined
    enteredQueue = undefined
    isDragging = false
    store.set(seekAtom, { isSeeking: false })
  }

  const idle = createIdleMode({
    timeoutMs: SEEK_IDLE_MS,
    isActive: isSeeking,
    enter,
    onLeave: leave,
  })

  function shownTime() {
    return (
      store.get(seekAtom).previewTime ?? Math.floor(playbackState().currentTime)
    )
  }

  function seekTo(time: number) {
    if (!isSeeking()) return false
    const { duration } = playbackState()
    const max = duration > 0 ? duration : Infinity
    const target = Math.min(max, Math.max(0, Math.round(time)))
    idle.restartIdleTimer()
    if (target === shownTime()) return false
    pending = target
    generation += 1
    if (!isDragging) commitTimer.start()
    setPreview(target)
    return true
  }

  const unsubscribe = store.sub(playbackAtom, () => {
    if (!isSeeking()) return
    const { currentTrackIndex, queue, duration, hasLoadedItem } =
      playbackState()
    if (currentTrackIndex !== enteredTrack || queue !== enteredQueue) {
      if (hasLoadedItem) idle.reenter()
      else idle.exit()
      return
    }
    const { previewTime } = store.get(seekAtom)
    if (duration > 0 && previewTime !== undefined && previewTime > duration) {
      if (pending !== undefined) pending = duration
      setPreview(duration)
    }
  })

  return {
    toggle() {
      if (isSeeking()) idle.exit()
      else enter()
    },
    seekTo,
    seekBy: (seconds: number) => seekTo(shownTime() + seconds),
    commit,
    accelerate(speed: number, direction: number) {
      if (isSeeking()) idle.restartIdleTimer()
      return accelerator.next(speed, direction, isSeeking())
    },
    keepOpen: idle.keepOpen,
    release() {
      commit()
      idle.release()
    },
    exit: idle.exit,
    handleScreenChange: idle.handleScreenChange,
    /** The commit waits for the finger to lift, so audio does not stutter. */
    handleDragStart() {
      isDragging = true
      commitTimer.stop()
    },
    handleDragEnd() {
      isDragging = false
      if (pending !== undefined) commitTimer.start()
    },
    destroy() {
      commit()
      idle.destroy()
      unsubscribe()
    },
  }
}

/** Turning the wheel on Now Playing changes the volume. */
export function createVolumeController(store: IpodStore, playback: Playback) {
  const isAdjusting = () => store.get(isAdjustingVolumeAtom)
  const setAdjusting = (value: boolean) =>
    store.set(isAdjustingVolumeAtom, value)
  const percent = () => Math.round(store.get(playbackAtom).volume * 100)

  const idle = createIdleMode({
    timeoutMs: VOLUME_IDLE_MS,
    isActive: isAdjusting,
    enter: () => setAdjusting(true),
    onLeave: () => setAdjusting(false),
  })

  function set(value: number) {
    const next = Math.min(100, Math.max(0, value))
    idle.restartIdleTimer()
    setAdjusting(true)
    if (next === percent()) return false
    playback.setVolume(next / 100)
    return true
  }

  return {
    set,
    change: (delta: number) => set(percent() + delta),
    keepOpen: idle.keepOpen,
    release: idle.release,
    exit: idle.exit,
    handleScreenChange: idle.handleScreenChange,
    destroy: idle.destroy,
  }
}
