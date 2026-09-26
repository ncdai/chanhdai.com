const ASSETS_URL = "https://assets.chanhdai.com"

// The craft feed tops out around 750px wide, so 2x that is plenty.
export const MEDIA_MAX_WIDTH = 1600

const X_POST_URL_PATTERN =
  /^https:\/\/(?:www\.)?(?:x|twitter)\.com\/\w+\/status\/(\d+)/

export function parseXPostId(input: string): string | null {
  if (/^\d+$/.test(input)) return input
  return input.match(X_POST_URL_PATTERN)?.[1] ?? null
}

export function getCraftMediaKeys(postId: string) {
  return {
    // The original from X, kept for re-encoding later.
    source: `videos/craft/${postId}.mp4`,
    video: `videos/craft/${postId}-${MEDIA_MAX_WIDTH}w.mp4`,
    poster: `images/craft/${postId}.webp`,
  }
}

// Every MP4 starts with an `ftyp` box right after its 4-byte size.
export function isMp4(bytes: Uint8Array) {
  return new TextDecoder().decode(bytes.subarray(4, 8)) === "ftyp"
}

export function formatCraftMediaSnippet({
  postId,
  width,
  height,
}: {
  postId: string
  width: number
  height: number
}) {
  const keys = getCraftMediaKeys(postId)

  return `media: {
  type: "video",
  src: "${ASSETS_URL}/${keys.video}",
  poster: "${ASSETS_URL}/${keys.poster}",
  width: ${width},
  height: ${height},
},`
}
