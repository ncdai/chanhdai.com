import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import emojiRegex from "@/registry/components/twemoji/lib/twemoji-regex"

const VARIATION_SELECTOR_16 = /\uFE0F/g
const ZERO_WIDTH_JOINER = String.fromCharCode(0x200d)

export const TWEMOJI_CDN_URL = "https://abs-0.twimg.com/emoji/v2/svg"

export type TwemojiProps = {
  children: string
  className?: string
  /**
   * Resolve an emoji code point to an image URL.
   *
   * @param codePoint - The Unicode code point of the emoji (e.g. `1f44d`)
   * @returns The URL string pointing to the emoji image asset
   *
   * @example
   * ```tsx
   * source={(codePoint) => `https://cdn.example.com/emoji/${codePoint}.svg`}
   * ```
   * */
  source?: (codePoint: string) => string
}

export function Twemoji({
  children,
  className,
  source = defaultSource,
}: TwemojiProps) {
  const parts: ReactNode[] = []
  let lastIndex = 0
  const globalRegex = new RegExp(emojiRegex.source, "g")
  let match

  while ((match = globalRegex.exec(children)) !== null) {
    if (match.index > lastIndex) {
      parts.push(children.substring(lastIndex, match.index))
    }

    const rawText = match[0]
    const codePoint = getEmojiCodePoint(rawText)

    if (codePoint) {
      parts.push(
        <img
          key={match.index}
          className={cn("twemoji", className)}
          draggable={false}
          alt={rawText}
          src={source(codePoint)}
        />
      )
    } else {
      parts.push(rawText)
    }

    lastIndex = globalRegex.lastIndex
  }

  if (lastIndex < children.length) {
    parts.push(children.substring(lastIndex))
  }

  return <>{parts}</>
}

function getEmojiCodePoint(rawText: string) {
  return toCodePoint(
    rawText.indexOf(ZERO_WIDTH_JOINER) < 0
      ? rawText.replace(VARIATION_SELECTOR_16, "")
      : rawText
  )
}

function toCodePoint(unicodeSurrogates: string, sep = "-") {
  const result: string[] = []
  let code = 0
  let previous = 0
  let i = 0

  while (i < unicodeSurrogates.length) {
    code = unicodeSurrogates.charCodeAt(i++)
    if (previous) {
      result.push(
        (0x10000 + ((previous - 0xd800) << 10) + (code - 0xdc00)).toString(16)
      )
      previous = 0
    } else if (0xd800 <= code && code <= 0xdbff) {
      previous = code
    } else {
      result.push(code.toString(16))
    }
  }

  return result.join(sep)
}

function defaultSource(codePoint: string) {
  return `${TWEMOJI_CDN_URL}/${codePoint}.svg`
}
