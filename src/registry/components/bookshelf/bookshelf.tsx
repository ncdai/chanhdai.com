"use client"

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import type { CSSProperties, RefObject } from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { useReducedMotion, useSpring } from "motion/react"
import type { MotionValue } from "motion/react"

import { cn } from "@/lib/utils"

const OPEN_ANGLE = 90
const LIFT_DISTANCE = 8
const SPRING = { stiffness: 260, damping: 32 }

type CSSVariables = CSSProperties & Record<`--${string}`, string | number>

function toRadians(deg: number) {
  return (deg * Math.PI) / 180
}

// The projected footprint of the turned book, so neighbors are pushed aside
// by exactly the space the cover takes up
function getItemWidth(deg: number, spineWidth: number, coverWidth: number) {
  const rad = toRadians(deg)
  return spineWidth * Math.cos(rad) + coverWidth * Math.sin(rad)
}

// Pivots on the spine/cover edge, then shifts left so the turned spine starts
// at the item's left edge instead of leaving a gap
function getBookTransform(deg: number, spineWidth: number) {
  const shift = spineWidth * (Math.cos(toRadians(deg)) - 1)
  return `perspective(1200px) translateX(${shift}px) rotateY(${-deg}deg)`
}

type BookshelfContextValue = {
  openValue: string | null
  instant: boolean
  toggle: (value: string, fromKeyboard: boolean) => void
}

const BookshelfContext = createContext<BookshelfContextValue | null>(null)

function useBookshelf() {
  const context = use(BookshelfContext)
  if (!context) {
    throw new Error("Bookshelf parts must be used within <Bookshelf>")
  }
  return context
}

type BookshelfItemContextValue = {
  value: string
  open: boolean
  angle: MotionValue<number>
  spineWidth: number
}

const BookshelfItemContext = createContext<BookshelfItemContextValue | null>(
  null
)

function useBookshelfItem() {
  const context = use(BookshelfItemContext)
  if (!context) {
    throw new Error("BookshelfItem parts must be used within <BookshelfItem>")
  }
  return context
}

type BookshelfState = {
  slot: string
}

type BookshelfItemState = {
  slot: string
  open: boolean
}

export type BookshelfProps = Omit<
  useRender.ComponentProps<"div", BookshelfState>,
  "defaultValue"
> & {
  /** The open book. At most one book is open at a time. */
  value?: string | null
  /** The book open on first render, when `value` is not controlled. */
  defaultValue?: string | null
  /** Called when a book opens or closes, with `null` when none is open. */
  onValueChange?: (value: string | null) => void
}

