import { wheelSpeed } from "./acceleration"

/** Reversing direction needs this much travel, so jitter does not tick back. */
const REVERSE_THRESHOLD_DEGREES = 8
/** Moves that pass this close to the center have no reliable angle. */
const CENTER_DEAD_ZONE = 0.1

export type WheelScroll = {
  step: 1 | -1
  degrees: number
  /** Degrees per second. */
  speed: number
}

type Point = { x: number; y: number }

const angleOf = ({ x, y }: Point) => (Math.atan2(y, x) * 180) / Math.PI

/** Shortest signed turn from `from` to `to`, in -180..180. */
function angleDelta(from: number, to: number) {
  return ((((to - from) % 360) + 540) % 360) - 180
}

/** Squared distance from the center to the segment a to b. */
function segmentDistanceSquared(a: Point, b: Point) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lengthSquared = dx * dx + dy * dy
  const t =
    lengthSquared === 0
      ? 0
      : Math.min(1, Math.max(0, -(a.x * dx + a.y * dy) / lengthSquared))
  const x = a.x + t * dx
  const y = a.y + t * dy
  return x * x + y * y
}

/**
 * Tracks a finger circling the wheel ring. Presses inside
 * `excludeRadiusRatio` belong to the Select button and are ignored.
 */
export function bindWheelGesture(
  element: HTMLElement,
  options: {
    excludeRadiusRatio: number
    onScroll: (scroll: WheelScroll) => void
    onDragStart: () => void
    onDragEnd: () => void
  }
) {
  let pointerId: number | undefined
  let lastOffset: Point | undefined
  let lastTime: number | undefined
  let direction: 1 | -1 | undefined
  let reverseTravel = 0

  function locate(event: PointerEvent) {
    const rect = element.getBoundingClientRect()
    const radius = Math.min(rect.width, rect.height) / 2
    const inner = radius * options.excludeRadiusRatio
    const offset = {
      x: event.clientX - (rect.left + rect.width / 2),
      y: event.clientY - (rect.top + rect.height / 2),
    }
    const distanceSquared = offset.x * offset.x + offset.y * offset.y
    return {
      offset,
      radius,
      // The epsilon keeps a point exactly on the rim inside.
      withinRing:
        distanceSquared <= radius * radius + 1e-6 &&
        distanceSquared >= inner * inner,
    }
  }

  function handleDown(event: PointerEvent) {
    if (pointerId !== undefined) return
    const { offset, withinRing } = locate(event)
    if (!withinRing) return
    pointerId = event.pointerId
    lastOffset = offset
    lastTime = event.timeStamp
    element.setPointerCapture?.(pointerId)
    options.onDragStart()
  }

  function handleMove(event: PointerEvent) {
    if (
      event.pointerId !== pointerId ||
      lastOffset === undefined ||
      lastTime === undefined
    ) {
      return
    }
    const { offset, radius } = locate(event)
    const previous = lastOffset
    const elapsed = event.timeStamp - lastTime
    lastOffset = offset
    lastTime = event.timeStamp

    const deadZone = radius * CENTER_DEAD_ZONE
    if (segmentDistanceSquared(previous, offset) < deadZone * deadZone) return

    const delta = angleDelta(angleOf(previous), angleOf(offset))
    if (delta === 0) return
    const step = delta > 0 ? 1 : -1
    const degrees = Math.abs(delta)

    if (direction === undefined || step === direction) {
      direction = step
      reverseTravel = 0
    } else {
      reverseTravel += degrees
      if (reverseTravel < REVERSE_THRESHOLD_DEGREES) return
      direction = step
      reverseTravel = 0
    }

    options.onScroll({
      step: direction,
      degrees,
      speed: wheelSpeed(degrees, elapsed),
    })
  }

  function handleUp(event: PointerEvent) {
    if (event.pointerId !== pointerId) return
    element.releasePointerCapture?.(pointerId)
    pointerId = undefined
    lastOffset = undefined
    lastTime = undefined
    direction = undefined
    reverseTravel = 0
    options.onDragEnd()
  }

  element.addEventListener("pointerdown", handleDown)
  element.addEventListener("pointermove", handleMove)
  element.addEventListener("pointerup", handleUp)
  element.addEventListener("pointercancel", handleUp)
  element.addEventListener("lostpointercapture", handleUp)

  return () => {
    element.removeEventListener("pointerdown", handleDown)
    element.removeEventListener("pointermove", handleMove)
    element.removeEventListener("pointerup", handleUp)
    element.removeEventListener("pointercancel", handleUp)
    element.removeEventListener("lostpointercapture", handleUp)
  }
}

const HOLD_KEYS = ["Enter", " "]

