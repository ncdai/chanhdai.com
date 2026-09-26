// Media is re-hosted on R2 with `pnpm craft:upload`. Third-party CDNs such as
// video.twimg.com refuse to serve other sites.
type AssetUrl = `https://assets.chanhdai.com/${string}`

export type CraftImage = {
  src: AssetUrl
  alt: string
  /** Intrinsic size, used to reserve the box before the file loads. */
  width: number
  height: number
}

export type CraftMedia =
  | ({ type: "image" } & CraftImage)
  | {
      type: "video"
      src: AssetUrl
      /** Shown until the first frame loads, and whenever autoplay is blocked. */
      poster?: AssetUrl
      /** Intrinsic size, used to reserve the box before the file loads. */
      width: number
      height: number
    }
  | {
      type: "gallery"
      images: CraftImage[]
    }

export type Craft = {
  /** One sentence shown under the media, enough to understand the work. */
  description: string
  media: CraftMedia
  /** ISO date (e.g., "2026-09-24"). */
  createdAt: string
  /** The component or block page, once it has shipped. */
  registryHref?: `/components/${string}` | `/blocks/${string}`
  /** The post where it was shared, so readers can see its replies and reposts. */
  xPostUrl?: `https://x.com/${string}`
}
