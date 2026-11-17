import { describe, expect, it } from "vitest"

import { compareBlocksByCreatedAtDesc } from "@/lib/blocks"

describe("compareBlocksByCreatedAtDesc", () => {
  it("sorts a newer date before an older date", () => {
    const newer = { meta: { createdAt: "2026-03-20" } }
    const older = { meta: { createdAt: "2026-02-22" } }
    expect(compareBlocksByCreatedAtDesc(newer, older)).toBeLessThan(0)
  })

  it("sorts a missing-date block after any dated block", () => {
    const dated = { meta: { createdAt: "2026-02-22" } }
    expect(compareBlocksByCreatedAtDesc(dated, { meta: {} })).toBeLessThan(0)
    expect(compareBlocksByCreatedAtDesc({}, dated)).toBeGreaterThan(0)
  })
})
