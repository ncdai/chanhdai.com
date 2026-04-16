export interface UseSoundOptions {
  /** Volume level from 0 to 1. Default: 1 */
  volume?: number
  /** Playback speed multiplier. Default: 1 */
  playbackRate?: number
  /** If true, calling play() stops current playback first. Default: false */
  interrupt?: boolean
  /** If false, play() does nothing. Useful for user preferences. Default: true */
  soundEnabled?: boolean
  /**
   * When true, audio is not fetched until the first play() call.
   * When false, audio is fetched immediately on mount.
   * Default: false
   */
  lazy?: boolean
  /** Called when playback starts */
  onPlay?: () => void
  /** Called when playback ends naturally */
  onEnd?: () => void
  /** Called when pause() is called */
  onPause?: () => void
  /** Called when stop() is called */
  onStop?: () => void
}

export type PlayFunction = (overrides?: {
  volume?: number
  playbackRate?: number
}) => void

export interface SoundControls {
  stop: () => void
  pause: () => void
  isPlaying: boolean
}

export type UseSoundReturn = readonly [PlayFunction, SoundControls]
