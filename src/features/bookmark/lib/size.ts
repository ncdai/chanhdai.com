import type { Bookmark, BookmarkSize } from "../types"

const SIZES: readonly BookmarkSize[] = ["sm", "md", "lg"]

/** Hashing the url keeps a book's size stable across renders and filters. */
export function getBookmarkSize(bookmark: Pick<Bookmark, "url" | "size">) {
  if (bookmark.size) return bookmark.size

  let hash = 0
  for (const char of bookmark.url) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0
  }

  return SIZES[Math.abs(hash) % SIZES.length]
}
