import {
  formatCompactNumber,
  formatDuration,
  formatNumber,
} from "@/utils/format"
import { describe, expect, it } from "vitest"

describe("formatNumber", () => {
  it("groups thousands with commas", () => {
    expect(formatNumber(1234)).toBe("1,234")
    expect(formatNumber(1234567)).toBe("1,234,567")
  })

  it("uses a dot as the decimal separator", () => {
    expect(formatNumber(1234.5)).toBe("1,234.5")
  })

  it("leaves numbers below a thousand ungrouped", () => {
    expect(formatNumber(0)).toBe("0")
    expect(formatNumber(999)).toBe("999")
  })

  it("keeps the sign on negative numbers", () => {
    expect(formatNumber(-1234)).toBe("-1,234")
  })
})

describe("formatCompactNumber", () => {
  it("abbreviates thousands and millions", () => {
    expect(formatCompactNumber(1234)).toBe("1.2K")
    expect(formatCompactNumber(1234567)).toBe("1.2M")
  })

  it("leaves small numbers as-is", () => {
    expect(formatCompactNumber(999)).toBe("999")
  })
})

describe("formatDuration", () => {
  it("formats minutes and seconds", () => {
    expect(formatDuration(323)).toBe("5m 23s")
  })

  it("formats hours, minutes and seconds", () => {
    expect(formatDuration(3661)).toBe("1h 1m 1s")
  })

  it("omits zero-valued units", () => {
    expect(formatDuration(3600)).toBe("1h")
    expect(formatDuration(360)).toBe("6m")
    expect(formatDuration(45)).toBe("45s")
  })

  it("skips intermediate zero units", () => {
    expect(formatDuration(3605)).toBe("1h 5s")
  })

  it("rounds fractional seconds", () => {
    expect(formatDuration(323.6)).toBe("5m 24s")
  })

  it("rounds up across the minute boundary", () => {
    expect(formatDuration(59.6)).toBe("1m")
  })

  it("handles zero", () => {
    expect(formatDuration(0)).toBe("0s")
  })
})
