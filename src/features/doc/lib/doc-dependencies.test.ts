import { registry } from "@/registry"
import { getRegistryItemUrl } from "@/utils/registry"
import type { RegistryItem } from "shadcn/schema"
import { describe, expect, it, vi } from "vitest"

import { getComponentDocs } from "@/features/doc/data/documents"
import {
  getDocDependencies,
  getDocDependencyLines,
} from "@/features/doc/lib/doc-dependencies"

vi.mock("@/config/registry-item-urls", () => ({
  REGISTRY_ITEM_URLS: { "@acme": "https://acme.dev/components/{name}" },
}))

function createItem(item: Partial<RegistryItem> & { name: string }) {
  return { type: "registry:component", ...item } as RegistryItem
}

const docs = (slug: string) => `${registry.homepage}/${slug}`

describe("getDocDependencies", () => {
  it("flattens packages through local items, not registry dependencies", () => {
    const items = [
      createItem({
        name: "alpha",
        dependencies: ["motion"],
        registryDependencies: [getRegistryItemUrl("beta")],
      }),
      createItem({
        name: "beta",
        dependencies: ["motion", "jotai"],
        devDependencies: ["@types/jotai"],
        registryDependencies: ["button"],
      }),
    ]

    const { packages, registryItems } = getDocDependencies("alpha", items)

    expect(packages.map(({ name }) => name)).toEqual([
      "motion",
      "jotai",
      "@types/jotai",
    ])
    expect(packages[0].href).toBe("https://www.npmjs.com/package/motion")
    expect(registryItems.map(({ name }) => name)).toEqual(["beta"])
  })

  it("does not recurse forever on circular registry dependencies", () => {
    const items = [
      createItem({
        name: "alpha",
        registryDependencies: [getRegistryItemUrl("beta")],
      }),
      createItem({
        name: "beta",
        dependencies: ["jotai"],
        registryDependencies: [getRegistryItemUrl("alpha")],
      }),
    ]

    const { packages } = getDocDependencies("alpha", items)

    expect(packages.map(({ name }) => name)).toEqual(["jotai"])
  })

  it("links each kind of registry dependency", () => {
    const externalDocs = "https://www.kibo-ui.com/components/contribution-graph"
    const items = [
      createItem({
        name: "alpha",
        registryDependencies: [
          "button",
          getRegistryItemUrl("local-docs"),
          getRegistryItemUrl("external-docs"),
          getRegistryItemUrl("no-docs"),
          "@acme/marquee",
          "@unknown/marquee",
        ],
      }),
      createItem({ name: "local-docs", docs: docs("local-docs") }),
      createItem({ name: "external-docs", docs: externalDocs }),
      createItem({ name: "no-docs" }),
    ]

    const { registryItems } = getDocDependencies("alpha", items)

    expect(registryItems).toEqual([
      {
        name: "button",
        href: "https://ui.shadcn.com/docs/components/base/button",
      },
      { name: "local-docs", href: "/components/local-docs" },
      { name: "external-docs", href: externalDocs },
      { name: "no-docs" },
      { name: "@acme/marquee", href: "https://acme.dev/components/marquee" },
      { name: "@unknown/marquee" },
    ])
  })
})

describe("getDocDependencyLines", () => {
  it("writes one line per non-empty group", () => {
    const items = [
      createItem({
        name: "alpha",
        dependencies: ["motion", "jotai"],
        registryDependencies: ["button"],
      }),
      createItem({ name: "beta", registryDependencies: ["button"] }),
    ]

    expect(getDocDependencyLines("alpha", items)).toEqual([
      "Dependencies: motion, jotai",
      "Registry dependencies: button",
    ])
    expect(getDocDependencyLines("beta", items)).toEqual([
      "Registry dependencies: button",
    ])
  })
})

describe("component docs", () => {
  // A typo hides the block silently, and a copied doc would show another
  // component's dependencies.
  it("each point DocDependencies at one of their own registry items", () => {
    const invalidDocs = getComponentDocs()
      .filter((doc) => {
        const name = doc.content.match(
          /<DocDependencies name="([^"]+)" \/>/
        )?.[1]
        const item = registry.items.find((item) => item.name === name)

        return item?.docs !== docs(doc.slug)
      })
      .map((doc) => doc.slug)

    expect(invalidDocs).toEqual([])
  })
})
