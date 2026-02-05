import { format } from "date-fns"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkMdx from "remark-mdx"

import type { Post } from "@/features/blog/types/post"
import { remarkComponent } from "@/lib/remark-component"

const processor = remark().use(remarkMdx).use(remarkComponent).use(remarkGfm)

export async function getLLMText(post: Post) {
  const processed = await processor.process({
    value: post.content,
  })

  return `# ${post.metadata.title}

${post.metadata.description}

${processed.value}

Last updated on ${format(new Date(post.metadata.updatedAt), "MMMM d, yyyy")}`
}
