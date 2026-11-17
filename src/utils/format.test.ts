import { formatDuration } from "@/utils/format"
import { describe, expect, it } from "vitest"

describe("formatDuration", () => {
  it("formats hours, minutes and seconds", () => {
    expect(formatDuration(3661)).toBe("1h 1m 1s")
  })

  it("omits zero-valued units, including intermediate ones", () => {
    expect(formatDuration(3605)).toBe("1h 5s")
    expect(formatDuration(360)).toBe("6m")
  })

  it("rounds up across the minute boundary", () => {
    expect(formatDuration(59.6)).toBe("1m")
  })

  it("handles zero", () => {
    expect(formatDuration(0)).toBe("0s")
  })
})
