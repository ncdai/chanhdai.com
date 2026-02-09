"use client"

import { ClientSideOptionsProvider } from "@c15t/nextjs/client"

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
            // Enable measurement tracking
          } else {
            // Disable measurement tracking
          }
        },
      }}
    >
      {children}
    </ClientSideOptionsProvider>
  )
}
