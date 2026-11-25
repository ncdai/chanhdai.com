"use client"

import {
  createContext,
  use,
  useCallback,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import type { ComponentProps, RefCallback } from "react"
import { animate, motionValue, useReducedMotion } from "motion/react"
import type { AnimationPlaybackControls, Transition } from "motion/react"

import { cn } from "@/lib/utils"

const ITEM_SELECTOR = '[data-slot="cover-flow-item"]'
const REST_TIMEOUT = 120
const DRAG_THRESHOLD = 4
// The deceleration of an iOS scroll view, so a flicked drag lands where a swipe would
const DECELERATION_RATE = 0.998
const GLIDE: Transition = { type: "spring", bounce: 0, visualDuration: 0.4 }

type CoverFlowScroller = {
  sync: (value: string | null, animate: boolean) => void
  destroy: () => void
}

type CoverFlowScrollerOptions = {
  onSelect: (value: string) => void
  shouldReduceMotion: () => boolean
}

/**
 * Picks by scrolling: the item at the center is the value. Scrolling or
 * dragging selects each item as it passes the center and settles on the
 * nearest one when it stops. Arrow keys, Home, and End step through the
 * items. Each item gets `--cover-flow-offset`, its distance from the center
 * in items, for the CSS to draw the stack.
 */
function bindScroller(
  list: HTMLElement,
  { onSelect, shouldReduceMotion }: CoverFlowScrollerOptions
): CoverFlowScroller {
  const supportsScrollEnd = "onscrollend" in list
  // Drives every scroll the component makes, a drag or a glide, and tracks its velocity
  const scrollX = motionValue(0)
  let items: HTMLElement[] = []
  let centers: number[] = []
  let painted: string[] = []
  let position = 0
  let selected = -1
  // The last scroll position the component wrote; scroll events elsewhere are the user's
  let written: number | null = null
  let glide: AnimationPlaybackControls | null = null
  let scrolling = false
  let touching = false
  let restMissed = false
  let frame = 0
  let restTimer = 0
  let drag: {
    id: number
    from: number
    scroll: number
    moved: boolean
    interrupted: boolean
  } | null = null

  const viewSize = () => list.clientWidth
  const maxScroll = () => list.scrollWidth - list.clientWidth
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max)

  function writeScroll(x: number) {
    written = x
    list.scrollLeft = x
  }

  const unsubscribe = scrollX.on("change", writeScroll)

  function measure() {
    items = [...list.querySelectorAll<HTMLElement>(ITEM_SELECTOR)]
    painted = []
    for (const item of items) {
      if (observed.has(item)) continue
      observed.add(item)
      resizes.observe(item)
    }
    // Offsets share scrollLeft's coordinates, unlike client rects under CSS zoom
    centers = items.map((item) => item.offsetLeft + item.offsetWidth / 2)
  }

  // Fractional index at `at`: 2 at the third item's center, 2.5 halfway to the fourth
  function positionAt(at: number) {
    const last = centers.length - 1
    if (last < 1) return 0
    const spacing = (centers[last] - centers[0]) / last
    return spacing > 0 ? (at - centers[0]) / spacing : 0
  }

  function paint() {
    frame = 0
    const at = list.scrollLeft + viewSize() / 2
    position = positionAt(at)
    const nearest = Math.round(position)
    if (Math.abs((centers[nearest] ?? Infinity) - at) < 1) position = nearest
    items.forEach((item, index) => {
      const offset = String(Math.round((index - position) * 1000) / 1000)
      if (painted[index] === offset) return
      painted[index] = offset
      item.style.setProperty("--cover-flow-offset", offset)
    })
  }

  function select(index: number) {
    selected = index
    const value = items[index]?.dataset.value
    if (value !== undefined) onSelect(value)
  }

  // Snapping would pull every frame of a drag or glide back to the nearest
  // item. It stays off until the list settles on one, so a glide the user
  // stops is not yanked to the nearest item under their pointer or finger.
  function pauseSnap() {
    list.style.setProperty("scroll-snap-type", "none")
  }

  function resumeSnap() {
    list.style.removeProperty("scroll-snap-type")
  }

  function stopGlide() {
    glide?.stop()
    glide = null
  }

  function centerOn(index: number, animated = true, velocity = 0) {
    const to = clamp(centers[index] - viewSize() / 2, 0, maxScroll())
    stopGlide()
    if (Math.abs(to - list.scrollLeft) < 1) return resumeSnap()
    if (!animated || shouldReduceMotion()) {
      writeScroll(to)
      return resumeSnap()
    }
    pauseSnap()
    scrollX.jump(list.scrollLeft)
    glide = animate(scrollX, to, {
      ...GLIDE,
      velocity,
      onComplete: () => {
        glide = null
        resumeSnap()
      },
    })
  }

  function settle(at: number, velocity = 0) {
    if (!items.length) return
    const index = clamp(Math.round(at), 0, items.length - 1)
    if (index !== selected) select(index)
    centerOn(index, true, velocity)
  }

  function follow() {
    paint()
    if (glide || !scrolling || !items.length) return
    const index = clamp(Math.round(position), 0, items.length - 1)
    if (index !== selected) select(index)
  }

  function onScroll() {
    const ours = written !== null && Math.abs(list.scrollLeft - written) < 1
    if (!ours) {
      stopGlide()
      written = null
      scrolling = true
      waitForRest()
    }
    frame ||= window.requestAnimationFrame(follow)
  }

  function waitForRest() {
    window.clearTimeout(restTimer)
    if (!supportsScrollEnd) {
      restTimer = window.setTimeout(onRest, REST_TIMEOUT)
    }
  }

  function onRest() {
    window.clearTimeout(restTimer)
    if (!scrolling || drag?.moved) return
    // A finger still on the screen can scroll again, so wait for it to lift
    if (touching) {
      restMissed = true
      return
    }
    scrolling = false
    paint()
    settle(position)
  }

  // The user took over mid-glide, so wherever the list stops is theirs to
  // settle, even when no scroll follows
  function interrupt() {
    if (!glide) return
    stopGlide()
    written = null
    scrolling = true
    window.clearTimeout(restTimer)
    restTimer = window.setTimeout(onRest, REST_TIMEOUT)
  }

  function onTouchStart() {
    touching = true
    restMissed = false
    interrupt()
  }

  function onTouchEnd() {
    touching = false
    if (!restMissed) return
    restMissed = false
    onRest()
  }

  // Touch scrolls natively; a mouse has no way to scroll sideways but a drag
  function onPointerDown(event: PointerEvent) {
    if (event.pointerType === "touch" || event.button !== 0 || drag) return
    const interrupted = glide !== null
    stopGlide()
    drag = {
      id: event.pointerId,
      from: event.clientX,
      scroll: list.scrollLeft,
      moved: false,
      interrupted,
    }
    document.addEventListener("pointermove", onPointerMove, true)
    document.addEventListener("pointerup", onPointerUp, true)
    document.addEventListener("pointercancel", onPointerUp, true)
  }

  function onPointerMove(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.id) return
    if (!drag.moved) {
      if (Math.abs(event.clientX - drag.from) < DRAG_THRESHOLD) return
      drag.moved = true
      scrolling = true
      pauseSnap()
      scrollX.jump(list.scrollLeft)
      try {
        list.setPointerCapture(event.pointerId)
      } catch {
        // The pointer may already be gone
      }
    }
    scrollX.set(drag.scroll - (event.clientX - drag.from))
  }

  function onPointerUp(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.id) return
    const { moved, interrupted } = drag
    drag = null
    removeDragListeners()
    if (!moved) {
      // A press that stopped a glide lands on the nearest item; a click on a
      // cover then moves on to that cover
      if (interrupted) {
        paint()
        settle(position)
      }
      return
    }
    swallowNextClick()
    scrolling = false
    // px/s, and 0 when the pointer rested before letting go
    const velocity = event.type === "pointercancel" ? 0 : scrollX.getVelocity()
    const coast = clamp(
      list.scrollLeft +
        ((velocity / 1000) * DECELERATION_RATE) / (1 - DECELERATION_RATE),
      0,
      maxScroll()
    )
    settle(positionAt(coast + viewSize() / 2), velocity)
  }

  function removeDragListeners() {
    document.removeEventListener("pointermove", onPointerMove, true)
    document.removeEventListener("pointerup", onPointerUp, true)
    document.removeEventListener("pointercancel", onPointerUp, true)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.target !== list || !items.length) return
    const from = selected !== -1 ? selected : Math.round(position)
    const steps: Record<string, number> = {
      ArrowLeft: from - 1,
      ArrowRight: from + 1,
      Home: 0,
      End: items.length - 1,
    }
    const to = steps[event.key]
    if (to === undefined) return
    event.preventDefault()
    settle(to)
  }

  function onResize() {
    measure()
    if (selected !== -1 && !isBusy()) centerOn(selected, false)
    paint()
  }

  function onItemsChange() {
    const value = items[selected]?.dataset.value
    measure()
    selected = items.findIndex((item) => item.dataset.value === value)
    paint()
  }

  const isBusy = () => scrolling || touching || !!drag?.moved

  // Items too, since their size can change while the list keeps its own
  const resizes = new ResizeObserver(onResize)
  const observed = new WeakSet<HTMLElement>()
  const mutations = new MutationObserver(onItemsChange)

  measure()
  paint()
  // The border box, since the padding absorbs width changes and the content box never resizes
  resizes.observe(list, { box: "border-box" })
  mutations.observe(list, { childList: true, subtree: true })

  list.addEventListener("scroll", onScroll, { passive: true })
  if (supportsScrollEnd) list.addEventListener("scrollend", onRest)
  // A wheel turned mid-glide would otherwise be overwritten by the next frame
  list.addEventListener("wheel", interrupt, { passive: true })
  list.addEventListener("touchstart", onTouchStart, { passive: true })
  list.addEventListener("touchend", onTouchEnd, { passive: true })
  list.addEventListener("touchcancel", onTouchEnd, { passive: true })
  list.addEventListener("pointerdown", onPointerDown)
  list.addEventListener("keydown", onKeyDown)

  return {
    // Centers the value the component selected itself, from a click, a key, or
    // a controlled `value`; values picked by scrolling are already in place
    sync(value, animate) {
      const index = items.findIndex((item) => item.dataset.value === value)
      if (index === -1 || index === selected || isBusy()) return
      selected = index
      centerOn(index, animate)
    },
    destroy() {
      list.removeEventListener("scroll", onScroll)
      list.removeEventListener("scrollend", onRest)
      list.removeEventListener("wheel", interrupt)
      list.removeEventListener("touchstart", onTouchStart)
      list.removeEventListener("touchend", onTouchEnd)
      list.removeEventListener("touchcancel", onTouchEnd)
      list.removeEventListener("pointerdown", onPointerDown)
      list.removeEventListener("keydown", onKeyDown)
      removeDragListeners()
      resizes.disconnect()
      mutations.disconnect()
      stopGlide()
      resumeSnap()
      unsubscribe()
      window.cancelAnimationFrame(frame)
      window.clearTimeout(restTimer)
      for (const item of items) item.style.removeProperty("--cover-flow-offset")
    },
  }
}

