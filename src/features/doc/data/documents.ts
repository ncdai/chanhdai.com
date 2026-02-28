import fs from "fs"
import matter from "gray-matter"
import path from "path"
import { cache } from "react"

import type { Doc, DocMetadata } from "@/features/doc/types/document"

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent)

  return {
    metadata: file.data as DocMetadata,
    content: file.content,
  }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx")
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8")
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir)

  return mdxFiles.map<Doc>((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))

    const slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export const getAllDocs = cache(() => {
  return getMDXData(path.join(process.cwd(), "src/features/doc/content")).sort(
    (a, b) => {
      if (a.metadata.pinned && !b.metadata.pinned) return -1
      if (!a.metadata.pinned && b.metadata.pinned) return 1

      return (
        new Date(b.metadata.createdAt).getTime() -
        new Date(a.metadata.createdAt).getTime()
      )
    }
  )
})

export function getDocBySlug(slug: string) {
  return getAllDocs().find((doc) => doc.slug === slug)
}

export function getDocsByCategory(category: string) {
  return getAllDocs().filter((doc) => doc.metadata?.category === category)
}

export function findNeighbour(docs: Doc[], slug: string) {
  const len = docs.length

  for (let i = 0; i < len; ++i) {
    if (docs[i].slug === slug) {
      return {
        previous: i > 0 ? docs[i - 1] : null,
        next: i < len - 1 ? docs[i + 1] : null,
      }
    }
  }

  return { previous: null, next: null }
}
