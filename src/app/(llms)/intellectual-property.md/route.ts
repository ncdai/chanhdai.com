import { INTELLECTUAL_PROPERTY } from "@/features/portfolio/data/intellectual-property"

const content = `# Intellectual property

${INTELLECTUAL_PROPERTY.map((item) => `- [${item.title}](${item.credentialURL})`).join("\n")}
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
