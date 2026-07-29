import { blockCategories, registryConfig } from "@/config/registry"
import { SITE_INFO } from "@/config/site"
import { compareBlocksByCreatedAtDesc } from "@/lib/blocks"
import { blocks } from "@/registry/blocks/_registry"

const categorySections = blockCategories
  .map((category) => {
    const items = blocks
      .filter(
        (block) =>
          block.type === "registry:block" &&
          block.categories?.includes(category.name)
      )
      .sort(compareBlocksByCreatedAtDesc)

    return { category, items }
  })
  .filter(({ items }) => items.length > 0)

const totalBlocks = categorySections.reduce(
  (total, { items }) => total + items.length,
  0
)

const content = `# Blocks

> Beautifully designed, production-ready blocks for React, Next.js, Tailwind CSS, and shadcn/ui.

Install a block with the shadcn CLI: \`npx shadcn@latest add ${registryConfig.namespace}/<name>\`.

Each link below opens a live preview of the block. ${totalBlocks} blocks in total.

${categorySections
  .map(
    ({ category, items }) => `## ${category.title} (${items.length})

${category.description}

${items
  .map(
    (item) =>
      `- [${item.title ?? item.name}](${SITE_INFO.url}/blocks/${category.name}/${item.name}): ${item.description}`
  )
  .join("\n")}`
  )
  .join("\n\n")}
`

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
