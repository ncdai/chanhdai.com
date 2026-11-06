import { markdownResponse } from "@/lib/markdown-response"
import { EXPERIENCES } from "@/features/portfolio/data/experiences"

const content = `# Experience

${EXPERIENCES.map((item) =>
  item.positions
    .map((position) => {
      const skills = position.skills?.map((skill) => skill).join(", ") || "N/A"
      return `## ${position.title} | ${item.companyName}\n\nDuration: ${position.employmentPeriod.start} - ${position.employmentPeriod.end || "Present"}\n\nSkills: ${skills}\n\n${position.description?.trim()}`
    })
    .join("\n\n")
).join("\n\n")}
`

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  return markdownResponse(content)
}
