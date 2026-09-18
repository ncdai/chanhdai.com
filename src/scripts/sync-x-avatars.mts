import { parseArgs } from "node:util"
import sharp from "sharp"

import { getR2ClientFromEnv } from "./lib/r2.mts"
import {
  extractXAvatarUsernames,
  getXAvatarKey,
  selectXAvatarUsernames,
  toProfileImageUrl,
} from "./lib/x-avatar.ts"

const SOURCE_GLOB = "src/**/*.{ts,tsx,mdx}"
const AVATAR_SIZE = 200

// x.com only server-renders profile metadata for known link-preview crawlers.
const CRAWLER_USER_AGENT = "Twitterbot/1.0"

async function findUsernames() {
  const usernames = new Set<string>()

  for await (const file of new Bun.Glob(SOURCE_GLOB).scan()) {
    // Test fixtures are sample data, not avatars the site uses.
    if (file.endsWith(".test.ts")) continue

    const source = await Bun.file(file).text()
    for (const username of extractXAvatarUsernames(source)) {
      usernames.add(username)
    }
  }

  return [...usernames].sort()
}

async function resolveProfileImageUrl(username: string) {
  const response = await fetch(`https://x.com/${username}`, {
    headers: { "user-agent": CRAWLER_USER_AGENT },
  })

  if (response.status === 404) {
    throw new Error("profile not found, the handle may have changed")
  }

  if (!response.ok) {
    throw new Error(`x.com responded with ${response.status}`)
  }

  let ogImage: string | null = null

  await new HTMLRewriter()
    .on('meta[property="og:image"]', {
      element(element) {
        ogImage ??= element.getAttribute("content")
      },
    })
    .transform(response)
    .arrayBuffer()

  const imageUrl = toProfileImageUrl(ogImage)

  if (!imageUrl) {
    throw new Error("no profile image in the page, x.com may be blocking")
  }

  return imageUrl
}

async function downloadAvatar(imageUrl: string) {
  const response = await fetch(imageUrl)

  if (!response.ok) {
    throw new Error(`${imageUrl} responded with ${response.status}`)
  }

  return sharp(await response.arrayBuffer())
    .resize(AVATAR_SIZE, AVATAR_SIZE)
    .webp()
    .toBuffer()
}

async function main() {
  const referenced = await findUsernames()

  // R2 keys are case-sensitive while X handles are not.
  const notLowercase = referenced.filter((name) => name !== name.toLowerCase())
  if (notLowercase.length > 0) {
    throw new Error(
      `Avatar URLs must use lowercase usernames: ${notLowercase.join(", ")}`
    )
  }

  if (referenced.length === 0) {
    console.log("No X avatar URLs found.")
    return
  }

  const { positionals } = parseArgs({ allowPositionals: true })
  const usernames = selectXAvatarUsernames(referenced, positionals)

  const client = getR2ClientFromEnv()
  let failedCount = 0

  for (const username of usernames) {
    const key = getXAvatarKey(username)

    try {
      const imageUrl = await resolveProfileImageUrl(username)
      const avatar = await downloadAvatar(imageUrl)
      await client.write(key, avatar, { type: "image/webp" })
      console.log(`Uploaded: ${key}`)
    } catch (error) {
      failedCount++
      const reason = error instanceof Error ? error.message : String(error)
      console.error(`Failed: ${username} (${reason})`)
    }
  }

  console.log(
    `Synced ${usernames.length - failedCount}/${usernames.length} X avatar(s) to R2.`
  )

  if (failedCount > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Error syncing X avatars:", error)
  process.exit(1)
})
