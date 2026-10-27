import { CROSSFADE_SECONDS, RESTART_THRESHOLD_SECONDS } from "./constants"
import type { RepeatMode } from "./types"

const CURVE_POINTS = 50

function curve(fn: (t: number) => number) {
  return Float32Array.from({ length: CURVE_POINTS }, (_, i) =>
    fn(i / (CURVE_POINTS - 1))
  )
}

// Equal-power curves keep the sum steady while two songs overlap.
const FADE_IN = curve((t) => Math.cos((1 - t) * Math.PI * 0.5))
const FADE_OUT = curve((t) => Math.cos(t * Math.PI * 0.5))

function shuffle<T>(items: T[]) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** One song's audio element, routed through its own fade gain. */
class Channel {
  readonly audio: HTMLAudioElement
  private readonly context: AudioContext
  private readonly gain: GainNode
  private readonly source: MediaElementAudioSourceNode
  private fadeDone: ReturnType<typeof setTimeout> | undefined

  constructor(context: AudioContext, url: string, output: AudioNode) {
    this.audio = new Audio()
    this.audio.preload = "auto"
    this.audio.crossOrigin = "anonymous"
    this.audio.src = url
    this.context = context
    this.gain = context.createGain()
    this.gain.gain.value = 0
    this.source = context.createMediaElementSource(this.audio)
    this.source.connect(this.gain).connect(output)
  }

  private cancelFade() {
    clearTimeout(this.fadeDone)
    this.gain.gain.cancelScheduledValues(this.context.currentTime)
  }

  private fade(values: Float32Array, onDone?: () => void) {
    this.cancelFade()
    this.gain.gain.setValueCurveAtTime(
      values,
      this.context.currentTime,
      CROSSFADE_SECONDS
    )
    if (onDone) this.fadeDone = setTimeout(onDone, CROSSFADE_SECONDS * 1000)
  }

  fadeIn() {
    this.fade(FADE_IN)
  }

  fadeOut(onDone?: () => void) {
    this.fade(FADE_OUT, onDone)
  }

  cutIn() {
    this.cancelFade()
    this.gain.gain.setValueAtTime(1, this.context.currentTime)
  }

  destroy() {
    clearTimeout(this.fadeDone)
    this.audio.pause()
    this.audio.removeAttribute("src")
    this.audio.load()
    this.source.disconnect()
    this.gain.disconnect()
  }
}

type PlayerState = {
  isPlaying: boolean
  currentTime: number
  duration: number
  hasLoadedItem: boolean
  /** Position in play order, which differs from the queue when shuffled. */
  queuePosition: number
}

/**
 * Plays a queue like a DJ with two turntables: the channel playing now and
 * the one cued up next, crossfaded over the last seconds of each song.
 */
