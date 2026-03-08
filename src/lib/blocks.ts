"use server"

import { registryItemSchema } from "shadcn/schema"
import type { z } from "zod"

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
  const { Index } = await import("@/__registry__")

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

  return validatedBlocks.filter(
    (block) =>
      types.includes(block.type) &&
      (categories.length === 0 ||
        block.categories?.some((category) => categories.includes(category)))
  )
}
