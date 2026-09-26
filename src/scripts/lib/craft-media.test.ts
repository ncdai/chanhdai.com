import { describe, expect, it } from "vitest"

import {
  formatCraftMediaSnippet,
  getCraftMediaKeys,
  isMp4,
  parseXPostId,
} from "./craft-media"

describe("parseXPostId", () => {
  it("reads the ID from a post URL", () => {
    expect(
      parseXPostId("https://x.com/iamncdai/status/2101608687702053067")
    ).toBe("2101608687702053067")
  })

  it("ignores query strings and trailing paths", () => {
    expect(
      parseXPostId(
        "https://twitter.com/iamncdai/status/2101608687702053067/video/1?s=20"
      )
    ).toBe("2101608687702053067")
  })

  it("accepts a bare ID", () => {
    expect(parseXPostId("2101608687702053067")).toBe("2101608687702053067")
  })

  it("rejects anything that is not a post", () => {
    expect(parseXPostId("https://x.com/iamncdai")).toBeNull()
    expect(parseXPostId("business-card")).toBeNull()
  })
})

describe("getCraftMediaKeys", () => {
  it("files the source, the encode, and the poster under the post ID", () => {
    expect(getCraftMediaKeys("2101608687702053067")).toEqual({
      source: "videos/craft/2101608687702053067.mp4",
      video: "videos/craft/2101608687702053067-1600w.mp4",
      poster: "images/craft/2101608687702053067.webp",
    })
  })
})

describe("isMp4", () => {
  it("recognizes the ftyp box", () => {
    const header = new Uint8Array([
      0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d,
    ])

    expect(isMp4(header)).toBe(true)
  })

  it("rejects other files", () => {
    expect(isMp4(new TextEncoder().encode("<!DOCTYPE html>"))).toBe(false)
  })
})

describe("formatCraftMediaSnippet", () => {
  it("prints a media object that points at the uploaded keys", () => {
    expect(
      formatCraftMediaSnippet({
        postId: "2101608687702053067",
        width: 1600,
        height: 1004,
      })
    ).toBe(`media: {
  type: "video",
  src: "https://assets.chanhdai.com/videos/craft/2101608687702053067-1600w.mp4",
  poster: "https://assets.chanhdai.com/images/craft/2101608687702053067.webp",
  width: 1600,
  height: 1004,
},`)
  })
})
