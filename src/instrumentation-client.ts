import posthog from "posthog-js"

// Initialize PostHog only in production environment with valid API key
if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST,
    defaults: "2025-05-24",
    cookieless_mode: "on_reject",
  })
  posthog.has_opted_out_capturing() // Avoids accidental tracking without consent till c15t has loaded
}
