import { registry } from "@/registry"
import { getRegistryItemUrl } from "@/utils/registry"
import type { RegistryItem } from "shadcn/schema"
import { describe, expect, it } from "vitest"

import { getComponentDocs } from "@/features/doc/data/documents"
import {
  getInstallExpectations,
  getInstallPrompt,
} from "@/features/doc/lib/install-prompt"

function createItem(item: Partial<RegistryItem> & { name: string }) {
  return { type: "registry:component", files: [], ...item } as RegistryItem
}

function createFile(target: string) {
  return { path: target, type: "registry:component" as const, target }
}

describe("getInstallExpectations", () => {
  it("collects shadcn/ui items, registry items and packages through local items", () => {
    const items = [
      createItem({
        name: "alpha",
        dependencies: ["motion"],
        registryDependencies: [
          getRegistryItemUrl("beta"),
          "button",
          "@acme/thing",
        ],
      }),
      createItem({
        name: "beta",
        dependencies: ["jotai"],
        registryDependencies: ["tooltip"],
        cssVars: { light: { ring: "red" } },
      }),
    ]

    expect(getInstallExpectations("alpha", items)).toMatchObject({
      shadcnItems: ["tooltip", "button"],
      registryItems: ["@ncdai/beta", "@acme/thing"],
      packages: ["motion", "jotai"],
      hasCss: true,
    })
  })

  it("places files without a target by their type", () => {
    const items = [
      createItem({
        name: "use-alpha",
        files: [{ path: "hooks/use-alpha.ts", type: "registry:hook" }],
      }),
    ]

    expect(getInstallExpectations("use-alpha", items).files).toEqual([
      "hooks/use-alpha.ts",
    ])
  })
})

describe("getInstallPrompt", () => {
  it("asks for a Radix conversion only when shadcn/ui items are installed", () => {
    const items = [
      createItem({ name: "alpha", registryDependencies: ["button"] }),
      createItem({ name: "beta" }),
    ]

    expect(getInstallPrompt("alpha", items)).toContain("asChild")
    expect(getInstallPrompt("beta", items)).not.toContain("asChild")
  })

  it("summarizes a large item by its folder", () => {
    const files = Array.from({ length: 6 }, (_, index) =>
      createFile(`@components/alpha/part-${index}.tsx`)
    )
    const prompt = getInstallPrompt("alpha", [
      createItem({ name: "alpha", files }),
    ])

    expect(prompt).toContain("- components/alpha/ (6 files)")
    expect(prompt).not.toContain("part-0.tsx")
  })
})

describe("component docs", () => {
  const docUrl = (slug: string) => `${registry.homepage}/${slug}`

  it("each offer one prompt per CLI command, in the same order", () => {
    const mismatches = getComponentDocs()
      .map((doc) => {
        const cli = getTabContent(doc.content, "cli")
        const prompt = getTabContent(doc.content, "prompt")

        if (cli === null) {
          return null
        }

        const commands = [
          ...cli.matchAll(/npx shadcn@latest add @ncdai\/([\w-]+)/g),
        ].map((match) => match[1])
        const prompts = [
          ...(prompt ?? "").matchAll(/<InstallPrompt name="([^"]+)" \/>/g),
        ].map((match) => match[1])

        return commands.join() === prompts.join()
          ? null
          : { slug: doc.slug, commands, prompts }
      })
      .filter((mismatch) => mismatch !== null)

    expect(mismatches).toEqual([])
  })

  // A typo in both tabs would pass the check above while the prompt silently
  // renders nothing.
  it("each point InstallPrompt at registry items documented on that page", () => {
    const invalid = getComponentDocs().flatMap((doc) =>
      [...doc.content.matchAll(/<InstallPrompt name="([^"]+)" \/>/g)]
        .map((match) => match[1])
        .filter((name) => {
          const item = registry.items.find((item) => item.name === name)
          return item?.docs !== docUrl(doc.slug)
        })
        .map((name) => `${doc.slug}: ${name}`)
    )

    expect(invalid).toEqual([])
  })
})

function getTabContent(content: string, value: string) {
  const match = content.match(
    new RegExp(`<TabsContent value="${value}">([\\s\\S]*?)</TabsContent>`)
  )

  return match ? match[1] : null
}
