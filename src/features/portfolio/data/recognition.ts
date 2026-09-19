import { compareDesc } from "date-fns"

import type { RecognitionEntry } from "../types/recognition"
import { AWARDS } from "./awards"
import { CERTIFICATIONS } from "./certifications"
import { INTELLECTUAL_PROPERTY } from "./intellectual-property"

/**
 * Entry keys shown first, in this order, so the strongest items stay above
 * the fold instead of sinking under newer but lesser entries.
 */
export const RECOGNITION_PINNED_KEYS = [
  "1b4db7eb-4057-5ddf-91e0-36dec72071f5", // Claude for Open Source Program
  "05e1c61b-6dc1-11f0-8000-679dd01e0504", // Vercel OSS Program
]

/**
 * Awards, certifications, and IP registrations merged into one list, newest
 * first. Date ties keep source order (awards, then certifications, then IP).
 */
export const RECOGNITION_BY_DATE: RecognitionEntry[] = [
  ...AWARDS.map((award) => ({
    kind: "award" as const,
    key: award.id,
    date: award.date,
    award,
  })),
  ...CERTIFICATIONS.map((credential) => ({
    kind: "certificate" as const,
    key: credential.credentialURL,
    date: credential.issueDate,
    credential,
  })),
  ...INTELLECTUAL_PROPERTY.map((credential) => ({
    // IP entries already name their registration kind for the icon lookup.
    kind:
      credential.issuerIconName === "copyright"
        ? ("copyright" as const)
        : ("trademark" as const),
    key: credential.credentialURL,
    date: credential.issueDate,
    credential,
  })),
].sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

/** Home page order: pinned entries first, then the rest newest first. */
export const RECOGNITION = pinFirst(
  RECOGNITION_BY_DATE,
  RECOGNITION_PINNED_KEYS
)

function pinFirst(entries: RecognitionEntry[], keys: string[]) {
  const pinned = keys.flatMap((key) =>
    entries.filter((entry) => entry.key === key)
  )

  return [...pinned, ...entries.filter((entry) => !keys.includes(entry.key))]
}
