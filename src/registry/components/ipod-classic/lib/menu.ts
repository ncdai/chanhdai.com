import { songsFromIds } from "./catalog"
import { SELECT_HOLD_BRICK_MS } from "./constants"
import type { IpodCatalog, IpodSettings, IpodSong } from "./types"

export type ScreenKey =
  | "main"
  | "settings"
  | "about"
  | "reset-settings"
  | "playlists"
  | "artists"
  | "songs"
  | "playlist-tracks"
  | "artist-tracks"
  | "now-playing"
  | "brick"

export type ToggleKey = "shuffle" | "repeat" | "clicker"

export type MenuItem = { id: string; title: string } & (
  | {
      action: "navigate"
      target: ScreenKey
      contextId?: string
      screenTitle?: string
    }
  | { action: "inline-toggle"; toggleKey: ToggleKey; values: string[] }
  | { action: "cancel" }
  | { action: "reset-all" }
  | { action: "play"; songId: string }
  | { action: "info"; value?: string; centered?: boolean }
)

export type Screen = {
  key: ScreenKey
  contextId?: string
  /** Overrides the screen's own title, e.g. Artists > All shows "All Songs". */
  title?: string
}

/** What every list is built from, apart from the screen itself. */
export type MenuContext = {
  catalog: IpodCatalog
  hasNowPlaying: boolean
}

type ItemsContext = MenuContext & { contextId?: string }

type ScreenDefinition = {
  view: "list" | "now-playing" | "brick"
  title: string | ((catalog: IpodCatalog, contextId?: string) => string)
  items?: (context: ItemsContext) => MenuItem[]
  /** Main menu gains a Now Playing row while something is queued. */
  listsNowPlaying?: boolean
  /** Holding Select this long opens `target`. */
  selectHold?: { ms: number; target: ScreenKey }
  /** Reopening starts from the top instead of the last row. */
  forgetsSelection?: boolean
  /** Playing music does not jump here to Now Playing when idle. */
  blocksIdleJump?: boolean
}

const VALUE_LABELS: Record<string, string> = {
  off: "Off",
  on: "On",
  songs: "Songs",
  one: "One",
  all: "All",
}

function settingValueLabel(value: string) {
  return VALUE_LABELS[value] ?? value
}

const TOGGLE_VALUES: Record<ToggleKey, string[]> = {
  shuffle: ["off", "songs"],
  repeat: ["off", "one", "all"],
  clicker: ["off", "on"],
}

const TOGGLE_TITLES: Record<ToggleKey, string> = {
  shuffle: "Shuffle",
  repeat: "Repeat",
  clicker: "Clicker",
}

const NO_MUSIC: MenuItem[] = [
  { id: "no-music", title: "No Music", action: "info", centered: true },
]

const orNoMusic = (items: MenuItem[]) => (items.length ? items : NO_MUSIC)

function navigate(key: ScreenKey): MenuItem {
  const { title } = SCREENS[key]
  return {
    id: key,
    title: typeof title === "string" ? title : key,
    action: "navigate",
    target: key,
  }
}

function inlineToggle(key: ToggleKey): MenuItem {
  return {
    id: key,
    title: TOGGLE_TITLES[key],
    action: "inline-toggle",
    toggleKey: key,
    values: TOGGLE_VALUES[key],
  }
}

const gigabytes = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "gigabyte",
  maximumFractionDigits: 1,
})
const integer = new Intl.NumberFormat("en-US")

// The original 5 GB iPod (2001), after formatting.
const CAPACITY_GB = 4.6
// Apple's "1,000 songs" math: four minutes at 160 kbps.
const SONG_SIZE_GB = 0.0048

export function songsForTarget(
  target: ScreenKey,
  contextId: string | undefined,
  catalog: IpodCatalog
): IpodSong[] {
  switch (target) {
    case "songs":
      return catalog.songs
    case "playlist-tracks":
      return songsFromIds(
        catalog.playlists.find((playlist) => playlist.id === contextId)
          ?.songIds ?? [],
        catalog
      )
    case "artist-tracks":
      return songsFromIds(
        catalog.artists.find((artist) => artist.id === contextId)?.songIds ??
          [],
        catalog
      )
    default:
      return []
  }
}

function trackItems(target: ScreenKey) {
  return ({ catalog, contextId }: ItemsContext) =>
    orNoMusic(
      songsForTarget(target, contextId, catalog).map((song) => ({
        id: song.id,
        title: song.name,
        action: "play",
        songId: song.id,
      }))
    )
}

