import { describe, expect, it } from "vitest"

import {
  compareBlocksByCreatedAtDesc,
  getAllBlockIds,
  getAllBlocks,
} from "@/lib/blocks"

describe("compareBlocksByCreatedAtDesc", () => {
  it("sorts a newer date before an older date", () => {
    const newer = { meta: { createdAt: "2026-03-20" } }
    const older = { meta: { createdAt: "2026-02-22" } }
    expect(compareBlocksByCreatedAtDesc(newer, older)).toBeLessThan(0)
  })

  it("returns 0 for equal dates", () => {
    const a = { meta: { createdAt: "2026-03-20" } }
    const b = { meta: { createdAt: "2026-03-20" } }
    expect(compareBlocksByCreatedAtDesc(a, b)).toBe(0)
  })

  it("never yields NaN when meta or createdAt is missing", () => {
    const dated = { meta: { createdAt: "2026-03-20" } }
    const noCreatedAt = { meta: {} }
    const noMeta = {}

    expect(
      Number.isNaN(compareBlocksByCreatedAtDesc(noCreatedAt, noMeta))
    ).toBe(false)
    expect(Number.isNaN(compareBlocksByCreatedAtDesc(dated, noCreatedAt))).toBe(
      false
    )
    expect(Number.isNaN(compareBlocksByCreatedAtDesc(noMeta, dated))).toBe(
      false
    )
  })

  it("sorts a missing-date block after any dated block", () => {
    const dated = { meta: { createdAt: "2026-02-22" } }
    const undated = { meta: {} }
    expect(compareBlocksByCreatedAtDesc(dated, undated)).toBeLessThan(0)
    expect(compareBlocksByCreatedAtDesc(undated, dated)).toBeGreaterThan(0)
  })
})

describe("getAllBlocks", () => {
  it("resolves to a non-empty array of registry:block items", async () => {
    const blocks = await getAllBlocks()
    expect(blocks.length).toBeGreaterThan(0)
    expect(blocks.every((block) => block.type === "registry:block")).toBe(true)
  })

  it("orders blocks non-increasing by createdAt, treating missing dates as 0", async () => {
    const blocks = await getAllBlocks()
    const times = blocks.map((block) =>
      block.meta?.createdAt ? new Date(block.meta.createdAt).getTime() : 0
    )

    for (let i = 1; i < times.length; i++) {
      expect(times[i - 1]).toBeGreaterThanOrEqual(times[i])
    }
  })
})

describe("getAllBlockIds", () => {
  it("returns the same names as getAllBlocks() mapped to name", async () => {
    const blocks = await getAllBlocks()
    const ids = await getAllBlockIds()
    expect(ids).toEqual(blocks.map((block) => block.name))
  })
})
