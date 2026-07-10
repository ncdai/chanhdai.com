import { escapeXml, toISODateSafe } from "@/utils/string"
import { describe, expect, it } from "vitest"

describe("escapeXml", () => {
  it("escapes ampersands", () => {
    expect(escapeXml("a & b")).toBe("a &amp; b")
  })

  it("escapes angle brackets", () => {
    expect(escapeXml("<x>")).toBe("&lt;x&gt;")
  })

  it("escapes quotes", () => {
    expect(escapeXml(`q"'`)).toBe("q&quot;&apos;")
  })

  it("leaves a plain string unchanged", () => {
    expect(escapeXml("plain text")).toBe("plain text")
  })
})

describe("toISODateSafe", () => {
  it("returns an ISO string for a valid date", () => {
    expect(toISODateSafe("2024-01-01")).toBe("2024-01-01T00:00:00.000Z")
  })

  it("returns null for undefined", () => {
    expect(toISODateSafe(undefined)).toBeNull()
  })

  it("returns null for null", () => {
    expect(toISODateSafe(null)).toBeNull()
  })

  it("returns null for an invalid date string", () => {
    expect(toISODateSafe("nonsense")).toBeNull()
  })
})
