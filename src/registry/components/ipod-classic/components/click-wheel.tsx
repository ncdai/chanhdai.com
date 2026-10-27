"use client"

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react"
import { useAtomValue, useStore } from "jotai"

import styles from "../ipod-classic.module.css"
import {
  engineAtom,
  playbackAtom,
  scrollTargetAtom,
  seekAtom,
  selectHoldMsAtom,
} from "../lib/atoms"
import {
  HOLD_MS,
  HOLD_REPEAT_MS,
  KEY_REPEAT_DELAY_MS,
  KEY_REPEAT_INTERVAL_MS,
  SCROLL_WHEEL_PERCENT,
  SELECT_BUTTON_PERCENT,
} from "../lib/constants"
import type { IpodEngine } from "../lib/engine"
import { createHoldTimer } from "../lib/timers"
import type { ScrollTarget } from "../lib/types"
import { bindPressAndHold, bindWheelGesture } from "../lib/wheel-gesture"
import { MenuLabel, PlayPauseIcon, SkipIcon } from "./icons"

type Button = "menu" | "select" | "playPause" | "back" | "forward"
type HoldButton = Exclude<Button, "menu" | "playPause">

type KeyAction =
  | { kind: "scroll" | "steer"; step: 1 | -1 }
  | {
      kind: "hold"
      button: HoldButton
      duration?: number
      repeatInterval?: number
    }
  | { kind: "press"; button: Button }
  | { kind: "none" }

const LONG_PRESS: Record<
  HoldButton,
  (wheel: IpodEngine["wheel"], repeat: boolean) => void
> = {
  select: (wheel) => wheel.selectHold(),
  back: (wheel, repeat) => wheel.backHold(repeat),
  forward: (wheel, repeat) => wheel.forwardHold(repeat),
}

const isSkip = (button: Button) => button === "back" || button === "forward"

function keyAction(
  key: string,
  target: ScrollTarget,
  selectHoldMs: number | null
): KeyAction | undefined {
  switch (key) {
    case "ArrowUp":
    case "ArrowDown":
      if (target === "brick") return { kind: "none" }
      // Lists scroll down with ArrowDown; sliders go up with ArrowUp.
      return {
        kind: "scroll",
        step: key === (target === "list" ? "ArrowDown" : "ArrowUp") ? 1 : -1,
      }
    case "ArrowLeft":
    case "ArrowRight": {
      const isLeft = key === "ArrowLeft"
      if (target === "seek") return { kind: "scroll", step: isLeft ? -1 : 1 }
      if (target === "brick") return { kind: "steer", step: isLeft ? -1 : 1 }
      if (target === "volume") {
        return {
          kind: "hold",
          button: isLeft ? "back" : "forward",
          repeatInterval: HOLD_REPEAT_MS,
        }
      }
      return { kind: "press", button: isLeft ? "menu" : "select" }
    }
    case "Enter":
      return selectHoldMs === null
        ? { kind: "press", button: "select" }
        : { kind: "hold", button: "select", duration: selectHoldMs }
    case " ":
      return { kind: "press", button: "playPause" }
    case "Escape":
      return { kind: "press", button: "menu" }
  }
}

