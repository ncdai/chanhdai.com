export type IpodSong = {
  id: string
  name: string
  /** Groups songs in Artists. */
  artistName: string
  albumName?: string
  /** Audio file to play. Must be served with CORS headers. */
  previewUrl: string
  /** Opened when the song title on Now Playing is clicked. */
  url?: string
}

export type IpodPlaylist = {
  id: string
  name: string
  /** In playback order. */
  songIds: string[]
}

export type IpodLibrary = {
  /**
   * Every song. Songs and Artists list them by name.
   * @fumadocsHref #ipodsong
   */
  songs: IpodSong[]
  /**
   * Shown in Playlists, in this order.
   * @fumadocsHref #ipodplaylist
   */
  playlists: IpodPlaylist[]
}

export type IpodArtist = {
  id: string
  name: string
  songIds: string[]
}

/** The library as the menus read it: songs and artists sorted by name. */
export type IpodCatalog = {
  songs: IpodSong[]
  artists: IpodArtist[]
  playlists: IpodPlaylist[]
  songsById: Map<string, IpodSong>
}

export type RepeatMode = "none" | "one" | "all"

type ShuffleSetting = "off" | "songs"
type RepeatSetting = "off" | "one" | "all"
type ClickerSetting = "off" | "on"
export type IpodSettings = {
  shuffle: ShuffleSetting
  repeat: RepeatSetting
  clicker: ClickerSetting
  volume: number
}

export type ScrollTarget = "list" | "seek" | "volume" | "brick"
