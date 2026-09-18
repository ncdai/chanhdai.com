import { describe, expect, it } from "vitest"

import {
  extractXAvatarUsernames,
  getXAvatarKey,
  selectXAvatarUsernames,
  toProfileImageUrl,
} from "./x-avatar"

describe("extractXAvatarUsernames", () => {
  it("finds usernames in TSX and MDX sources", () => {
    const source = `
      authorAvatar: "https://assets.chanhdai.com/avatars/x/shadcn.webp",
      authorAvatar="https://assets.chanhdai.com/avatars/x/evilrabbit_.webp"
    `

    expect(extractXAvatarUsernames(source)).toEqual(["shadcn", "evilrabbit_"])
  })

  it("ignores other assets and non-webp avatars", () => {
    const source = `
      "https://assets.chanhdai.com/images/og-image.png"
      "https://assets.chanhdai.com/avatars/x/shadcn.jpg"
    `

    expect(extractXAvatarUsernames(source)).toEqual([])
  })
})

describe("selectXAvatarUsernames", () => {
  const referenced = ["rauchg", "shadcn", "shadcncraft"]

  it("selects every referenced username when none are requested", () => {
    expect(selectXAvatarUsernames(referenced, [])).toEqual(referenced)
  })

  it("selects only the requested usernames, written as X handles", () => {
    expect(
      selectXAvatarUsernames(referenced, [
        "@Shadcn",
        "shadcncraft",
        "shadcncraft",
      ])
    ).toEqual(["shadcn", "shadcncraft"])
  })

  it("rejects usernames that no avatar URL uses", () => {
    expect(() => selectXAvatarUsernames(referenced, ["rauch"])).toThrow("rauch")
  })
})

describe("getXAvatarKey", () => {
  it("builds a key that the avatar URL scan finds again", () => {
    const url = `https://assets.chanhdai.com/${getXAvatarKey("evilrabbit_")}`

    expect(extractXAvatarUsernames(url)).toEqual(["evilrabbit_"])
  })
})

describe("toProfileImageUrl", () => {
  it("upgrades a sized profile image to 400x400", () => {
    expect(
      toProfileImageUrl(
        "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_200x200.jpg"
      )
    ).toBe(
      "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg"
    )
  })

  it("keeps the file extension", () => {
    expect(
      toProfileImageUrl("https://pbs.twimg.com/profile_images/1/abc_normal.png")
    ).toBe("https://pbs.twimg.com/profile_images/1/abc_400x400.png")
  })

  it("rejects the placeholder X serves for missing profiles", () => {
    expect(
      toProfileImageUrl(
        "https://abs.twimg.com/rweb/ssr/default/v2/og/image.png"
      )
    ).toBeNull()
  })

  it("rejects a missing og:image", () => {
    expect(toProfileImageUrl(null)).toBeNull()
  })
})
