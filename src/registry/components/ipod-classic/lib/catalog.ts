import type { IpodArtist, IpodCatalog, IpodLibrary, IpodSong } from "./types"

const collator = new Intl.Collator("en", {
  sensitivity: "base",
  ignorePunctuation: true,
  numeric: true,
})

const byName = (a: { name: string }, b: { name: string }) =>
  collator.compare(a.name, b.name)

export function createCatalog(library: IpodLibrary): IpodCatalog {
  const songs = [...library.songs].sort(byName)
  const songsById = new Map(songs.map((song) => [song.id, song]))

  const artistsByName = new Map<string, IpodArtist>()
  for (const song of songs) {
    const artist = artistsByName.get(song.artistName)
    if (artist) {
      artist.songIds.push(song.id)
    } else {
      artistsByName.set(song.artistName, {
        id: `artist:${song.artistName}`,
        name: song.artistName,
        songIds: [song.id],
      })
    }
  }

  return {
    songs,
    artists: [...artistsByName.values()].sort(byName),
    playlists: library.playlists,
    songsById,
  }
}

export function songsFromIds(ids: string[], catalog: IpodCatalog) {
  return ids
    .map((id) => catalog.songsById.get(id))
    .filter((song): song is IpodSong => !!song)
}
