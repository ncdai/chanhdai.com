import { describe, expect, it } from "vitest"

import { AWARDS } from "./awards"
import { CERTIFICATIONS } from "./certifications"
import { INTELLECTUAL_PROPERTY } from "./intellectual-property"
import {
  RECOGNITION,
  RECOGNITION_BY_DATE,
  RECOGNITION_PINNED_KEYS,
} from "./recognition"

describe("RECOGNITION", () => {
  it("includes every award, certification, and IP registration", () => {
    expect(RECOGNITION).toHaveLength(
      AWARDS.length + CERTIFICATIONS.length + INTELLECTUAL_PROPERTY.length
    )
  })

  it("has unique keys", () => {
    const keys = RECOGNITION.map((entry) => entry.key)

    expect(new Set(keys).size).toBe(keys.length)
  })

  it("orders RECOGNITION_BY_DATE by parseable dates, newest first", () => {
    const times = RECOGNITION_BY_DATE.map((entry) =>
      new Date(entry.date).getTime()
    )

    expect(times.some(Number.isNaN)).toBe(false)
    expect(times).toEqual([...times].sort((a, b) => b - a))
  })

  it("puts pinned entries first, then the rest in date order", () => {
    const rest = RECOGNITION_BY_DATE.filter(
      (entry) => !RECOGNITION_PINNED_KEYS.includes(entry.key)
    )

    expect(RECOGNITION.map((entry) => entry.key)).toEqual([
      ...RECOGNITION_PINNED_KEYS,
      ...rest.map((entry) => entry.key),
    ])
  })

  // The kind falls back to "trademark", so a new IP type (e.g. a patent)
  // must fail here instead of being mislabeled.
  it("only has trademark or copyright IP registrations", () => {
    for (const item of INTELLECTUAL_PROPERTY) {
      expect(["trademark", "copyright"]).toContain(item.issuerIconName)
    }
  })
})
