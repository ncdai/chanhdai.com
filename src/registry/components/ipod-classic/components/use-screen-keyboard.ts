import { useRef, type KeyboardEvent } from "react"
import { useStore } from "jotai"

import { wheelSpeed } from "../lib/acceleration"
import { engineAtom, isInertAtom, viewAtom } from "../lib/atoms"
import { KEY_ARROW_STEP_DEGREES } from "../lib/constants"

const SCREEN_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "ArrowRight",
  "ArrowLeft",
  "Enter",
  " ",
  "Escape",
])

const SLIDER_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "ArrowRight",
  "ArrowLeft",
  "Home",
  "End",
  "PageUp",
  "PageDown",
])

/** Key repeat never counts as a fast spin, so arrows move one row. */
const MAX_ARROW_SPEED = 180

function consume(event: KeyboardEvent) {
  event.preventDefault()
  event.stopPropagation()
}

/**
 * Keys while a list or Now Playing has focus: arrows move, Enter and Space
 * select, Escape goes back when released.
 */
export function useScreenKeyboard() {
  const store = useStore()
  const stateRef = useRef<{ isEscapeDown: boolean; lastArrowTime?: number }>({
    isEscapeDown: false,
  })

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const engine = store.get(engineAtom)
    const view = store.get(viewAtom)
    if (!engine || view === "brick") return

    if (store.get(isInertAtom)) {
      if (SCREEN_KEYS.has(event.key) || SLIDER_KEYS.has(event.key)) {
        consume(event)
      }
      return
    }

    // Sliders and the song link keep their own keys on Now Playing.
    if (view === "now-playing" && event.key !== "Escape") {
      const { target } = event
      const isNative =
        (target instanceof HTMLInputElement && SLIDER_KEYS.has(event.key)) ||
        (target instanceof HTMLAnchorElement && event.key === "Enter")
      if (isNative) event.stopPropagation()
      else if (SCREEN_KEYS.has(event.key)) consume(event)
      return
    }

    const state = stateRef.current
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        consume(event)
        const direction = event.key === "ArrowDown" ? 1 : -1
        const elapsed =
          state.lastArrowTime === undefined
            ? 0
            : event.timeStamp - state.lastArrowTime
        state.lastArrowTime = event.timeStamp
        const speed = Math.min(
          wheelSpeed(KEY_ARROW_STEP_DEGREES, elapsed),
          MAX_ARROW_SPEED
        )
        engine.menu.move(direction, engine.menu.accelerate(speed, direction))
        break
      }
      case "ArrowLeft":
      case "ArrowRight":
        consume(event)
        break
      case "Enter":
      case " ":
        consume(event)
        if (!event.repeat) engine.wheel.select()
        break
      case "Escape":
        consume(event)
        if (!event.repeat) state.isEscapeDown = true
        break
    }
  }

  function onKeyUp(event: KeyboardEvent<HTMLElement>) {
    const state = stateRef.current
    if (event.key !== "Escape" || !state.isEscapeDown) return
    state.isEscapeDown = false
    store.get(engineAtom)?.wheel.menu()
  }

  function onBlur() {
    stateRef.current.isEscapeDown = false
  }

  return { onKeyDown, onKeyUp, onBlur }
}
