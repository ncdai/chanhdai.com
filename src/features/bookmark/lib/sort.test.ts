import { describe, expect, it } from "vitest"

import { BookmarkCategory, type Bookmark } from "../types"
import { sortBookmarksNewestFirst } from "./sort"

function bookmark(title: string, bookmarkedAt: string): Bookmark {
  return {
    title,
    url: `https://example.com/${title}`,
    category: BookmarkCategory.ARTICLE,
    bookmarkedAt,
  }
}

describe("sortBookmarksNewestFirst", () => {
  it("orders by bookmarkedAt descending", () => {
    const sorted = sortBookmarksNewestFirst([
      bookmark("old", "2026-01-01"),
      bookmark("new", "2026-03-01"),
      bookmark("mid", "2026-02-01"),
    ])

    expect(sorted.map((b) => b.title)).toEqual(["new", "mid", "old"])
  })

  it("puts later data entries first when dates tie", () => {
    const sorted = sortBookmarksNewestFirst([
      bookmark("first", "2026-09-03"),
      bookmark("second", "2026-09-03"),
      bookmark("third", "2026-09-03"),
    ])

    expect(sorted.map((b) => b.title)).toEqual(["third", "second", "first"])
  })

  it("does not mutate the input", () => {
    const input = [bookmark("a", "2026-01-02"), bookmark("b", "2026-01-01")]
    const copy = [...input]

    sortBookmarksNewestFirst(input)

    expect(input).toEqual(copy)
  })
})
