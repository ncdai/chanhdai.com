"use server"

import {
  docFeedbackSchema,
  type DocFeedback,
  type DocFeedbackState,
} from "@/features/doc/lib/doc-feedback"
import { sendDocFeedbackToDiscord } from "@/features/doc/lib/doc-feedback-discord"

export async function sendDocFeedback(
  _previousState: DocFeedbackState,
  formData: FormData
): Promise<DocFeedbackState> {
  // Honeypot: the field is hidden from people, so a filled value means a bot.
  // Reply with success so the bot has nothing to learn from.
  if (formData.get("website")) {
    return { status: "success" }
  }

  const parsed = docFeedbackSchema.safeParse({
    category: formData.get("category"),
    slug: formData.get("slug"),
    vote: formData.get("vote"),
    message: formData.get("message"),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ?? "Something went wrong. Try again.",
    }
  }

  try {
    await deliverDocFeedback(parsed.data)
  } catch (error) {
    console.error("[doc-feedback] delivery failed", error)
    return {
      status: "error",
      message: "Your note could not be sent. Please try again later.",
    }
  }

  return { status: "success" }
}

async function deliverDocFeedback(feedback: DocFeedback) {
  const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK_URL

  if (webhookUrl) {
    await sendDocFeedbackToDiscord(webhookUrl, feedback)
    return
  }

  // Local development without the webhook still needs a visible result.
  if (process.env.NODE_ENV === "development") {
    console.log("[doc-feedback]", feedback)
    return
  }

  throw new Error("DISCORD_FEEDBACK_WEBHOOK_URL is not set")
}
