function isCoarsePointer() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(pointer: coarse)").matches
}

function isIOS() {
  if (typeof navigator === "undefined") return false
  // iPadOS 13+ reports MacIntel, so check touch points too
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  )
}

/**
 * Trigger haptic feedback on mobile devices.
 * Uses Vibration API on Android/modern browsers, and iOS checkbox trick on iOS.
 *
 * On iOS 26.5+ Apple patched the programmatic `label.click()` path
 * (WebKit #285120 / #309082, PR 38473). The imperative `haptic()` call
 * still works on iOS 17.4-26.4 inside a user gesture, but on 26.5+ it
 * only fires when the user directly taps a native switch control.
 * For reliable haptics on iOS 26.6 use the `data-haptic` overlay via
 * `setupHaptics()` — see below.
 *
 * @param pattern - Vibration duration (ms) or pattern.
 * Custom patterns only work on Android devices. iOS uses fixed feedback.
 * See [Vibration API](https://developer.mozilla.org/docs/Web/API/Vibration_API)
 *
 * @example
 * import { haptic } from "@/lib/haptic"
 *
 * <Button onClick={() => haptic()}>Haptic</Button>
 */
export function haptic(pattern: number | number[] = 50) {
  try {
    if (!isCoarsePointer()) return

    if ("vibrate" in navigator) {
      // Android / Blink - full pattern support
      navigator.vibrate(pattern)
      return
    }

    // iOS fallback - works on 17.4-26.4 when called synchronously
    // inside a click/touch handler. No-op on iOS 26.5+ via programmatic
    // click, use setupHaptics() overlay for that case.
    const label = document.createElement("label")
    label.ariaHidden = "true"
    label.style.display = "none"

    const input = document.createElement("input")
    input.type = "checkbox"
    input.setAttribute("switch", "")
    label.appendChild(input)

    try {
      document.body.appendChild(label)
      label.click()
    } finally {
      label.remove()
    }
  } catch {}
}

// --- iOS 26.5+ direct-tap overlay ---
// Apple now requires a real user tap on the native switch itself.
// We inject a transparent switch that fills each [data-haptic] host
// so the finger lands on the switch and the system haptic fires.
// Verified pattern from project-fathom / web-haptics #41.

const OVERLAY_MARKER = "data-haptic-overlay"

function attachOverlay(host: HTMLElement) {
  if (host.hasAttribute(OVERLAY_MARKER)) return
  if (getComputedStyle(host).position === "static") {
    host.style.position = "relative"
  }

  const input = document.createElement("input")
  input.type = "checkbox"
  input.setAttribute("switch", "")
  input.setAttribute("aria-hidden", "true")
  input.tabIndex = -1
  // keep native appearance - stripping it kills the haptic on iOS
  input.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;clip-path:inset(0 round 999px);-webkit-tap-highlight-color:transparent;touch-action:manipulation;cursor:pointer;"

  // re-dispatch so consumer onClick still runs when overlay is hit
  // (bubble covers most cases, but explicit dispatch keeps isTrusted handling consistent)
  input.addEventListener(
    "click",
    () => {
      // toggle back so next tap also triggers - switch is momentary
      setTimeout(() => {
        input.checked = false
      }, 0)
    },
    { passive: true }
  )

  host.setAttribute(OVERLAY_MARKER, "")
  host.appendChild(input)
}

export function setupHaptics(root: ParentNode = document) {
  if (typeof window === "undefined") return
  if (!isIOS()) return

  const scan = () => {
    const hosts = root.querySelectorAll<HTMLElement>("[data-haptic]")
    hosts.forEach(attachOverlay)
  }

  scan()

  // watch for dynamically added [data-haptic] nodes
  if (root === document) {
    const obs = new MutationObserver(scan)
    obs.observe(document.body, { childList: true, subtree: true })
  }
}

// auto-init on iOS so `data-haptic` attributes work without manual setup
if (typeof window !== "undefined" && isIOS()) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setupHaptics(), {
      once: true,
    })
  } else {
    // defer one tick so initial React hydration finishes
    setTimeout(() => setupHaptics(), 0)
  }
}
