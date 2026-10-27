import { atom, type createStore } from "jotai"
import { atomWithStorage, createJSONStorage } from "jotai/utils"

import { INITIAL_BRICK_STATUS, type BrickStatus } from "./brick-engine"
import { createCatalog } from "./catalog"
import type { IpodEngine } from "./engine"
import {
  getScreen,
  screenItems,
  screenTitle,
  type MenuContext,
  type Screen,
} from "./menu"
import type { IpodCatalog, IpodSettings, IpodSong, ScrollTarget } from "./types"

/** Each iPod owns a store, so two on a page never share a screen. */
export type IpodStore = ReturnType<typeof createStore>

export const DEFAULT_SETTINGS: IpodSettings = {
  shuffle: "off",
  repeat: "off",
  clicker: "on",
  volume: 50,
}

const SETTING_VALUES = {
  shuffle: ["off", "songs"],
  repeat: ["off", "one", "all"],
  clicker: ["off", "on"],
} as const

/** Falls back per field, so one bad value does not wipe the rest. */
function parseSettings(raw: unknown): IpodSettings {
  const value = (raw ?? {}) as Record<string, unknown>
  const pick = <T extends string>(values: readonly T[], input: unknown) =>
    values.includes(input as T) ? (input as T) : undefined
  const volume = value.volume
  return {
    shuffle:
      pick(SETTING_VALUES.shuffle, value.shuffle) ?? DEFAULT_SETTINGS.shuffle,
    repeat:
      pick(SETTING_VALUES.repeat, value.repeat) ?? DEFAULT_SETTINGS.repeat,
    clicker:
      pick(SETTING_VALUES.clicker, value.clicker) ?? DEFAULT_SETTINGS.clicker,
    volume:
      typeof volume === "number" && volume >= 0 && volume <= 100
        ? volume
        : DEFAULT_SETTINGS.volume,
  }
}

const settingsStorage = createJSONStorage<IpodSettings>(() => localStorage)

export const settingsAtom = atomWithStorage(
  "ipod-classic:settings",
  DEFAULT_SETTINGS,
  {
    ...settingsStorage,
    getItem: (key, initialValue) =>
      parseSettings(settingsStorage.getItem(key, initialValue)),
  }
)

export const catalogAtom = atom<IpodCatalog>(
  createCatalog({ songs: [], playlists: [] })
)

export const statusAtom = atom({ isBooting: true, isOnline: true })

/** Booting or offline: the screen shows an overlay and input is ignored. */
export const isInertAtom = atom((get) => {
  const { isBooting, isOnline } = get(statusAtom)
  return isBooting || !isOnline
})

export type PlaybackState = {
  isPlaying: boolean
  currentTime: number
  duration: number
  /** Index into `queue`, which keeps list order even when shuffled. */
  currentTrackIndex: number
  /** Position in play order, which differs from the queue when shuffled. */
  queuePosition: number
  queue: IpodSong[]
  hasLoadedItem: boolean
  isLoading: boolean
  /** 0 to 1. */
  volume: number
}

export const playbackAtom = atom<PlaybackState>({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  currentTrackIndex: 0,
  queuePosition: 0,
  queue: [],
  hasLoadedItem: false,
  isLoading: false,
  volume: DEFAULT_SETTINGS.volume / 100,
})

export const hasQueueAtom = atom((get) => get(playbackAtom).queue.length > 0)

export type StackEntry = Screen & {
  selectedItemId?: string
  selectedIndexAtPush?: number
  scrollTopAtPush?: number
  /** An idle jump was not the user's choice, so going back keeps their row. */
  suppressSyncAtPush?: boolean
}

export type NavigationState = {
  stack: StackEntry[]
  selectedIndex: number
  /** Changes on every push and pop, keying the sliding screen. */
  navigationId: number
  back: boolean
  shouldFocus: boolean
  restoredScrollTop: number | undefined
}

export const navigationAtom = atom<NavigationState>({
  stack: [{ key: "main" }],
  selectedIndex: 0,
  navigationId: 0,
  back: false,
  shouldFocus: false,
  restoredScrollTop: undefined,
})

export const screenAtom = atom((get) => get(navigationAtom).stack.at(-1)!)

export const viewAtom = atom((get) => getScreen(get(screenAtom).key).view)

export const titleAtom = atom((get) =>
  screenTitle(get(screenAtom), get(catalogAtom))
)

export const menuContextAtom = atom<MenuContext>((get) => ({
  catalog: get(catalogAtom),
  hasNowPlaying: get(hasQueueAtom),
}))

export const itemsAtom = atom((get) =>
  screenItems(get(screenAtom), get(menuContextAtom))
)

/** How long Select must be held on this screen, if holding does anything. */
export const selectHoldMsAtom = atom(
  (get) => getScreen(get(screenAtom).key).selectHold?.ms ?? null
)

export const seekAtom = atom<{ isSeeking: boolean; previewTime?: number }>({
  isSeeking: false,
})

export const isAdjustingVolumeAtom = atom(false)

/** What turning the wheel changes right now. */
export const scrollTargetAtom = atom<ScrollTarget>((get) => {
  if (get(seekAtom).isSeeking) return "seek"
  const view = get(viewAtom)
  return view === "now-playing" ? "volume" : view
})

export const brickStatusAtom = atom<BrickStatus>(INITIAL_BRICK_STATUS)

/** Set once the client has an AudioContext; null on the server. */
export const engineAtom = atom<IpodEngine | null>(null)
