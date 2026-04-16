export interface SoundAsset {
  /** Unique identifier for the sound */
  name: string
  /** Base64-encoded data URI (data:audio/mpeg;base64,...) */
  dataUri: string
  /** Duration in seconds */
  duration: number
  /** Audio format */
  format: "mp3" | "wav" | "ogg"
  /** License identifier */
  license: "CC0" | "OGA-BY" | "MIT"
  /** Original author/creator */
  author: string
}

export interface UseSoundOptions {
  /** Volume level from 0 to 1. Default: 1 */
  volume?: number
  /** Playback speed multiplier. Default: 1 */
  playbackRate?: number
  /** If true, calling play() stops current playback first. Default: false */
  interrupt?: boolean
  /** If false, play() does nothing. Useful for user preferences. Default: true */
  soundEnabled?: boolean
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
  duration: number | null
  sound: SoundAsset
}

export type UseSoundReturn = readonly [PlayFunction, SoundControls]
