import { RESET } from "jotai/utils"

import { createAccelerator, tierFor } from "./acceleration"
import {
  catalogAtom,
  DEFAULT_SETTINGS,
  isAdjustingVolumeAtom,
  itemsAtom,
  menuContextAtom,
  navigationAtom,
  playbackAtom,
  screenAtom,
  scrollTargetAtom,
  settingsAtom,
  viewAtom,
  type IpodStore,
  type NavigationState,
  type PlaybackState,
  type StackEntry,
} from "./atoms"
import {
  IDLE_JUMP_MS,
  LIST_ACCELERATION,
  SEEK_ACCELERATION,
  VOLUME_KEY_STEP,
} from "./constants"
import {
  getScreen,
  nowPlayingIndexIn,
  playItems,
  screenId,
  screenItems,
  songsForTarget,
  type MenuItem,
  type Screen,
} from "./menu"
import {
  createSeekController,
  createVolumeController,
} from "./now-playing-modes"
import type { Playback } from "./playback"
import { createTimeout } from "./timers"

export type BrickHandle = {
  launchBall: () => void
  movePaddle: (fraction: number) => void
  steerPaddle: (direction: number) => void
}

const NOW_PLAYING: Screen = { key: "now-playing" }

/** Remembers each list's last row, and which list started the queue. */
function createSelectionMemory() {
  const remembered = new Map<string, { itemId: string; index: number }>()
  let queueSource: string | undefined
  let lastQueue: PlaybackState["queue"] | undefined
  let lastIndex: number | undefined

  return {
    /** While the source list is closed, its row follows the playing song. */
    syncQueue({ queue, currentTrackIndex }: PlaybackState, stack: Screen[]) {
      if (queue === lastQueue && currentTrackIndex === lastIndex) return false
      lastQueue = queue
      lastIndex = currentTrackIndex
      const song = queue[currentTrackIndex]
      if (
        queueSource &&
        song &&
        !stack.some((entry) => screenId(entry) === queueSource)
      ) {
        remembered.set(queueSource, {
          itemId: song.id,
          index: currentTrackIndex,
        })
      }
      return true
    },
    remember(screen: Screen, items: MenuItem[], index: number) {
      const item = items[index]
      if (!item || getScreen(screen.key).forgetsSelection) return
      remembered.set(screenId(screen), { itemId: item.id, index })
    },
    indexIn(screen: Screen, items: MenuItem[]) {
      const entry = remembered.get(screenId(screen))
      if (!entry) return -1
      return items[entry.index]?.id === entry.itemId
        ? entry.index
        : items.findIndex((item) => item.id === entry.itemId)
    },
    setQueueSource(screen: Screen) {
      queueSource = screenId(screen)
    },
    clearQueueSource() {
      if (!queueSource) return
      remembered.delete(queueSource)
      queueSource = undefined
    },
  }
}

