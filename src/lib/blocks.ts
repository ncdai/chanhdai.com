import { registryItemSchema } from "shadcn/schema"
import type { z } from "zod"

import { blockCategories } from "@/config/registry"

type DatedBlock = {
  meta?: { createdAt?: string } & Record<string, unknown>
}

export function compareBlocksByCreatedAtDesc(a: DatedBlock, b: DatedBlock) {
  const dateA = a.meta?.createdAt ? new Date(a.meta.createdAt).getTime() : 0
  const dateB = b.meta?.createdAt ? new Date(b.meta.createdAt).getTime() : 0
  return dateB - dateA
}

export async function getAllBlockStaticParams(): Promise<
  Array<{ category: string; name: string }>
> {
  const { Index } = await import("@/registry/__index__")

  const params: Array<{ category: string; name: string }> = []

  for (const category of blockCategories) {
    for (const itemName in Index) {
      const item = Index[itemName]
      if (
        item.type === "registry:block" &&
        item.categories?.includes(category.name)
      ) {
        params.push({ category: category.name, name: itemName })
      }
    }
  }

  return params
}

export async function getAllBlockIds(
  types: z.infer<typeof registryItemSchema>["type"][] = ["registry:block"],
  categories: string[] = []
): Promise<string[]> {
  const blocks = await getAllBlocks(types, categories)
  return blocks.map((block) => block.name)
}

export async function getAllBlocks(
  types: z.infer<typeof registryItemSchema>["type"][] = ["registry:block"],
  categories: string[] = []
) {
  const { Index } = await import("@/registry/__index__")

  // Collect all blocks from all styles.
  const allBlocks: z.infer<typeof registryItemSchema>[] = []

  for (const itemName in Index) {
    const item = Index[itemName]
    allBlocks.push(item)
  }

  // Validate each block.
  const validatedBlocks = allBlocks
    .map((block) => {
      const result = registryItemSchema.safeParse(block)
      return result.success ? result.data : null
    })
    .filter(
      (block): block is z.infer<typeof registryItemSchema> => block !== null
    )

  return validatedBlocks
    .filter(
      (block) =>
        types.includes(block.type) &&
        (categories.length === 0 ||
          block.categories?.some((category) => categories.includes(category)))
    )
    .sort(compareBlocksByCreatedAtDesc)
}
