import { mkdtemp, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer"
import sharp from "sharp"

import {
  formatCraftMediaSnippet,
  getCraftMediaKeys,
  isMp4,
  MEDIA_MAX_WIDTH,
  parseXPostId,
} from "./lib/craft-media.ts"
import { getR2ClientFromEnv } from "./lib/r2.mts"

const USAGE =
  "Usage: pnpm craft:upload <x-post-url-or-id> <video-url-or-file> [--force] [--poster-time <seconds>]"

async function readVideo(source: string) {
  if (!/^https?:\/\//.test(source)) {
    return new Uint8Array(await Bun.file(source).arrayBuffer())
  }

  // fetch sends no Referer, which is what lets video.twimg.com serve it.
  const response = await fetch(source)

  if (!response.ok) {
    throw new Error(`${source} responded with ${response.status}`)
  }

  return new Uint8Array(await response.arrayBuffer())
}

async function encodeVideo(source: Uint8Array) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "craft-encode-"))

  try {
    const input = path.join(dir, "source.mp4")
    const output = path.join(dir, "video.mp4")
    await writeFile(input, source)

    const ffmpeg = Bun.spawn(
      [
        "ffmpeg",
        "-v",
        "error",
        "-i",
        input,
        // The even-height rounding makes scale set a non-square pixel ratio.
        "-vf",
        `scale='min(${MEDIA_MAX_WIDTH},iw)':-2,setsar=1`,
        // X exports a variable frame rate. The default would duplicate frames
        // up to 120fps.
        "-fps_mode",
        "passthrough",
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "26",
        "-pix_fmt",
        "yuv420p",
        // Craft videos always play muted.
        "-an",
        "-movflags",
        "+faststart",
        output,
      ],
      { stderr: "inherit" }
    )

    const exitCode = await ffmpeg.exited

    if (exitCode !== 0) {
      throw new Error(`ffmpeg exited with code ${exitCode}`)
    }

    return new Uint8Array(await Bun.file(output).arrayBuffer())
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

async function capturePoster(video: Uint8Array, time: number) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "craft-upload-"))
  const browser = await puppeteer.launch()

  try {
    await writeFile(path.join(dir, "video.mp4"), video)
    await writeFile(
      path.join(dir, "index.html"),
      `<body style="margin:0"><video src="video.mp4" muted preload="auto" style="display:block"></video></body>`
    )

    const page = await browser.newPage()
    await page.goto(pathToFileURL(path.join(dir, "index.html")).href)

    const size = await page.evaluate(async (time) => {
      const video = document.querySelector("video")!

      if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = resolve
          video.onerror = () =>
            reject(new Error(`Chrome cannot decode it (${video.error?.code})`))
        })
      }

      await new Promise((resolve) => {
        video.onseeked = resolve
        video.currentTime = time
      })

      return { width: video.videoWidth, height: video.videoHeight }
    }, time)

    // At the intrinsic size, the screenshot is the frame pixel for pixel.
    await page.setViewport(size)
    const frame = await page.locator("video").waitHandle()
    const png = await frame.screenshot({ type: "png" })

    const poster = await sharp(png).webp().toBuffer()

    return { ...size, poster }
  } finally {
    await browser.close()
    await rm(dir, { recursive: true, force: true })
  }
}

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      force: { type: "boolean", default: false },
      "poster-time": { type: "string", default: "0" },
    },
  })

  const [post, source] = positionals
  const postId = post ? parseXPostId(post) : null
  const posterTime = Number(values["poster-time"])

  if (!postId || !source || !Number.isFinite(posterTime)) {
    throw new Error(USAGE)
  }

  if (!Bun.which("ffmpeg")) {
    throw new Error("ffmpeg is missing. Install it with: brew install ffmpeg")
  }

  const client = getR2ClientFromEnv()
  const keys = getCraftMediaKeys(postId)

  if (!values.force) {
    for (const key of [keys.source, keys.video, keys.poster]) {
      if (await client.exists(key)) {
        throw new Error(
          `${key} already exists. Pass --force to replace it, then bump ?v= in the URL so the CDN drops its cached copy.`
        )
      }
    }
  }

  const original = await readVideo(source)

  if (!isMp4(original)) {
    throw new Error(`${source} is not an MP4 file`)
  }

  const video = await encodeVideo(original)
  // From the encode, so the poster matches the first frame pixel for pixel.
  const { width, height, poster } = await capturePoster(video, posterTime)

  await client.write(keys.source, original, { type: "video/mp4" })
  console.log(`Uploaded: ${keys.source}`)

  await client.write(keys.video, video, { type: "video/mp4" })
  console.log(`Uploaded: ${keys.video}`)

  await client.write(keys.poster, poster, { type: "image/webp" })
  console.log(`Uploaded: ${keys.poster}`)

  console.log(
    `\nPaste into src/features/craft/data.ts:\n\n${formatCraftMediaSnippet({ postId, width, height })}`
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
