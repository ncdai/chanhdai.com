import { format } from "date-fns"

import { SITE_INFO } from "@/config/site"
import { CRAFTS } from "@/features/craft/data"

const content = `# Craft

> Building interfaces and interactions.

${CRAFTS.length} entries, newest first. They are also shown on ${SITE_INFO.url}/craft with their videos and images.

${CRAFTS.map((item) =>
  [
    `- ${item.description} (${format(new Date(item.createdAt), "yyyy-MM-dd")})`,
    `  ${item.media.type === "video" ? "Video" : "Image"}: ${item.media.src}`,
    item.registryHref && `  Code: ${SITE_INFO.url}${item.registryHref}`,
    item.xPostUrl && `  Post on X: ${item.xPostUrl}`,
  ]
    .filter(Boolean)
    .join("\n")
).join("\n")}
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
