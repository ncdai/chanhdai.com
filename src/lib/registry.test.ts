import type { registryItemFileSchema, registryItemSchema } from "shadcn/schema"
import { describe, expect, it } from "vitest"
import type { z } from "zod"

import {
  createFileTreeForRegistryItemFiles,
  fixFilePaths,
  fixImport,
  getFileTarget,
  normalizeAliasTarget,
} from "@/lib/registry"

type RegistryFile = z.infer<typeof registryItemFileSchema>
type RegistryFiles = z.infer<typeof registryItemSchema>["files"]

// These are characterization tests: the expected values are whatever the
// current transforms produce. They pin the contract this site publishes as
// its shadcn registry, so a future refactor that changes the output is caught.

describe("fixImport", () => {
  it("rewrites an @/registry/.../components/ path", () => {
    expect(fixImport("import { X } from '@/registry/components/foo/bar'")).toBe(
      "import { X } from '@/components/foo/bar'"
    )
  })

  it("rewrites an @/registry/.../ui/ path", () => {
    expect(fixImport("import { X } from '@/registry/ui/foo/bar'")).toBe(
      "import { X } from '@/components/ui/foo/bar'"
    )
  })

  it("rewrites an @/registry/.../hooks/ path", () => {
    expect(fixImport("import { X } from '@/registry/hooks/foo/bar'")).toBe(
      "import { X } from '@/hooks/foo/bar'"
    )
  })

  it("rewrites an @/registry/.../lib/ path", () => {
    expect(fixImport("import { X } from '@/registry/lib/foo/bar'")).toBe(
      "import { X } from '@/lib/foo/bar'"
    )
  })

  it("collapses a nested directory prefix before the type segment", () => {
    expect(
      fixImport("import x from '@/registry/some/deep/components/widget'")
    ).toBe("import x from '@/components/widget'")
  })

  it("leaves a string with no matching import unchanged", () => {
    expect(fixImport("import { X } from './local/thing'")).toBe(
      "import { X } from './local/thing'"
    )
  })

  it("rewrites both imports when they are on separate lines", () => {
    expect(
      fixImport(
        "import { A } from '@/registry/components/foo/a'\n" +
          "import { B } from '@/registry/lib/bar/b'"
      )
    ).toBe(
      "import { A } from '@/components/foo/a'\nimport { B } from '@/lib/bar/b'"
    )
  })

  it("collapses two matches that share one line (lazy prefix spans the gap)", () => {
    // Quirk: `.+?` in the first capture group consumes across the quote/space
    // boundary, so two matches on one line fold into the last one. Real file
    // contents keep imports on separate lines, so this pathological case does
    // not occur in practice; pinned to document the actual behavior.
    expect(
      fixImport("a '@/registry/components/foo/aa' b '@/registry/lib/bar/bb'")
    ).toBe("a '@/lib/bar/bb'")
  })
})

describe("getFileTarget", () => {
  const withEmptyTarget = (type: RegistryFile["type"]): RegistryFile =>
    ({
      path: "src/registry/components/foo/bar.tsx",
      type,
      target: "",
    }) as RegistryFile

  it("derives components/ for component, block, and example types", () => {
    expect(getFileTarget(withEmptyTarget("registry:component"))).toBe(
      "components/bar.tsx"
    )
    expect(getFileTarget(withEmptyTarget("registry:block"))).toBe(
      "components/bar.tsx"
    )
    expect(getFileTarget(withEmptyTarget("registry:example"))).toBe(
      "components/bar.tsx"
    )
  })

  it("derives components/ui/ for ui type", () => {
    expect(getFileTarget(withEmptyTarget("registry:ui"))).toBe(
      "components/ui/bar.tsx"
    )
  })

  it("derives hooks/ for hook type", () => {
    expect(getFileTarget(withEmptyTarget("registry:hook"))).toBe(
      "hooks/bar.tsx"
    )
  })

  it("derives lib/ for lib type", () => {
    expect(getFileTarget(withEmptyTarget("registry:lib"))).toBe("lib/bar.tsx")
  })

  it("delegates to normalizeAliasTarget when an explicit target is set", () => {
    expect(
      getFileTarget({
        path: "x",
        type: "registry:lib",
        target: "@lib/utils.ts",
      } as RegistryFile)
    ).toBe("lib/utils.ts")
  })
})

describe("normalizeAliasTarget", () => {
  it("maps @components/ to components/", () => {
    expect(normalizeAliasTarget("@components/x.tsx")).toBe("components/x.tsx")
  })

  it("maps @ui/ to components/ui/", () => {
    expect(normalizeAliasTarget("@ui/x.tsx")).toBe("components/ui/x.tsx")
  })

  it("maps @hooks/ to hooks/", () => {
    expect(normalizeAliasTarget("@hooks/x.ts")).toBe("hooks/x.ts")
  })

  it("maps @lib/ to lib/", () => {
    expect(normalizeAliasTarget("@lib/x.ts")).toBe("lib/x.ts")
  })

  it("leaves a non-alias target unchanged", () => {
    expect(normalizeAliasTarget("components/plain.tsx")).toBe(
      "components/plain.tsx"
    )
  })
})

describe("fixFilePaths", () => {
  it("re-bases paths against the first file's directory and computes targets", () => {
    const files = [
      {
        path: "src/registry/components/foo/index.tsx",
        type: "registry:component",
        target: "",
      },
      {
        path: "src/registry/components/foo/util.ts",
        type: "registry:lib",
        target: "",
      },
    ] as RegistryFiles

    expect(fixFilePaths(files)).toEqual([
      {
        path: "index.tsx",
        type: "registry:component",
        target: "components/index.tsx",
      },
      { path: "util.ts", type: "registry:lib", target: "lib/util.ts" },
    ])
  })

  it("returns [] for undefined files", () => {
    expect(fixFilePaths(undefined as unknown as RegistryFiles)).toEqual([])
  })
})

describe("createFileTreeForRegistryItemFiles", () => {
  it("nests files sharing a directory under one folder node", () => {
    expect(
      createFileTreeForRegistryItemFiles([
        { path: "components/foo/a.tsx" },
        { path: "components/foo/b.tsx" },
      ])
    ).toEqual([
      {
        name: "components",
        children: [
          {
            name: "foo",
            children: [
              { name: "a.tsx", path: "components/foo/a.tsx" },
              { name: "b.tsx", path: "components/foo/b.tsx" },
            ],
          },
        ],
      },
    ])
  })

  it("prefers target over path when building the tree", () => {
    expect(
      createFileTreeForRegistryItemFiles([
        { path: "wrong/a.tsx", target: "components/right/a.tsx" },
      ])
    ).toEqual([
      {
        name: "components",
        children: [
          {
            name: "right",
            children: [{ name: "a.tsx", path: "components/right/a.tsx" }],
          },
        ],
      },
    ])
  })
})
