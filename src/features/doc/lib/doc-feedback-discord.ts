import { absoluteUrl } from "@/lib/utils"
import type { DocFeedback } from "@/features/doc/lib/doc-feedback"

const EMBED_COLOR = {
  yes: 0x22c55e,
  no: 0xef4444,
} as const

export function buildDocFeedbackDiscordPayload(
  feedback: DocFeedback,
  receivedAt: Date
) {
  const path = `/${feedback.category}/${feedback.slug}`

  return {
    embeds: [
      {
        title: `Was this helpful? ${feedback.vote === "yes" ? "Yes" : "No"}`,
        url: absoluteUrl(path),
        description: feedback.message,
        color: EMBED_COLOR[feedback.vote],
        fields: [{ name: "Page", value: path }],
        timestamp: receivedAt.toISOString(),
      },
    ],
    // The note is visitor-provided text; never let it ping anyone.
    allowed_mentions: { parse: [] },
  }
}

export async function sendDocFeedbackToDiscord(
  webhookUrl: string,
  feedback: DocFeedback
) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildDocFeedbackDiscordPayload(feedback, new Date())),
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    throw new Error(
      `Discord webhook responded with ${response.status} ${response.statusText}`
    )
  }
}
