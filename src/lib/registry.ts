import { promises as fs } from "fs"
import { LRUCache } from "lru-cache"
import path from "path"
import type { registryItemFileSchema } from "shadcn/schema"
import { registryItemSchema } from "shadcn/schema"
import type { z } from "zod"

import { Index } from "@/__registry__"

// LRU cache for cross-request caching of registry items.
// File reads are I/O-bound, so caching improves dev server performance.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registryCache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes (shorter for dev to pick up changes).
})

export async function getRegistryItem(name: string) {
  const cacheKey = name

  // Check cache first.
  if (registryCache.has(cacheKey)) {
    return registryCache.get(cacheKey)
  }

  const item = Index[name]

  if (!item) {
    registryCache.set(cacheKey, null)
    return null
  }

  // Fail early before doing expensive file operations.
  const result = registryItemSchema.safeParse(item)

  if (!result.success) {
    registryCache.set(cacheKey, null)
    return null
  }

  // Read all files in parallel.
  let files: typeof result.data.files = await Promise.all(
    item.files.map(async (file: z.infer<typeof registryItemFileSchema>) => {
      const content = await getFileContent(file)
      const relativePath = path.relative(process.cwd(), file.path)

      return {
        ...file,
        path: relativePath,
        content,
      }
    })
  )

  // Fix file paths.
  files = fixFilePaths(files)

  const parsed = registryItemSchema.safeParse({
    ...result.data,
    files,
  })

  if (!parsed.success) {
    console.error(parsed.error.message)
    registryCache.set(cacheKey, null)
    return null
  }

  // Cache the result.
  registryCache.set(cacheKey, parsed.data)

  return parsed.data
}

async function getFileContent(file: z.infer<typeof registryItemFileSchema>) {
  let code = await fs.readFile(file.path, "utf-8")

  // Some registry items uses default export.
  // We want to use named export instead.
  if (file.type !== "registry:page") {
    code = code.replaceAll("export default", "export")
  }

  // Fix imports.
  code = fixImport(code)

  return code
}

export function fixImport(content: string) {
  const regex = /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g

  const replacement = (
    match: string,
    _path: string,
    type: string,
    component: string
  ) => {
    if (type.endsWith("components")) {
      return `@/components/${component}`
    } else if (type.endsWith("ui")) {
      return `@/components/ui/${component}`
    } else if (type.endsWith("hooks")) {
      return `@/hooks/${component}`
    } else if (type.endsWith("lib")) {
      return `@/lib/${component}`
    }

    return match
  }

  return content.replace(regex, replacement)
}

function fixFilePaths(files: z.infer<typeof registryItemSchema>["files"]) {
  if (!files) {
    return []
  }

  // Resolve all paths relative to the first file's directory.
  const firstFilePath = files[0].path
  const firstFilePathDir = path.dirname(firstFilePath)

  return files.map((file) => {
    return {
      ...file,
      path: path.relative(firstFilePathDir, file.path),
      target: getFileTarget(file),
    }
  })
}

function getFileTarget(file: z.infer<typeof registryItemFileSchema>) {
  let target = file.target

  if (!target || target === "") {
    const fileName = file.path.split("/").pop()
    if (
      file.type === "registry:block" ||
      file.type === "registry:component" ||
      file.type === "registry:example"
    ) {
      target = `components/${fileName}`
    }

    if (file.type === "registry:ui") {
      target = `components/ui/${fileName}`
    }

    if (file.type === "registry:hook") {
      target = `hooks/${fileName}`
    }

    if (file.type === "registry:lib") {
      target = `lib/${fileName}`
    }
  }

  return target ?? ""
}

export type FileTree = {
  name: string
  path?: string
  children?: FileTree[]
}

export function createFileTreeForRegistryItemFiles(
  files: Array<{ path: string; target?: string }>
) {
  const root: FileTree[] = []

  for (const file of files) {
    const path = file.target ?? file.path
    const parts = path.split("/")
    let currentLevel = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1
      const existingNode = currentLevel.find((node) => node.name === part)

      if (existingNode) {
        if (isFile) {
          // Update existing file node with full path
          existingNode.path = path
        } else {
          // Move to next level in the tree
          currentLevel = existingNode.children!
        }
      } else {
        const newNode: FileTree = isFile
          ? { name: part, path }
          : { name: part, children: [] }

        currentLevel.push(newNode)

        if (!isFile) {
          currentLevel = newNode.children!
        }
      }
    }
  }

  return root
}
