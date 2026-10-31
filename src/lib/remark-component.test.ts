import { remark } from "remark"
import remarkMdx from "remark-mdx"
import { describe, expect, it, vi } from "vitest"

import { remarkComponent } from "@/lib/remark-component"

vi.mock("@/features/doc/lib/doc-dependencies", () => ({
  getDocDependencyLines: (name: string) =>
    name === "alpha"
      ? ["Dependencies: motion", "Registry dependencies: button"]
      : [],
}))

async function processMdx(value: string) {
  const processor = remark().use(remarkMdx).use(remarkComponent)
  return String(await processor.process({ value }))
}

describe("remarkComponent DocDependencies", () => {
  it("replaces the tag with one paragraph per line", async () => {
    const output = await processMdx(
      'Before\n\n<DocDependencies name="alpha" />\n\nAfter\n'
    )

    expect(output).toBe(
      "Before\n\nDependencies: motion\n\nRegistry dependencies: button\n\nAfter\n"
    )
  })

  it("removes an empty tag without skipping its sibling", async () => {
    const output = await processMdx(
      '<DocDependencies name="none" />\n\n<DocDependencies name="alpha" />\n'
    )

    expect(output).toBe(
      "Dependencies: motion\n\nRegistry dependencies: button\n"
    )
  })
})
