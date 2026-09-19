import { RECOGNITION_BY_DATE } from "@/features/portfolio/data/recognition"
import type {
  AwardRecognition,
  CredentialRecognition,
} from "@/features/portfolio/types/recognition"

// Grouped by kind rather than one mixed list, so agents can answer
// "which certifications" without filtering; pinning is a home page concern.
const awards = RECOGNITION_BY_DATE.flatMap((entry) =>
  entry.kind === "award" ? [entry] : []
)
const certifications = RECOGNITION_BY_DATE.flatMap((entry) =>
  entry.kind === "certificate" ? [entry] : []
)
const intellectualProperty = RECOGNITION_BY_DATE.flatMap((entry) =>
  entry.kind === "trademark" || entry.kind === "copyright" ? [entry] : []
)

function formatAward({ award, date }: AwardRecognition) {
  const meta = [
    `Prize: ${award.prize}`,
    `Date: ${date}`,
    `Context: ${award.grade}`,
    award.referenceLink && `[Reference](${award.referenceLink})`,
  ]
    .filter(Boolean)
    .join(" | ")
  const description = award.description ? `\n\n${award.description.trim()}` : ""

  return `### ${award.title}\n\n${meta}${description}`
}

function formatCredential({ credential, date }: CredentialRecognition) {
  return `- [${credential.title}](${credential.credentialURL}): issued by ${credential.issuer} on ${date}`
}

const content = `# Recognition

> Awards, certifications, and the trademarks and copyrights registered under my name. Newest first within each group.

## Awards (${awards.length})

${awards.map(formatAward).join("\n\n")}

## Certifications (${certifications.length})

${certifications.map(formatCredential).join("\n")}

## Intellectual property (${intellectualProperty.length})

${intellectualProperty.map(formatCredential).join("\n")}
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
