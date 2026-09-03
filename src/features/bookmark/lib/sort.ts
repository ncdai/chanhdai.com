import { compareDesc } from "date-fns"

import type { Bookmark } from "../types"

/** Newest first; when dates tie, entries added later in the data file come first. */
export function sortBookmarksNewestFirst(bookmarks: readonly Bookmark[]) {
  return bookmarks
    .map((bookmark, index) => ({ bookmark, index }))
    .sort(
      (a, b) =>
        compareDesc(
          new Date(a.bookmark.bookmarkedAt),
          new Date(b.bookmark.bookmarkedAt)
        ) || b.index - a.index
    )
    .map(({ bookmark }) => bookmark)
}
