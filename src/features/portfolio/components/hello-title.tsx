"use client"

import { useId, useSyncExternalStore } from "react"

import { InkFilter } from "@/components/ink-filter"
import { InlineScript } from "@/components/inline-script"
import { PanelTitle } from "@/features/portfolio/components/panel"

const ID = "hello"
const SSR_TEXT = "Hello"

export function HelloTitle() {
  const inkId = useId()

  // Server renders "Hello"; the client snapshot resolves the viewer's local
  // greeting, which also covers client-side navigation (no inline script).
  const greeting = useSyncExternalStore(
    () => () => {},
    getGreeting,
    () => SSR_TEXT
  )

  return (
    <>
      {/* Sibling, not child: the inline script replaces the title's
          textContent, which would remove the filter before hydration. */}
      <InkFilter id={inkId} />

      <PanelTitle
        as="div"
        id={`${ID}-greeting`}
        className="font-handwritten leading-none"
        style={{ filter: `url(#${inkId})` }}
        aria-hidden
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
