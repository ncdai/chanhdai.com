import { format } from "date-fns"
import { remarkHeading } from "fumadocs-core/mdx-plugins/remark-heading"
import { remarkAutoTypeTable } from "fumadocs-typescript"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkMdx from "remark-mdx"

import { generator } from "@/lib/auto-type-table"
import { remarkComponent } from "@/lib/remark-component"
import { withLicenseSection } from "@/features/doc/lib/component-license"
import type { Doc } from "@/features/doc/types/document"

const processor = remark()
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkHeading)
  .use(remarkComponent)
  .use(remarkAutoTypeTable, { name: "AutoTypeTable", generator })

export async function getLLMText(doc: Doc) {
  const processed = await processor.process({
    value:
      doc.metadata.category === "components"
        ? withLicenseSection(doc.content)
        : doc.content,
  })

  return `# ${doc.metadata.title}

${doc.metadata.description}

${processed.value}

Last updated on ${format(new Date(doc.metadata.updatedAt), "MMMM d, yyyy")}`
}
