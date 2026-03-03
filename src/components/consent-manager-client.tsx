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
            op.ready()
          } else {
            posthog.opt_out_capturing()
          }
        },
      }}
    >
      {children}
    </ClientSideOptionsProvider>
  )
}
