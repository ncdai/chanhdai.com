import { registryConfig } from "@/config/registry"
import { SITE_INFO } from "@/config/site"
import { getComponentDocs } from "@/features/doc/data/documents"

const allComponents = getComponentDocs()
  .slice()
  .sort((a, b) =>
    a.metadata.title.localeCompare(b.metadata.title, "en", {
      sensitivity: "base",
    })
  )

const content = `# Components

> Pixel-perfect, uniquely crafted components for React, Next.js, Tailwind CSS, and shadcn/ui.

Install a component with the shadcn CLI: \`npx shadcn@latest add ${registryConfig.namespace}/<name>\`.

Each link below returns the full documentation as Markdown. Drop the \`.md\` extension for the web page.

## All components (${allComponents.length})

${allComponents.map((item) => `- [${item.metadata.title}](${SITE_INFO.url}/components/${item.slug}.md): ${item.metadata.description}`).join("\n")}
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