export function createMenuController({
  store,
  playback,
  getMenuElement,
  getListElement,
}: {
  store: IpodStore
  playback: Playback
  getMenuElement: () => HTMLElement | null
  getListElement: () => HTMLElement | null
}) {
  const seek = createSeekController(store, playback)
  const volume = createVolumeController(store, playback)
  const memory = createSelectionMemory()
  const listAccelerator = createAccelerator(LIST_ACCELERATION)
  let brick: BrickHandle | null = null
  /** The user moved the row, so it stops following the playing song. */
  let suppressSync = false

  const navigation = () => store.get(navigationAtom)
  const patch = (partial: Partial<NavigationState>) =>
    store.set(navigationAtom, (state) => ({ ...state, ...partial }))
  const top = () => store.get(screenAtom)
  const currentItems = () => store.get(itemsAtom)
  const itemsFor = (screen: Screen) =>
    screenItems(screen, store.get(menuContextAtom))

  function nowPlayingIndex(items: MenuItem[]) {
    const { queue, currentTrackIndex } = store.get(playbackAtom)
    return nowPlayingIndexIn(items, queue, currentTrackIndex)
  }

  function isFocusElsewhere() {
    const active = document.activeElement
    return (
      !!active &&
      active !== document.body &&
      !getMenuElement()?.contains(active)
    )
  }

  function initialIndexFor(screen: Screen) {
    const items = itemsFor(screen)
    const playing = nowPlayingIndex(items)
    return playing >= 0 ? playing : Math.max(0, memory.indexIn(screen, items))
  }

  function handleScreenChange(screen: Screen) {
    const isNowPlaying = getScreen(screen.key).view === "now-playing"
    seek.handleScreenChange(isNowPlaying)
    volume.handleScreenChange(isNowPlaying)
    listAccelerator.reset()
  }

  function push(screen: Screen, isIdleJump = false) {
    const { stack, selectedIndex, navigationId } = navigation()
    const current = top()
    const items = currentItems()
    memory.remember(current, items, selectedIndex)
    const annotated: StackEntry = {
      ...current,
      selectedItemId: items[selectedIndex]?.id,
      selectedIndexAtPush: selectedIndex,
      scrollTopAtPush: getListElement()?.scrollTop,
      suppressSyncAtPush: isIdleJump && suppressSync,
    }
    store.set(navigationAtom, {
      stack: [...stack.slice(0, -1), annotated, screen],
      selectedIndex: initialIndexFor(screen),
      navigationId: navigationId + 1,
      back: false,
      shouldFocus: isIdleJump
        ? !!getMenuElement()?.contains(document.activeElement)
        : !isFocusElsewhere(),
      restoredScrollTop: undefined,
    })
    suppressSync = false
    handleScreenChange(screen)
  }

  function pop() {
    const { stack, selectedIndex, navigationId } = navigation()
    if (stack.length <= 1) return
    memory.remember(top(), currentItems(), selectedIndex)
    const previous = stack.at(-2)!
    suppressSync = previous.suppressSyncAtPush ?? false

    const items = itemsFor(previous)
    const playing = nowPlayingIndex(items)
    const nextIndex =
      playing >= 0 && !suppressSync
        ? playing
        : Math.max(0, memory.indexIn(previous, items))

    store.set(navigationAtom, {
      stack: stack.slice(0, -1),
      selectedIndex: nextIndex,
      navigationId: navigationId + 1,
      back: true,
      shouldFocus: !isFocusElsewhere(),
      restoredScrollTop:
        nextIndex === previous.selectedIndexAtPush
          ? previous.scrollTopAtPush
          : undefined,
    })
    handleScreenChange(previous)
  }

  function moveBy(delta: number) {
    const items = currentItems()
    if (items.length === 0) return false
    const { selectedIndex } = navigation()
    const next = Math.min(items.length - 1, Math.max(0, selectedIndex + delta))
    if (next === selectedIndex) return false
    patch({ selectedIndex: next })
    suppressSync = true
    return true
  }

  function move(direction: number, count = 1) {
    switch (store.get(scrollTargetAtom)) {
      case "seek":
        return seek.seekBy(direction * count)
      case "volume":
        return volume.change(direction * count)
      case "list":
        return moveBy(direction * count)
      default:
        return false
    }
  }

  function accelerate(speed: number, direction: number) {
    const target = store.get(scrollTargetAtom)
    const seekMultiplier = seek.accelerate(speed, direction)
    const listMultiplier = listAccelerator.next(
      speed,
      direction,
      target === "list"
    )
    return target === "seek" ? seekMultiplier : listMultiplier
  }

  /** A held arrow key climbs the same tiers as a fast spin. */
  function keyStep(direction: number, heldMs: number) {
    switch (store.get(scrollTargetAtom)) {
      case "seek":
        return move(direction, tierFor(SEEK_ACCELERATION, heldMs))
      case "volume":
        return move(direction, VOLUME_KEY_STEP)
      default:
        return move(direction, tierFor(LIST_ACCELERATION, heldMs))
    }
  }

  function playFromItem(item: MenuItem | undefined) {
    if (item?.action !== "navigate") return false
    const songs = songsForTarget(
      item.target,
      item.contextId,
      store.get(catalogAtom)
    )
    if (songs.length === 0) return false
    memory.setQueueSource({ key: item.target, contextId: item.contextId })
    playback.play(songs)
    push(NOW_PLAYING)
    return true
  }

  function playItem(item: Extract<MenuItem, { action: "play" }>) {
    const items = currentItems()
    const { selectedIndex } = navigation()
    if (nowPlayingIndex(items) === selectedIndex) {
      if (!store.get(playbackAtom).isPlaying) playback.resume()
    } else {
      const { songsById } = store.get(catalogAtom)
      const plays = playItems(items)
      memory.setQueueSource(top())
      playback.play(
        plays
          .map((play) => songsById.get(play.songId))
          .filter((song) => song !== undefined),
        plays.indexOf(item)
      )
    }
    push(NOW_PLAYING)
  }

  function select() {
    const view = store.get(viewAtom)
    if (view === "brick") {
      brick?.launchBall()
      return
    }
    if (view === "now-playing") {
      if (store.get(isAdjustingVolumeAtom)) {
        volume.exit()
      } else if (store.get(playbackAtom).hasLoadedItem) {
        seek.toggle()
      }
      return
    }

    const item = currentItems()[navigation().selectedIndex]
    switch (item?.action) {
      case "navigate":
        push({
          key: item.target,
          contextId: item.contextId,
          title: item.screenTitle,
        })
        break
      case "inline-toggle":
        store.set(settingsAtom, (settings) => {
          const { values, toggleKey } = item
          const index = values.indexOf(settings[toggleKey])
          return {
            ...settings,
            [toggleKey]: values[(index + 1) % values.length],
          }
        })
        break
      case "cancel":
        pop()
        break
      case "reset-all":
        store.set(settingsAtom, RESET)
        playback.setVolume(DEFAULT_SETTINGS.volume / 100)
        pop()
        break
      case "play":
        playItem(item)
        break
    }
  }

  function playPause() {
    const state = store.get(playbackAtom)
    if (state.hasLoadedItem) {
      if (state.isPlaying) playback.pause()
      else playback.resume()
      return
    }
    if (state.isLoading) {
      playback.pause()
      return
    }
    const item = currentItems()[navigation().selectedIndex]
    if (playFromItem(item)) return
    if (item?.action === "play") playItem(item)
    else if (state.queue.length > 0) playback.resume()
  }

  function selectHold() {
    const hold = getScreen(top().key).selectHold
    if (hold) push({ key: hold.target })
  }

  const idleJump = createTimeout(IDLE_JUMP_MS, () => push(NOW_PLAYING, true))
  let isIdleJumpArmed = false

  function syncIdleJump() {
    const armed =
      store.get(playbackAtom).isPlaying && !getScreen(top().key).blocksIdleJump
    if (armed === isIdleJumpArmed) return
    isIdleJumpArmed = armed
    if (armed) idleJump.start()
    else idleJump.stop()
  }

  /** Keeps the row on the playing song and inside the list. */
  function sync() {
    const items = currentItems()
    const { selectedIndex, stack } = navigation()
    if (selectedIndex >= items.length) {
      patch({ selectedIndex: Math.max(0, items.length - 1) })
    }
    if (memory.syncQueue(store.get(playbackAtom), stack)) {
      const playing = nowPlayingIndex(items)
      if (playing >= 0 && !suppressSync) patch({ selectedIndex: playing })
    }
    syncIdleJump()
  }

  const unsubscribers = [
    store.sub(playbackAtom, sync),
    store.sub(itemsAtom, sync),
    store.sub(screenAtom, syncIdleJump),
    playback.onQueueFinished(() => {
      memory.clearQueueSource()
      if (store.get(viewAtom) !== "now-playing") return
      pop()
      // The Now Playing row it came from no longer exists.
      if (top().selectedItemId === NOW_PLAYING.key) {
        patch({ selectedIndex: 0, restoredScrollTop: undefined })
      }
    }),
  ]

  return {
    seek,
    volume,
    back: pop,
    select,
    selectHold,
    playPause,
    accelerate,
    move,
    keyStep,
    /** Any input restarts the countdown to Now Playing. */
    notifyActivity() {
      if (isIdleJumpArmed) idleJump.start()
    },
    registerBrick(handle: BrickHandle | null) {
      brick = handle
    },
    turnPaddle(degrees: number) {
      brick?.movePaddle(degrees / 360)
    },
    steerPaddle(direction: number) {
      brick?.steerPaddle(direction)
    },
    destroy() {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
      idleJump.stop()
      seek.destroy()
      volume.destroy()
    },
  }
}
