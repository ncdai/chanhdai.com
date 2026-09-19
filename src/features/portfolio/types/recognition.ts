import type { Award } from "./awards"
import type { Certification } from "./certifications"

export type AwardRecognition = {
  kind: "award"
  key: string
  /** Raw source date: "YYYY-MM" or "YYYY". */
  date: string
  award: Award
}

export type CredentialRecognition = {
  kind: "certificate" | "trademark" | "copyright"
  key: string
  /** Raw source date: "YYYY-MM-DD". */
  date: string
  credential: Certification
}

export type RecognitionEntry = AwardRecognition | CredentialRecognition

export type RecognitionKind = RecognitionEntry["kind"]
