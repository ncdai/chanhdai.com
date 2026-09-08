import type { AvatarLightsVariants } from "@/features/portfolio/components/avatar-lights"

export type User = {
  firstName: string
  lastName: string
  /** Preferred public-facing name */
  displayName: string
  /** Handle/username used in links or mentions */
  username: string
  gender: "male" | "female" | "non-binary"
  /** e.g. "he/him", "she/her", "they/them" */
  pronouns: string
  bio: string
  /** Short phrases rotated in UI (e.g., homepage flip effect) */
  flipSentences: string[]
  /** General location for display */
  address: string
  /** E.164 format, base64 encoded (https://t.io.vn/base64-string-converter) */
  phoneNumberB64: string
  /** base64 encoded (https://t.io.vn/base64-string-converter) */
  emailB64: string
  /** Personal/homepage URL */
  website: string
  /** URL to resume, e.g. "/resume.pdf" */
  resumeUrl?: string
  /** Primary/current role shown on profile */
  jobTitle: string
  /** Work history entries */
  jobs: {
    title: string
    company: string
    website: string
    experienceId?: string
  }[]
  /** Rich about section; supports Markdown */
  about: string
  /** Public URL to avatar image */
  avatar: string
  /** Different avatar variants based on theme and lighting */
  avatarVariants: AvatarLightsVariants
  /** Open Graph image URL for social sharing */
  ogImage: string
  /** Audio URL for name pronunciation */
  namePronunciationUrl: string
  /** SEO keywords list for metadata */
  keywords: string[]
  /** Time zone in IANA format (e.g., "Asia/Ho_Chi_Minh") */
  timeZone: string
  /** Profile/site start date in YYYY-MM-DD */
  dateCreated: string
}
