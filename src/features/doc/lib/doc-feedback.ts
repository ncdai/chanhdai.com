import { z } from "zod"

export const DOC_FEEDBACK_MESSAGE_MAX_LENGTH = 1000

export const docFeedbackSchema = z.object({
  category: z.enum(["components", "blog"]),
  // Doc slugs come from MDX filenames, which are kebab-case.
  slug: z
    .string()
    .max(128)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  vote: z.enum(["yes", "no"]),
  message: z
    .string()
    .trim()
    .min(1, "Please write a short note before sending.")
    .max(
      DOC_FEEDBACK_MESSAGE_MAX_LENGTH,
      `Please keep your note under ${DOC_FEEDBACK_MESSAGE_MAX_LENGTH} characters.`
    ),
})

export type DocFeedback = z.infer<typeof docFeedbackSchema>

export type DocFeedbackVote = DocFeedback["vote"]

export type DocFeedbackState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string }