// The click that ends a drag must not select the cover under the pointer
function swallowNextClick() {
  const swallow = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }
  document.addEventListener("click", swallow, { capture: true, once: true })
  window.setTimeout(() => {
    document.removeEventListener("click", swallow, { capture: true })
  })
}

const subscribeNothing = () => () => {}

function useIsHydrated() {
  return useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  )
}

type CoverFlowContextValue = {
  baseId: string
  selectedValue: string | null
  hydrated: boolean
  select: (value: string) => void
}

const CoverFlowContext = createContext<CoverFlowContextValue | null>(null)

function useCoverFlow() {
  const context = use(CoverFlowContext)
  if (!context) {
    throw new Error("CoverFlow parts must be used within <CoverFlow>")
  }
  return context
}

const CoverFlowItemContext = createContext<boolean | null>(null)

function useCoverFlowItemSelected() {
  const selected = use(CoverFlowItemContext)
  if (selected === null) {
    throw new Error("CoverFlowItem parts must be used within <CoverFlowItem>")
  }
  return selected
}

function getItemId(baseId: string, value: string) {
  return `${baseId}-${value.replace(/\s+/g, "-")}`
}

export type CoverFlowProps = Omit<ComponentProps<"div">, "defaultValue"> & {
  /** The item at the center. */
  value?: string | null
  /** The item at the center on first render, when `value` is not controlled. */
  defaultValue?: string | null
  /** Called as another item reaches the center, from a scroll, drag, click, or key. */
  onValueChange?: (value: string) => void
}

