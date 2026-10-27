import {
  IpodClassic,
  type IpodLibrary,
} from "@/registry/components/ipod-classic"

// Song metadata and previews from the iTunes Lookup API, streamed only.
const library: IpodLibrary = {
  songs: [
    {
      id: "1396678789",
      name: "Take California",
      artistName: "Propellerheads",
      albumName: "Decksandrumsandrockandroll 20th Anniversary",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3f/11/ac/3f11ac5b-69ca-bbb8-18be-ddd0e3a2e8b7/mzaf_10860549742340277721.plus.aac.p.m4a",
      url: "https://music.apple.com/us/album/take-california/1396678787?i=1396678789",
    },
    {
      id: "1308567740",
      name: "Shut Up and Let Me Go",
      artistName: "The Ting Tings",
      albumName: "We Started Nothing",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/69/61/ca/6961cad7-f5ee-29ee-c8e6-664ec7b48502/mzaf_5353190306364204304.plus.aac.p.m4a",
      url: "https://music.apple.com/us/album/shut-up-and-let-me-go/1308567129?i=1308567740",
    },
    {
      id: "693620735",
      name: "Feel Good Inc",
      artistName: "Gorillaz",
      albumName: "Feel Good Inc - EP",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ca/f9/87/caf9879f-a8f3-6d0a-1016-2e7dbf7dec98/mzaf_13876270285889477958.plus.aac.p.m4a",
      url: "https://music.apple.com/us/album/feel-good-inc/693620734?i=693620735",
    },
    {
      id: "693751201",
      name: "Technologic",
      artistName: "Daft Punk",
      albumName: "Human After All",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d9/d7/72/d9d7726c-edc5-687a-2429-6dffa4a38496/mzaf_17942222817121564427.plus.aac.p.m4a",
      url: "https://music.apple.com/us/album/technologic/693748807?i=693751201",
    },
  ],
  playlists: [
    {
      id: "ipod-ads",
      name: "Songs From iPod Ads",
      songIds: ["1396678789", "1308567740", "693620735", "693751201"],
    },
  ],
}

export default function IpodClassicDemo() {
  return <IpodClassic library={library} className="w-full max-w-sm" />
}