export class CrossfadePlayer {
  private readonly state: PlayerState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    hasLoadedItem: false,
    queuePosition: 0,
  }

  private readonly urls: string[]
  private readonly context: AudioContext
  /** The song shown on screen changed to `index`. */
  private readonly onAdvance: (index: number) => void
  private readonly onChange: (state: Partial<PlayerState>) => void
  private readonly volumeGain: GainNode

  private currentIndex = 0
  private current: Channel | undefined
  private next: Channel | undefined
  private nextIndex: number | undefined
  /** The channel whose time is on screen; lags `current` mid-crossfade. */
  private display: Channel | undefined
  private readonly fading = new Set<Channel>()
  private pendingCrossfadeFrom: { channel: Channel; index: number } | undefined
  private hasTriggeredFade = false
  private isShuffled: boolean
  private repeatMode: RepeatMode
  private playOrder: number[] = []

  constructor(options: {
    urls: string[]
    context: AudioContext
    shuffle: boolean
    repeatMode: RepeatMode
    onAdvance: (index: number) => void
    onChange: (state: Partial<PlayerState>) => void
  }) {
    this.urls = options.urls
    this.context = options.context
    this.onAdvance = options.onAdvance
    this.onChange = options.onChange
    this.volumeGain = this.context.createGain()
    this.volumeGain.connect(this.context.destination)
    this.isShuffled = options.shuffle
    this.repeatMode = options.repeatMode
  }

  private patch(partial: Partial<PlayerState>) {
    Object.assign(this.state, partial)
    this.onChange(partial)
  }

  private setCurrent(channel: Channel | undefined) {
    this.current = channel
    this.patch({ hasLoadedItem: !!channel })
  }

  private clearNext() {
    this.next?.destroy()
    this.next = undefined
    this.nextIndex = undefined
  }

  private promoteNext() {
    this.setCurrent(this.next)
    this.next = undefined
    this.nextIndex = undefined
  }

  private destroyActive() {
    this.current?.destroy()
    this.clearNext()
    this.setCurrent(undefined)
    this.display = undefined
  }

  private destroyFading() {
    this.fading.forEach((channel) => channel.destroy())
    this.fading.clear()
  }

  private createChannel(index: number) {
    const url = this.urls[index]
    if (url === undefined) return
    const channel = new Channel(this.context, url, this.volumeGain)
    this.bind(channel)
    return channel
  }

  private setDuration(audio: HTMLAudioElement) {
    if (
      Number.isFinite(audio.duration) &&
      audio.duration !== this.state.duration
    ) {
      this.patch({ duration: audio.duration })
    }
  }

  /** Duration stays 0 until the channel knows its own. */
  private syncToChannel(channel: Channel | undefined) {
    this.patch({
      currentTime: channel?.audio.currentTime ?? 0,
      duration:
        channel && Number.isFinite(channel.audio.duration)
          ? channel.audio.duration
          : 0,
    })
  }

  private syncQueuePosition(index = this.currentIndex) {
    this.patch({
      queuePosition: this.isShuffled ? this.playOrder.indexOf(index) : index,
    })
  }

  private promoteToDisplay(channel: Channel) {
    if (channel === this.display) return
    this.display = channel
    this.syncToChannel(channel)
    this.onAdvance(this.currentIndex)
    this.syncQueuePosition()
    this.pendingCrossfadeFrom = undefined
  }

  // Channels are compared by reference: repeat-one crossfades a song into
  // a new instance of itself, so an index can match both.
  private bind(channel: Channel) {
    const { audio } = channel

    audio.addEventListener("durationchange", () => {
      if (channel === this.display) this.setDuration(audio)
    })

    audio.addEventListener("timeupdate", () => {
      if (
        channel === this.current &&
        audio.currentTime >= CROSSFADE_SECONDS / 2
      ) {
        this.promoteToDisplay(channel)
      }
      if (channel === this.display) {
        this.patch({ currentTime: audio.currentTime })
        this.setDuration(audio)
      }
      if (channel !== this.current) return

      const { currentTime, duration } = audio
      if (
        !Number.isFinite(duration) ||
        duration <= CROSSFADE_SECONDS ||
        this.hasTriggeredFade ||
        currentTime < duration - CROSSFADE_SECONDS
      ) {
        return
      }
      this.hasTriggeredFade = true
      if (this.next) this.crossfadeToNext()
      else channel.fadeOut()
    })

    audio.addEventListener("ended", () => {
      if (channel !== this.current) return
      this.promoteToDisplay(channel)
      if (this.next) {
        this.crossfadeToNext()
        return
      }
      this.endQueue()
    })
  }

  private endQueue() {
    this.destroyActive()
    this.destroyFading()
    this.pendingCrossfadeFrom = undefined
    this.patch({ isPlaying: false })
    this.syncToChannel(undefined)
  }

  private autoAdvanceIndex(from: number) {
    return this.repeatMode === "one" ? from : this.adjacentIndex(from, 1)
  }

  private displayedIndex() {
    return this.pendingCrossfadeFrom?.index ?? this.currentIndex
  }

  /** Manual skips always land on a different song. */
  private adjacentIndex(from: number, direction: 1 | -1) {
    const wraps = this.repeatMode === "all"

    if (!this.isShuffled) {
      const index = from + direction
      if (index >= 0 && index < this.urls.length) return index
      if (!wraps) return
      return direction === 1 ? 0 : this.urls.length - 1
    }

    const position = this.playOrder.indexOf(from) + direction
    if (position >= 0 && position < this.playOrder.length) {
      return this.playOrder[position]
    }
    if (!wraps) return
    return this.playOrder[direction === 1 ? 0 : this.playOrder.length - 1]
  }

  /** Re-cues the second turntable whenever the index, shuffle or repeat changes. */
  private prepareNext() {
    if (!this.current) return
    const index = this.autoAdvanceIndex(this.currentIndex)
    if (index === this.nextIndex) return
    this.clearNext()
    if (index === undefined) return
    this.nextIndex = index
    this.next = this.createChannel(index)
  }

  private crossfadeToNext() {
    const from = this.current
    const to = this.next
    if (!from || !to || this.nextIndex === undefined) return

    this.pendingCrossfadeFrom ??= { channel: from, index: this.currentIndex }
    from.fadeOut(() => {
      from.destroy()
      this.fading.delete(from)
      if (this.pendingCrossfadeFrom?.channel === from) {
        this.pendingCrossfadeFrom = undefined
        if (this.current) this.promoteToDisplay(this.current)
      } else if (to === this.current) {
        this.promoteToDisplay(to)
      }
    })
    this.fading.add(from)

    to.audio.play().catch(() => {
      if (to !== this.current) return
      this.patch({ isPlaying: false })
      this.promoteToDisplay(to)
    })
    to.fadeIn()

    this.currentIndex = this.nextIndex
    this.promoteNext()
    this.hasTriggeredFade = false
    this.prepareNext()
  }

  /** Undoes a crossfade that started but is not on screen yet. */
  private revertPendingCrossfade() {
    const pending = this.pendingCrossfadeFrom
    if (!pending) return
    this.pendingCrossfadeFrom = undefined
    this.current?.destroy()
    pending.channel.cutIn()
    this.fading.delete(pending.channel)
    this.destroyFading()
    this.currentIndex = pending.index
    this.setCurrent(pending.channel)
    this.clearNext()
    this.hasTriggeredFade = false
    this.syncQueuePosition()
    this.prepareNext()
  }

  private restartInPlace(channel: Channel) {
    channel.audio.currentTime = 0
    channel.cutIn()
    this.hasTriggeredFade = false
    this.pendingCrossfadeFrom = undefined
    this.syncToChannel(channel)
  }

  /** Repeat-one locks Next and Previous to the current song. */
  private restartIfRepeatOne() {
    if (this.repeatMode !== "one") return false
    if (this.current) this.restartInPlace(this.current)
    return true
  }

  async resume() {
    const channel = this.current
    if (!channel) {
      await this.jumpTo(this.currentIndex, true)
      return
    }
    await channel.audio.play()
    channel.cutIn()
    this.hasTriggeredFade = false
    this.patch({ isPlaying: true })
  }

  pause() {
    this.current?.audio.pause()
    this.fading.forEach((channel) => channel.audio.pause())
    this.patch({ isPlaying: false })
  }

  async skipToNext() {
    if (this.restartIfRepeatOne()) return
    const index = this.adjacentIndex(this.currentIndex, 1)
    if (index !== undefined) {
      await this.jumpTo(index)
      return
    }
    if (!this.pendingCrossfadeFrom && this.current) this.endQueue()
  }

  /** Restarts a song that has played a while, otherwise goes back one. */
  async skipToPrevious() {
    if (this.restartIfRepeatOne()) return
    const channel = this.current
    if (
      channel &&
      this.state.isPlaying &&
      channel.audio.currentTime > RESTART_THRESHOLD_SECONDS
    ) {
      this.restartInPlace(channel)
      return
    }
    const index = this.adjacentIndex(this.currentIndex, -1)
    if (index !== undefined) {
      await this.jumpTo(index)
      return
    }
    if (!this.pendingCrossfadeFrom && channel) this.endQueue()
  }

  async jumpTo(index: number, forceResume = false) {
    if (
      (index === this.currentIndex && this.current) ||
      index < 0 ||
      index >= this.urls.length
    ) {
      return
    }
    const shouldPlay = forceResume || this.state.isPlaying
    this.pendingCrossfadeFrom = undefined

    if (index === this.nextIndex && this.next) {
      this.current?.destroy()
      this.promoteNext()
    } else {
      this.current?.destroy()
      this.clearNext()
      this.setCurrent(this.createChannel(index))
    }

    this.display = this.current
    this.syncToChannel(this.current)
    this.currentIndex = index
    this.hasTriggeredFade = false
    if (this.isShuffled && this.playOrder.length === 0) {
      this.buildPlayOrder([index])
    }
    this.syncQueuePosition()
    this.prepareNext()
    this.onAdvance(this.currentIndex)
    if (shouldPlay) await this.resume()
  }

  async seek(time: number, index?: number) {
    if (
      index !== undefined &&
      index !== this.currentIndex &&
      index !== this.pendingCrossfadeFrom?.index
    ) {
      return
    }
    this.revertPendingCrossfade()
    if (index !== undefined && index !== this.currentIndex) return

    const channel = this.current
    if (!channel) return

    const { duration } = channel.audio
    const nextIndex = this.autoAdvanceIndex(this.currentIndex)
    // Seeking into the crossfade window would fade out mid-scrub, so move on.
    if (
      Number.isFinite(duration) &&
      duration > CROSSFADE_SECONDS &&
      time >= duration - CROSSFADE_SECONDS &&
      nextIndex !== undefined
    ) {
      if (nextIndex === this.currentIndex) this.restartInPlace(channel)
      else await this.skipToNext()
      return
    }

    channel.audio.currentTime = time
    channel.cutIn()
    this.hasTriggeredFade = false
    if (channel === this.display) this.patch({ currentTime: time })
  }

  setShuffle(enabled: boolean) {
    if (enabled === this.isShuffled) return
    this.isShuffled = enabled
    const shown = this.displayedIndex()
    if (enabled) {
      this.buildPlayOrder(
        this.currentIndex === shown ? [shown] : [shown, this.currentIndex]
      )
    }
    this.syncQueuePosition(shown)
    this.prepareNext()
  }

  private buildPlayOrder(pinned: number[]) {
    const rest = this.urls
      .map((_, index) => index)
      .filter((index) => !pinned.includes(index))
    this.playOrder = [...pinned, ...shuffle(rest)]
  }

  setRepeatMode(mode: RepeatMode) {
    if (mode === this.repeatMode) return
    this.repeatMode = mode
    this.prepareNext()
  }

  setVolume(volume: number) {
    this.volumeGain.gain.setTargetAtTime(
      Math.min(1, Math.max(0, volume)),
      this.context.currentTime,
      0.01
    )
  }

  destroy() {
    this.destroyActive()
    this.destroyFading()
    this.volumeGain.disconnect()
  }
}
