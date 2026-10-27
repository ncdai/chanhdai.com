import { playbackAtom, type IpodStore, type PlaybackState } from "./atoms"
import { CrossfadePlayer } from "./player"
import type { IpodSong, RepeatMode } from "./types"

export type Playback = ReturnType<typeof createPlayback>

/** Owns the queue and one CrossfadePlayer for it, mirrored into `playbackAtom`. */
export function createPlayback(store: IpodStore, context: AudioContext) {
  let player: CrossfadePlayer | undefined
  let startAbort: AbortController | undefined
  let shuffle = false
  let repeatMode: RepeatMode = "none"
  const queueFinishedListeners = new Set<() => void>()

  const get = () => store.get(playbackAtom)
  const patch = (partial: Partial<PlaybackState>) =>
    store.set(playbackAtom, (state) => ({ ...state, ...partial }))

  // Controls run one after another so a skip never races a pending start.
  let chain = Promise.resolve()
  function enqueue(task: () => Promise<void> | void) {
    chain = chain.then(async () => {
      try {
        await task()
      } catch {
        // A failed control (e.g. blocked autoplay) leaves the state as is.
      }
    })
    return chain
  }

  function destroyPlayer() {
    const previous = player
    player = undefined
    previous?.destroy()
  }

  function clearQueue() {
    startAbort?.abort()
    patch({
      queue: [],
      currentTrackIndex: 0,
      queuePosition: 0,
      hasLoadedItem: false,
      isPlaying: false,
      isLoading: false,
    })
    return enqueue(destroyPlayer)
  }

  function start(queue: IpodSong[], index: number) {
    startAbort?.abort()
    const abort = new AbortController()
    startAbort = abort
    patch({
      queue,
      currentTrackIndex: index,
      // Shuffle pins the chosen song first.
      queuePosition: shuffle ? 0 : index,
      isLoading: true,
    })

    return enqueue(async () => {
      if (abort.signal.aborted) return
      try {
        destroyPlayer()
        let hadItem = false
        const next: CrossfadePlayer = new CrossfadePlayer({
          urls: queue.map((song) => song.previewUrl),
          context,
          shuffle,
          repeatMode,
          onAdvance(trackIndex) {
            if (trackIndex < get().queue.length) {
              patch({ currentTrackIndex: trackIndex })
            }
          },
          onChange(state) {
            // A replaced player still reports while it tears down.
            if (player !== next) return
            patch(state)
            if (state.hasLoadedItem === undefined) return
            const didFinish = hadItem && !state.hasLoadedItem
            hadItem = state.hasLoadedItem
            if (didFinish && get().queue.length > 0) {
              clearQueue()
              queueFinishedListeners.forEach((listener) => listener())
            }
          },
        })
        player = next
        next.setVolume(get().volume)
        await next.jumpTo(index, true)
      } finally {
        if (!abort.signal.aborted) patch({ isLoading: false })
      }
    })
  }

  return {
    play(queue: IpodSong[], index?: number) {
      if (queue.length === 0) return Promise.resolve()
      const startIndex =
        index ?? (shuffle ? Math.floor(Math.random() * queue.length) : 0)
      return start(queue, startIndex)
    },
    pause: () => enqueue(() => player?.pause()),
    resume: () => enqueue(() => player?.resume()),
    skipNext: () => enqueue(() => player?.skipToNext()),
    skipPrevious: () => enqueue(() => player?.skipToPrevious()),
    seek(time: number) {
      const index = get().currentTrackIndex
      return enqueue(() => player?.seek(time, index))
    },
    setVolume(volume: number) {
      patch({ volume })
      player?.setVolume(volume)
    },
    setShuffle(enabled: boolean) {
      shuffle = enabled
      return enqueue(() => player?.setShuffle(enabled))
    },
    setRepeatMode(mode: RepeatMode) {
      repeatMode = mode
      return enqueue(() => player?.setRepeatMode(mode))
    },
    onQueueFinished(listener: () => void) {
      queueFinishedListeners.add(listener)
      return () => {
        queueFinishedListeners.delete(listener)
      }
    },
    destroy() {
      startAbort?.abort()
      destroyPlayer()
    },
  }
}
