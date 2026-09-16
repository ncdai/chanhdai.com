"use client"

import { ProgressProvider } from "@bprogress/next/app"
import { Provider as JotaiProvider } from "jotai"
import { ThemeProvider } from "next-themes"

import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ThemeProvider
        enableSystem
        disableTransitionOnChange
        enableColorScheme
        storageKey="theme"
        defaultTheme="system"
        attribute="class"
      >
        <ProgressProvider
          color="var(--foreground)"
          height="2px"
          delay={500}
          options={{ showSpinner: false }}
        >
          <TooltipProvider>{children}</TooltipProvider>

          <KeyboardShortcuts />
        </ProgressProvider>

        <Toaster />
      </ThemeProvider>
    </JotaiProvider>
  )
}
