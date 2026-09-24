import { SITE_INFO } from "@/config/site"
import { getBlogPosts, getComponentDocs } from "@/features/doc/data/documents"

const allComponents = getComponentDocs()
const allPosts = getBlogPosts()

const content = `# chanhdai.com

> A pixel-perfect dev portfolio and shadcn registry showcasing my work as a Design Engineer.

- [About](${SITE_INFO.url}/about.md): A quick intro to me, my tech stack, and how to connect.
- [Experience](${SITE_INFO.url}/experience.md): Highlights from my career and key roles I've taken on.
- [Education](${SITE_INFO.url}/education.md): Where I studied, what I focused on, and what I built along the way.
- [Projects](${SITE_INFO.url}/projects.md): Selected projects that show my skills and creativity.
- [Recognition](${SITE_INFO.url}/recognition.md): Awards, certifications, and the trademarks and copyrights registered under my name.
- [Components](${SITE_INFO.url}/components.md): Every registry component, with install instructions.
- [Blocks](${SITE_INFO.url}/blocks.md): Every registry block, grouped by category, with install instructions.
- [Craft](${SITE_INFO.url}/craft.md): Interface and interaction demos, newest first, with links to their code and posts on X.
- [Blog](${SITE_INFO.url}/blog.md): Every blog post, newest first, with publish dates.
- [Bookmarks](${SITE_INFO.url}/bookmarks.md): Articles, courses, books, references, and tools I recommend.

## Components

${allComponents.map((item) => `- [${item.metadata.title}](${SITE_INFO.url}/components/${item.slug}.md): ${item.metadata.description}`).join("\n")}

## Blog

${allPosts.map((item) => `- [${item.metadata.title}](${SITE_INFO.url}/blog/${item.slug}.md): ${item.metadata.description}`).join("\n")}
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
