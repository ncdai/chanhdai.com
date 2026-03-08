"use client"

import { AppProgressProvider } from "@bprogress/next"
import { Provider as JotaiProvider } from "jotai"
import { ThemeProvider } from "next-themes"

import { TooltipProvider as BaseTooltipProvider } from "@/components/base/ui/tooltip"
import { TooltipProvider as RadixTooltipProvider } from "@/components/ui/tooltip"

import { Toaster } from "./ui/sonner"

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
        <AppProgressProvider
          color="var(--foreground)"
          height="2px"
          delay={500}
          options={{ showSpinner: false }}
        >
          <BaseTooltipProvider>
            <RadixTooltipProvider>{children}</RadixTooltipProvider>
          </BaseTooltipProvider>
        </AppProgressProvider>

        <Toaster position="top-center" />
      </ThemeProvider>
    </JotaiProvider>
  )
}
