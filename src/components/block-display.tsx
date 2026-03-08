import { cache } from "react"
import type { registryItemFileSchema } from "shadcn/schema"
import type { z } from "zod"

import { highlightCode } from "@/lib/highlight-code"
import {
  createFileTreeForRegistryItemFiles,
  getRegistryItem,
} from "@/lib/registry"

import { BlockViewer } from "./block-viewer"

export async function BlockDisplay({ name }: { name: string }) {
  const item = await getCachedRegistryItem(name)

  if (!item?.files) {
    return null
  }

  const [tree, highlightedFiles] = await Promise.all([
    getCachedFileTree(item.files),
    getCachedHighlightedFiles(item.files),
  ])

  return (
    <BlockViewer item={item} tree={tree} highlightedFiles={highlightedFiles} />
  )
}

const getCachedRegistryItem = cache(async (name: string) => {
  return await getRegistryItem(name)
})

const getCachedFileTree = cache(
  async (files: Array<{ path: string; target?: string }>) => {
    if (!files) {
      return null
    }
    return createFileTreeForRegistryItemFiles(files)
  }
)

const getCachedHighlightedFiles = cache(
  async (files: z.infer<typeof registryItemFileSchema>[]) => {
    return await Promise.all(
      files.map(async (file) => ({
        ...file,
        highlightedContent: await highlightCode(file.content ?? ""),
      }))
    )
  }
)