const SCREENS: Record<ScreenKey, ScreenDefinition> = {
  main: {
    view: "list",
    title: "iPod",
    listsNowPlaying: true,
    items: ({ hasNowPlaying }) => [
      navigate("playlists"),
      navigate("artists"),
      navigate("songs"),
      navigate("settings"),
      ...(hasNowPlaying ? [navigate("now-playing")] : []),
    ],
  },
  settings: {
    view: "list",
    title: "Settings",
    items: () => [
      navigate("about"),
      inlineToggle("shuffle"),
      inlineToggle("repeat"),
      inlineToggle("clicker"),
      navigate("reset-settings"),
    ],
  },
  about: {
    view: "list",
    title: "About",
    selectHold: { ms: SELECT_HOLD_BRICK_MS, target: "brick" },
    items: ({ catalog }) => [
      // The name an iPod is given in iTunes; a new one is just "iPod".
      { id: "name", title: "ncdai iPod", action: "info", centered: true },
      {
        id: "songs-count",
        title: "Songs",
        action: "info",
        value: integer.format(catalog.songs.length),
      },
      {
        id: "capacity",
        title: "Capacity",
        action: "info",
        value: gigabytes.format(CAPACITY_GB),
      },
      {
        id: "available",
        title: "Available",
        action: "info",
        value: gigabytes.format(
          Math.max(0, CAPACITY_GB - catalog.songs.length * SONG_SIZE_GB)
        ),
      },
      { id: "version", title: "Version", action: "info", value: "1.0" },
    ],
  },
  "reset-settings": {
    view: "list",
    title: "Reset All Settings",
    forgetsSelection: true,
    items: () => [
      { id: "cancel", title: "Cancel", action: "cancel" },
      { id: "reset-all", title: "Reset", action: "reset-all" },
    ],
  },
  playlists: {
    view: "list",
    title: "Playlists",
    items: ({ catalog }) =>
      orNoMusic(
        catalog.playlists.map((playlist) => ({
          id: playlist.id,
          title: playlist.name,
          action: "navigate",
          target: "playlist-tracks",
          contextId: playlist.id,
        }))
      ),
  },
  artists: {
    view: "list",
    title: "Artists",
    items: ({ catalog }) => {
      const items: MenuItem[] = catalog.artists.map((artist) => ({
        id: artist.id,
        title: artist.name,
        action: "navigate",
        target: "artist-tracks",
        contextId: artist.id,
      }))
      if (items.length && catalog.songs.length) {
        items.unshift({
          id: "all",
          title: "All",
          action: "navigate",
          target: "songs",
          screenTitle: "All Songs",
        })
      }
      return orNoMusic(items)
    },
  },
  songs: {
    view: "list",
    title: "Songs",
    items: trackItems("songs"),
  },
  "playlist-tracks": {
    view: "list",
    title: (catalog, contextId) =>
      catalog.playlists.find((playlist) => playlist.id === contextId)?.name ??
      "Playlists",
    items: trackItems("playlist-tracks"),
  },
  "artist-tracks": {
    view: "list",
    title: (catalog, contextId) =>
      catalog.artists.find((artist) => artist.id === contextId)?.name ??
      "Artists",
    items: trackItems("artist-tracks"),
  },
  "now-playing": {
    view: "now-playing",
    title: "Now Playing",
    blocksIdleJump: true,
  },
  brick: {
    view: "brick",
    title: "Brick",
    blocksIdleJump: true,
  },
}

export function getScreen(key: ScreenKey) {
  return SCREENS[key]
}

export function screenTitle(screen: Screen, catalog: IpodCatalog) {
  if (screen.title) return screen.title
  const { title } = SCREENS[screen.key]
  return typeof title === "string" ? title : title(catalog, screen.contextId)
}

export function screenItems(screen: Screen, context: MenuContext) {
  const definition = SCREENS[screen.key]
  return (
    definition.items?.({
      ...context,
      contextId: screen.contextId,
      hasNowPlaying: context.hasNowPlaying && !!definition.listsNowPlaying,
    }) ?? []
  )
}

export function screenId({ key, contextId }: Screen) {
  return `${key}:${contextId ?? ""}`
}

export function playItems(items: MenuItem[]) {
  return items.filter(
    (item): item is Extract<MenuItem, { action: "play" }> =>
      item.action === "play"
  )
}

/**
 * Where the playing song sits in `items`, but only when the list is exactly
 * the queue, so a list follows playback only if it started it.
 */
export function nowPlayingIndexIn(
  items: MenuItem[],
  queue: IpodSong[],
  currentTrackIndex: number
) {
  const plays = playItems(items)
  const matches =
    plays.length > 0 &&
    plays.length === queue.length &&
    plays.every((item, index) => item.songId === queue[index]?.id)
  return matches ? items.indexOf(plays[currentTrackIndex]) : -1
}

export function settingValue(item: MenuItem, settings: IpodSettings) {
  if (item.action === "inline-toggle") {
    return settingValueLabel(settings[item.toggleKey])
  }
  if (item.action === "info") return item.value
}
