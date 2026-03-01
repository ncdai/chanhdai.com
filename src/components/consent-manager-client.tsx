"use client"

import { ClientSideOptionsProvider } from "@c15t/nextjs/client"
import { posthog } from "posthog-js"

import { op } from "@/lib/openpanel"

export function ConsentManagerClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientSideOptionsProvider
      callbacks={{
        onConsentSet({ preferences }) {
          if (preferences.measurement) {
            posthog.opt_in_capturing()
            op.options.disabled = false
            op.options.sessionReplay = {
              enabled: true,
            }
          } else {
            posthog.opt_out_capturing()
            op.options.disabled = true
            op.options.sessionReplay = {
              enabled: false,
            }
          }
        },
      }}
    >
      {children}
    </ClientSideOptionsProvider>
  )
}
