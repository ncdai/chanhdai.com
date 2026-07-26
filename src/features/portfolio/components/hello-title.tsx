"use client"

import { useSyncExternalStore } from "react"

import { InlineScript } from "@/components/inline-script"
import { PanelTitle } from "@/features/portfolio/components/panel"

const ID = "hello"
const SSR_TEXT = "Hello"

export function HelloTitle() {
  // Server renders "Hello" for SEO; the client snapshot resolves the viewer's
  // local greeting, which also covers client-side navigation (no inline script).
  const greeting = useSyncExternalStore(
    () => () => {},
    getGreeting,
    () => SSR_TEXT
  )

  return (
    <>
      <PanelTitle
        id={`${ID}-greeting`}
        className="font-handwritten leading-none tracking-normal"
        suppressHydrationWarning
      >
        {greeting}
      </PanelTitle>

      <InlineScript html={getInlineScript(`${ID}-greeting`)} />
    </>
  )
}

// Self-contained (globals only) so it can be serialized via `.toString()` into
// the pre-hydration script as well as used as the client snapshot.
function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 0 && hour < 12) return "Good morning"
  if (hour >= 12 && hour < 17) return "Good afternoon"
  return "Good evening"
}

function runGreetingScript(elementId: string, compute: typeof getGreeting) {
  try {
    const el = document.getElementById(elementId)
    if (el) el.textContent = compute()
  } catch {}
}

// Blocking inline script that paints the greeting before hydration on the
// initial document load (Next.js "prevent flash before hydration").
function getInlineScript(elementId: string) {
  return `(${runGreetingScript.toString()})(${JSON.stringify(elementId)},${getGreeting.toString()})`
}
