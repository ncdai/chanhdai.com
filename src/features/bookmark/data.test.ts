import { describe, expect, it } from "vitest"

import { BOOKMARKS } from "./data"

describe("BOOKMARKS", () => {
  it("has unique urls", () => {
    const urls = BOOKMARKS.map((bookmark) => bookmark.url)

    expect(new Set(urls).size).toBe(urls.length)
  })

  it("has parseable urls and dates", () => {
    for (const bookmark of BOOKMARKS) {
      expect(() => new URL(bookmark.url)).not.toThrow()
      expect(new Date(bookmark.bookmarkedAt).getTime()).not.toBeNaN()
    }
  })
})