export function CoverFlow({
  ref,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  className,
  onDragStart,
  ...props
}: CoverFlowProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<CoverFlowScroller>(null)
  const mountedRef = useRef(false)
  const baseId = useId()
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)

  const isControlled = valueProp !== undefined
  const selectedValue = isControlled ? valueProp : uncontrolledValue

  const select = useCallback(
    (next: string) => {
      if (next === selectedValue) return
      if (!isControlled) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange, selectedValue]
  )

  const selectFromScroller = useEffectEvent(select)
  const reduceMotion = useReducedMotion()
  const shouldReduceMotion = useEffectEvent(() => reduceMotion === true)

  useLayoutEffect(() => {
    const scroller = bindScroller(listRef.current!, {
      onSelect: (next) => selectFromScroller(next),
      shouldReduceMotion: () => shouldReduceMotion(),
    })
    scrollerRef.current = scroller
    return () => {
      scroller.destroy()
      scrollerRef.current = null
      mountedRef.current = false
    }
  }, [])

  useLayoutEffect(() => {
    // The initial value jumps into place, later ones glide
    scrollerRef.current?.sync(selectedValue, mountedRef.current)
    mountedRef.current = true
  }, [selectedValue])

  // The scroller needs the element too, so a `ref` from outside shares it
  const setRef = useCallback<RefCallback<HTMLDivElement>>(
    (node) => {
      listRef.current = node
      if (typeof ref === "function") return ref(node)
      if (ref) ref.current = node
    },
    [ref]
  )

  const hydrated = useIsHydrated()

  const context = useMemo<CoverFlowContextValue>(
    () => ({ baseId, selectedValue, hydrated, select }),
    [baseId, hydrated, select, selectedValue]
  )

  return (
    <CoverFlowContext value={context}>
      <div
        ref={setRef}
        role="listbox"
        tabIndex={0}
        aria-orientation="horizontal"
        aria-activedescendant={
          selectedValue === null ? undefined : getItemId(baseId, selectedValue)
        }
        data-slot="cover-flow"
        className={cn(
          "group/cover-flow relative flex w-full snap-x snap-mandatory scrollbar-none overflow-x-auto overflow-y-hidden overscroll-x-contain outline-none select-none",
          "px-[calc(50%-var(--cover-flow-size)/2)]",
          "[--cover-flow-angle:70deg] [--cover-flow-depth:calc(var(--cover-flow-size)*-0.75)] [--cover-flow-first:calc(var(--cover-flow-size)*0.64)] [--cover-flow-size:--spacing(48)] [--cover-flow-step:calc(var(--cover-flow-size)*0.26)]",
          className
        )}
        onDragStart={(event) => {
          onDragStart?.(event)
          // Images inside the covers would start a native drag instead of scrolling
          event.preventDefault()
        }}
        {...props}
      />
    </CoverFlowContext>
  )
}