export function ClickWheel() {
  const store = useStore()
  const isPlaying = useAtomValue(playbackAtom).isPlaying
  const disableSkip = useAtomValue(seekAtom).isSeeking
  const ringRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const forwardRef = useRef<HTMLButtonElement>(null)
  const selectRef = useRef<HTMLButtonElement>(null)
  const isDraggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const keyRef = useRef<{
    key?: string
    action?: KeyAction
    pressedAt: number
    target?: ScrollTarget
    selectHoldMs?: number | null
    timer?: ReturnType<typeof createHoldTimer>
  }>({ pressedAt: 0 })

  // Listeners read the store directly, so they always see the current screen.
  const wheel = () => store.get(engineAtom)?.wheel
  const isSkipDisabled = () => store.get(seekAtom).isSeeking

  function press(button: Button) {
    if (isSkip(button) && isSkipDisabled()) return
    wheel()?.[button]()
  }

  function hold(button: HoldButton, repeat: boolean) {
    const handlers = wheel()
    if (!handlers || (isSkip(button) && isSkipDisabled())) return
    LONG_PRESS[button](handlers, repeat)
  }

  function focusRing() {
    if (matchMedia("(any-pointer: fine)").matches) {
      ringRef.current?.focus({ preventScroll: true })
    }
  }

  function cancelKey(commit: boolean) {
    const state = keyRef.current
    const { action } = state
    const didFire = state.timer?.stop() ?? false
    state.key = undefined
    state.action = undefined
    if (action?.kind === "scroll") {
      if (!isDraggingRef.current) wheel()?.dragEnd()
    } else if (action?.kind === "steer") {
      wheel()?.steer(null)
    } else if (
      (action?.kind === "press" || action?.kind === "hold") &&
      commit &&
      !didFire
    ) {
      press(action.button)
    }
  }

  function fireKey(repeat: boolean) {
    const state = keyRef.current
    // The screen changed under the held key, so it no longer means the same.
    if (
      store.get(scrollTargetAtom) !== state.target ||
      store.get(selectHoldMsAtom) !== state.selectHoldMs
    ) {
      cancelKey(false)
      return
    }
    const { action } = state
    if (action?.kind === "scroll") {
      wheel()?.keyScroll(action.step, performance.now() - state.pressedAt)
    } else if (action?.kind === "hold") {
      hold(action.button, repeat)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      cancelKey(false)
      return
    }
    const target = store.get(scrollTargetAtom)
    const selectHoldMs = store.get(selectHoldMsAtom)
    const action = keyAction(event.key, target, selectHoldMs)
    if (!action) return
    event.preventDefault()
    event.stopPropagation()
    const state = keyRef.current
    if (event.repeat || event.key === state.key) return

    cancelKey(false)
    Object.assign(state, {
      key: event.key,
      action,
      pressedAt: performance.now(),
      target,
      selectHoldMs,
    })
    state.timer ??= createHoldTimer(fireKey)

    if (action.kind === "scroll") {
      if (!isDraggingRef.current) wheel()?.dragStart()
      wheel()?.keyScroll(action.step, 0)
      state.timer.start(KEY_REPEAT_DELAY_MS, KEY_REPEAT_INTERVAL_MS)
    } else if (action.kind === "steer") {
      wheel()?.steer(action.step)
    } else if (action.kind === "hold") {
      state.timer.start(action.duration ?? HOLD_MS, action.repeatInterval)
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== keyRef.current.key) return
    event.preventDefault()
    event.stopPropagation()
    cancelKey(true)
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const isRealMouse =
      event.pointerType === "mouse" && (event.width > 0 || event.height > 0)
    if (isRealMouse) focusRing()
  }

  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return
    // A key-driven scroll already opened the drag, so it is not repeated.
    const setDragging = (dragging: boolean) => {
      isDraggingRef.current = dragging
      setIsDragging(dragging)
      if (keyRef.current.action?.kind === "scroll") return
      if (dragging) wheel()?.dragStart()
      else wheel()?.dragEnd()
    }
    return bindWheelGesture(ring, {
      excludeRadiusRatio: SELECT_BUTTON_PERCENT / SCROLL_WHEEL_PERCENT,
      onScroll: (scroll) => wheel()?.scroll(scroll),
      onDragStart: () => setDragging(true),
      onDragEnd: () => setDragging(false),
    })
    // `wheel` reads the store at call time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store])

  useEffect(() => {
    const buttons: [HTMLElement | null, HoldButton][] = [
      [backRef.current, "back"],
      [forwardRef.current, "forward"],
      [selectRef.current, "select"],
    ]
    const unbinds = buttons.map(([element, button]) => {
      if (!element) return
      return bindPressAndHold(element, () => {
        const selectHoldMs = store.get(selectHoldMsAtom)
        const isSelect = button === "select"
        return {
          duration: isSelect ? (selectHoldMs ?? HOLD_MS) : HOLD_MS,
          repeatInterval: isSkip(button) ? HOLD_REPEAT_MS : undefined,
          // Enter on Select is the wheel's own key, handled above.
          keyboard: !isSelect,
          disabled: isSelect && selectHoldMs === null,
          onLongPress: (repeat) => hold(button, repeat),
        }
      })
    })
    const keyState = keyRef.current
    return () => {
      unbinds.forEach((unbind) => unbind?.())
      keyState.timer?.stop()
    }
    // `hold` reads the store at call time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store])

  return (
    <div
      className={styles.clickWheel}
      data-dragging={isDragging || undefined}
      dir="ltr"
      tabIndex={-1}
      style={
        {
          "--select-button-pct": `${SELECT_BUTTON_PERCENT}%`,
          "--scroll-wheel-pct": `${SCROLL_WHEEL_PERCENT}%`,
        } as CSSProperties
      }
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={() => cancelKey(false)}
      onPointerUp={handlePointerUp}
    >
      <button
        type="button"
        className={`${styles.wheelButton} ${styles.menuButton}`}
        aria-label="Menu"
        onClick={() => press("menu")}
      >
        <MenuLabel />
      </button>
      <button
        ref={backRef}
        type="button"
        className={`${styles.wheelButton} ${styles.backButton}`}
        aria-label="Back"
        aria-disabled={disableSkip}
        onClick={() => press("back")}
      >
        <SkipIcon />
      </button>
      <button
        ref={forwardRef}
        type="button"
        className={`${styles.wheelButton} ${styles.forwardButton}`}
        aria-label="Forward"
        aria-disabled={disableSkip}
        onClick={() => press("forward")}
      >
        <SkipIcon />
      </button>
      <button
        type="button"
        className={`${styles.wheelButton} ${styles.playPauseButton}`}
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={() => press("playPause")}
      >
        <PlayPauseIcon />
      </button>
      <div className={styles.wheelDividers} />
      <div
        ref={ringRef}
        className={styles.scrollWheel}
        aria-hidden
        tabIndex={-1}
        onPointerDown={focusRing}
      />
      <button
        ref={selectRef}
        type="button"
        className={styles.selectButton}
        aria-label="Select"
        onClick={() => press("select")}
      />
    </div>
  )
}
