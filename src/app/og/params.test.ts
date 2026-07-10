import { describe, expect, it } from "vitest"

import { clampParam } from "./params"

describe("clampParam", () => {
  it("returns the default fallback for null", () => {
    expect(clampParam(null, 10)).toBe("")
  })

  it("returns a custom fallback for null", () => {
    expect(clampParam(null, 10, "fallback")).toBe("fallback")
  })

  it("passes through a short value unchanged", () => {
    expect(clampParam("hello", 10)).toBe("hello")
  })

  it("passes through a value exactly at maxLength unchanged", () => {
    expect(clampParam("0123456789", 10)).toBe("0123456789")
  })

  it("truncates a value over maxLength, ending in an ellipsis", () => {
    expect(clampParam("01234567890", 10)).toBe("012345678…")
  })

  it("trims whitespace-padded values", () => {
    expect(clampParam("  hello  ", 10)).toBe("hello")
  })
})