export function Bookshelf({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  className,
  render,
  ...props
}: BookshelfProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  // Keyboard changes repeat too often to animate, so they snap
  const [instant, setInstant] = useState(false)

  const isControlled = valueProp !== undefined
  const openValue = isControlled ? valueProp : uncontrolledValue

  const setOpenValue = useCallback(
    (next: string | null, fromKeyboard: boolean) => {
      if (!isControlled) setUncontrolledValue(next)
      setInstant(fromKeyboard)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const toggle = useCallback(
    (value: string, fromKeyboard: boolean) => {
      setOpenValue(openValue === value ? null : value, fromKeyboard)
    },
    [openValue, setOpenValue]
  )

  const context = useMemo<BookshelfContextValue>(
    () => ({ openValue, instant, toggle }),
    [instant, openValue, toggle]
  )

  const element = useRender({
    defaultTagName: "div",
    render,
    state: { slot: "bookshelf" },
    props: mergeProps<"div">(
      {
        className: cn("flex items-end justify-center gap-1", className),
        onKeyDown: (event) => {
          if (event.key !== "Escape" || openValue === null) return
          // Keeps an enclosing dialog open when Escape only closed a book
          event.stopPropagation()
          setOpenValue(null, true)
        },
      },
      props
    ),
  })

  return <BookshelfContext value={context}>{element}</BookshelfContext>
}

export type BookshelfItemProps = useRender.ComponentProps<
  "div",
  BookshelfItemState
> & {
  /** Identifies the item for `value`. Generated when omitted. */
  value?: string
  /** Thickness of the spine in pixels, the item's width when closed. */
  spineWidth: number
  /** Width of the cover in pixels, the item's width when open. */
  coverWidth: number
}

export function BookshelfItem({
  value: valueProp,
  spineWidth,
  coverWidth,
  className,
  style,
  render,
  ...props
}: BookshelfItemProps) {
  const { openValue, instant } = useBookshelf()
  const generatedValue = useId()
  const value = valueProp ?? generatedValue
  const open = openValue === value

  const itemRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [initialAngle] = useState(open ? OPEN_ANGLE : 0)
  const angle = useSpring(initialAngle, SPRING)
  const previousOpen = useRef(open)

  useEffect(() => {
    // Only a change of `open` moves the book; `instant` flipping alone must
    // not snap a turn that is still in flight
    if (previousOpen.current === open) return
    previousOpen.current = open
    const target = open ? OPEN_ANGLE : 0
    if (reduceMotion || instant) angle.jump(target)
    else angle.set(target)
  }, [angle, instant, open, reduceMotion])

  // Written straight to the element: a spring frame must not re-render React,
  // and an animated CSS variable would restyle every descendant per frame
  useEffect(() => {
    const apply = (deg: number) => {
      if (!itemRef.current) return
      const width = getItemWidth(deg, spineWidth, coverWidth)
      itemRef.current.style.width = `${width}px`
    }
    apply(angle.get())
    return angle.on("change", apply)
  }, [angle, coverWidth, spineWidth])

  const itemContext = useMemo(
    () => ({ value, open, angle, spineWidth }),
    [angle, open, spineWidth, value]
  )

  const element = useRender({
    defaultTagName: "div",
    render,
    ref: itemRef,
    state: { slot: "bookshelf-item", open },
    props: mergeProps<"div">(
      {
        className: cn("relative shrink-0", className),
        style: {
          "--bookshelf-spine-width": `${spineWidth}px`,
          "--bookshelf-cover-width": `${coverWidth}px`,
          width: getItemWidth(initialAngle, spineWidth, coverWidth),
          ...style,
        } as CSSVariables,
      },
      props
    ),
  })

  return (
    <BookshelfItemContext value={itemContext}>{element}</BookshelfItemContext>
  )
}

export function BookshelfTrigger({
  className,
  children,
  render,
  ...props
}: useRender.ComponentProps<"button", BookshelfItemState>) {
  const { toggle, instant } = useBookshelf()
  const { value, open, angle, spineWidth } = useBookshelfItem()
  const liftRef = useRef<HTMLSpanElement>(null)
  const bookRef = useRef<HTMLSpanElement>(null)
  const [initialAngle] = useState(() => angle.get())

  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [focusVisible, setFocusVisible] = useState(false)
  // An open book stays raised, so opening it never drops it back down
  const raised = !reduceMotion && (hovered || focusVisible || open)
  const [initialLift] = useState(open ? 1 : 0)
  // A spring rather than a CSS ease, so the lift glides and can be caught
  // mid-way when the pointer moves on
  const lift = useSpring(initialLift, SPRING)
  const previousLiftInputs = useRef({ focusVisible, open })

  useEffect(() => {
    const previous = previousLiftInputs.current
    previousLiftInputs.current = { focusVisible, open }
    const fromKeyboard =
      previous.focusVisible !== focusVisible ||
      (previous.open !== open && instant)
    const target = raised ? 1 : 0
    if (fromKeyboard || reduceMotion) lift.jump(target)
    else lift.set(target)
  }, [focusVisible, instant, lift, open, raised, reduceMotion])

  useEffect(() => {
    const apply = (amount: number) => {
      if (liftRef.current) {
        liftRef.current.style.transform = `translateY(${-amount * LIFT_DISTANCE}px)`
      }
    }
    apply(lift.get())
    return lift.on("change", apply)
  }, [lift])

  useEffect(() => {
    const apply = (deg: number) => {
      if (bookRef.current) {
        bookRef.current.style.transform = getBookTransform(deg, spineWidth)
      }
    }
    apply(angle.get())
    return angle.on("change", apply)
  }, [angle, spineWidth])

  useReducedMotionFade(bookRef, open)

  return useRender({
    defaultTagName: "button",
    render,
    state: { slot: "bookshelf-trigger", open },
    props: mergeProps<"button">(
      {
        ...(render ? {} : { type: "button" as const }),
        "aria-expanded": open,
        className: cn(
          "group/bookshelf-trigger relative block size-full cursor-pointer outline-none",
          className
        ),
        // `detail` is 0 when Enter or Space fired the click
        onClick: (event) => toggle(value, event.detail === 0),
        onPointerEnter: (event) => {
          if (event.pointerType === "mouse") setHovered(true)
        },
        onPointerLeave: () => setHovered(false),
        onFocus: (event) => {
          setFocusVisible(event.currentTarget.matches(":focus-visible"))
        },
        onBlur: () => setFocusVisible(false),
        children: (
          // Lifts instead of the trigger, so the hit area stays under the
          // pointer and the hover cannot flicker on and off
          <span
            ref={liftRef}
            data-slot="bookshelf-lift"
            className="absolute inset-0 group-focus-visible/bookshelf-trigger:ring-2 group-focus-visible/bookshelf-trigger:ring-ring group-focus-visible/bookshelf-trigger:ring-offset-2 group-focus-visible/bookshelf-trigger:ring-offset-background"
            style={{
              transform: `translateY(${-initialLift * LIFT_DISTANCE}px)`,
            }}
          >
            <span
              ref={bookRef}
              data-slot="bookshelf-book"
              className="absolute inset-y-0 left-0 w-(--bookshelf-spine-width) origin-right transform-3d"
              style={{ transform: getBookTransform(initialAngle, spineWidth) }}
            >
              {children}
            </span>
          </span>
        ),
      },
      props
    ),
  })
}

// Reduced motion snaps the book without turning it, so a short fade keeps the
// change legible without movement
function useReducedMotionFade(
  ref: RefObject<HTMLElement | null>,
  open: boolean
) {
  const reduceMotion = useReducedMotion()
  const previousOpen = useRef(open)

  useEffect(() => {
    if (previousOpen.current === open) return
    previousOpen.current = open
    if (reduceMotion) {
      ref.current?.animate(
        { opacity: [0, 1] },
        { duration: 150, easing: "ease" }
      )
    }
  }, [open, reduceMotion, ref])
}

export function BookshelfSpine({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div", BookshelfItemState>) {
  const { open } = useBookshelfItem()

  return useRender({
    defaultTagName: "div",
    render,
    state: { slot: "bookshelf-spine", open },
    props: mergeProps<"div">(
      { className: cn("absolute inset-0 overflow-hidden", className) },
      props
    ),
  })
}

export function BookshelfCover({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div", BookshelfItemState>) {
  const { open } = useBookshelfItem()

  return useRender({
    defaultTagName: "div",
    render,
    state: { slot: "bookshelf-cover", open },
    props: mergeProps<"div">(
      {
        // Hidden from assistive tech while it faces away; the spine names the book
        inert: !open,
        className: cn(
          "absolute top-0 left-full h-full w-(--bookshelf-cover-width) origin-left rotate-y-90 overflow-hidden",
          className
        ),
      },
      props
    ),
  })
}