export type CoverFlowItemProps = ComponentProps<"div"> & {
  /** Identifies the item for `value`. */
  value: string
}

export function CoverFlowItem({
  value,
  className,
  onClick,
  ...props
}: CoverFlowItemProps) {
  const { baseId, selectedValue, hydrated, select } = useCoverFlow()
  const selected = selectedValue === value

  return (
    <CoverFlowItemContext value={selected}>
      <div
        id={getItemId(baseId, value)}
        role="option"
        aria-selected={selected}
        data-slot="cover-flow-item"
        // Read by the scroller
        data-value={value}
        data-selected={selected || undefined}
        className={cn(
          "relative block w-(--cover-flow-size) flex-none snap-center",
          // Server markup starts at the first item; this centers the selected one
          // before hydration. Only until then, since Chrome keeps pulling the
          // list back to an initial target after later scrolls.
          !hydrated && "aria-selected:[scroll-initial-target:nearest]",
          // Room for the reflection, which the scroller would clip
          "pt-[calc(var(--cover-flow-size)*0.12)] pb-[calc(var(--cover-flow-size)*0.5)]",
          // Until the scroller writes real offsets, side covers start turned away,
          // so their shading and stacking are right before hydration
          "[--cover-flow-offset:0] not-aria-selected:[--cover-flow-offset:1]",
          "[--cover-flow-turn:clamp(-1,var(--cover-flow-offset),1)] [view-timeline:--cover-flow_inline]",
          "z-[calc(100-round(abs(var(--cover-flow-offset))*10))]",
          // The untransformed box overlaps its neighbors' covers, so only the cover takes the pointer
          "pointer-events-none",
          className
        )}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) select(value)
        }}
        {...props}
      />
    </CoverFlowItemContext>
  )
}

export function CoverFlowCover({ className, ...props }: ComponentProps<"div">) {
  const selected = useCoverFlowItemSelected()

  return (
    <div
      data-slot="cover-flow-cover"
      data-selected={selected || undefined}
      className={cn(
        // Transformed inside the item, since snap areas follow transforms and would move the snap points
        "pointer-events-auto relative aspect-square cover-flow-transform cursor-pointer [&>img]:size-full [&>img]:object-cover",
        // Turning away from the light darkens the cover
        "after:pointer-events-none after:absolute after:inset-0 after:bg-black after:opacity-[calc(abs(var(--cover-flow-turn))*0.4)]",
        "group-focus-visible/cover-flow:in-aria-selected:ring-2 group-focus-visible/cover-flow:in-aria-selected:ring-ring group-focus-visible/cover-flow:in-aria-selected:ring-offset-2 group-focus-visible/cover-flow:in-aria-selected:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}

export function CoverFlowReflection({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      inert
      data-slot="cover-flow-reflection"
      className={cn(
        "absolute inset-x-0 top-full aspect-square -scale-y-100 mask-[linear-gradient(to_top,rgb(0_0_0/0.35),transparent_45%)] [&>img]:size-full [&>img]:object-cover",
        className
      )}
      {...props}
    />
  )
}