/**
 * Fires `onLongPress` after `duration` (then every `repeatInterval`) while a
 * button is held by pointer or Enter/Space. The click that ends a long press
 * is swallowed so it does not also count as a tap.
 */
export function bindPressAndHold(
  element: HTMLElement,
  getOptions: () => {
    duration: number
    repeatInterval?: number
    disabled?: boolean
    keyboard?: boolean
    onLongPress: (repeat: boolean) => void
  }
) {
  let pointerId: number | undefined
  let heldKey: string | undefined
  let swallowClick = false
  let fired = false
  let timeout: ReturnType<typeof setTimeout> | undefined
  let interval: ReturnType<typeof setInterval> | undefined

  function stopTimer() {
    clearTimeout(timeout)
    clearInterval(interval)
    timeout = undefined
    interval = undefined
    const didFire = fired
    fired = false
    return didFire
  }

  function startTimer() {
    stopTimer()
    swallowClick = false
    const { duration, repeatInterval } = getOptions()
    timeout = setTimeout(() => {
      timeout = undefined
      fired = true
      if (pointerId !== undefined) swallowClick = true
      getOptions().onLongPress(false)
      if (repeatInterval !== undefined) {
        interval = setInterval(
          () => getOptions().onLongPress(true),
          repeatInterval
        )
      }
    }, duration)
  }

  function reset() {
    stopTimer()
    pointerId = undefined
    heldKey = undefined
  }

  const isHeld = () => pointerId !== undefined || heldKey !== undefined

  function handlePointerDown(event: PointerEvent) {
    if (
      getOptions().disabled ||
      !event.isPrimary ||
      event.button !== 0 ||
      isHeld()
    ) {
      return
    }
    pointerId = event.pointerId
    if (element.hasPointerCapture?.(event.pointerId)) {
      element.releasePointerCapture(event.pointerId)
    }
    startTimer()
  }

  function handlePointerUp(event: PointerEvent) {
    if (event.pointerId !== pointerId) return
    pointerId = undefined
    stopTimer()
  }

  function handlePointerCancel(event: PointerEvent) {
    if (event.pointerId === pointerId) reset()
  }

  function handleContextMenu(event: Event) {
    if (pointerId !== undefined) event.preventDefault()
  }

  function handleKeyDown(event: KeyboardEvent) {
    const options = getOptions()
    if (options.disabled || options.keyboard === false) return
    if (!HOLD_KEYS.includes(event.key)) return
    event.preventDefault()
    event.stopPropagation()
    if (event.repeat || isHeld()) return
    heldKey = event.key
    startTimer()
  }

  function handleKeyUp(event: KeyboardEvent) {
    const options = getOptions()
    if (options.disabled || options.keyboard === false) return
    if (!HOLD_KEYS.includes(event.key)) return
    event.preventDefault()
    event.stopPropagation()
    if (event.key !== heldKey) return
    heldKey = undefined
    if (!stopTimer()) element.click()
  }

  function handleBlur() {
    if (heldKey !== undefined) reset()
  }

  function handleWindowPointerDown() {
    swallowClick = false
  }

  function handleWindowClick(event: MouseEvent) {
    if (!swallowClick) return
    const [target] = event.composedPath()
    if (
      !(target instanceof Node) ||
      !(element.contains(target) || target.contains(element))
    ) {
      return
    }
    swallowClick = false
    event.stopImmediatePropagation()
    event.preventDefault()
  }

  element.addEventListener("pointerdown", handlePointerDown)
  element.addEventListener("pointerup", handlePointerUp)
  element.addEventListener("pointercancel", handlePointerCancel)
  element.addEventListener("pointerleave", handlePointerCancel)
  element.addEventListener("contextmenu", handleContextMenu)
  element.addEventListener("keydown", handleKeyDown)
  element.addEventListener("keyup", handleKeyUp)
  element.addEventListener("blur", handleBlur)
  window.addEventListener("blur", reset)
  window.addEventListener("pointerdown", handleWindowPointerDown, true)
  window.addEventListener("click", handleWindowClick, true)

  return () => {
    reset()
    element.removeEventListener("pointerdown", handlePointerDown)
    element.removeEventListener("pointerup", handlePointerUp)
    element.removeEventListener("pointercancel", handlePointerCancel)
    element.removeEventListener("pointerleave", handlePointerCancel)
    element.removeEventListener("contextmenu", handleContextMenu)
    element.removeEventListener("keydown", handleKeyDown)
    element.removeEventListener("keyup", handleKeyUp)
    element.removeEventListener("blur", handleBlur)
    window.removeEventListener("blur", reset)
    window.removeEventListener("pointerdown", handleWindowPointerDown, true)
    window.removeEventListener("click", handleWindowClick, true)
  }
}
