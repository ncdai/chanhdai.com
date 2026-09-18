const AVATAR_URL_PATTERN =
  /https:\/\/assets\.chanhdai\.com\/avatars\/x\/(\w+)\.webp/g

const PROFILE_IMAGE_PREFIX = "https://pbs.twimg.com/profile_images/"

export function extractXAvatarUsernames(source: string): string[] {
  return Array.from(source.matchAll(AVATAR_URL_PATTERN), (match) => match[1])
}

export function selectXAvatarUsernames(
  referenced: string[],
  requested: string[]
): string[] {
  if (requested.length === 0) return referenced

  const selected = requested.map((name) => name.replace(/^@/, "").toLowerCase())

  const unknown = selected.filter((name) => !referenced.includes(name))
  if (unknown.length > 0) {
    throw new Error(
      `No avatar URL in src/ uses these usernames: ${unknown.join(", ")}`
    )
  }

  return [...new Set(selected)]
}

export function getXAvatarKey(username: string) {
  return `avatars/x/${username}.webp`
}

// Missing profiles still get X's placeholder as og:image, so only
// profile_images URLs pass. The 400x400 variant is fetched because downscaling
// it looks sharper than re-encoding the 200x200 JPEG.
export function toProfileImageUrl(ogImage: string | null): string | null {
  if (!ogImage?.startsWith(PROFILE_IMAGE_PREFIX)) return null

  return ogImage.replace(
    /_(?:normal|bigger|mini|200x200|400x400)(?=\.\w+$)/,
    "_400x400"
  )
}
