"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { useMergedRefs } from "@base-ui/utils/useMergedRefs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useDirection } from "@/components/ui/direction"

const ROOT_NAME = "Marquee"
const CONTENT_NAME = "MarqueeContent"

const FOCUSABLE_SELECTOR =
  'a[href], area[href], button, input, select, textarea, iframe, summary, [tabindex], [contenteditable]:not([contenteditable="false"])'

type Side = "left" | "right" | "top" | "bottom"
type Orientation = "horizontal" | "vertical"
type Direction = "ltr" | "rtl"

type RootElement = HTMLDivElement
type ContentElement = HTMLDivElement

interface Dimensions {
  width: number
  height: number
}

interface ElementDimensions {
  rootSize: number
  contentSize: number
}

function createResizeObserverStore() {
  const listeners = new Set<() => void>()
  let observer: ResizeObserver | null = null
  const elements = new Map<Element, Dimensions>()
  const refCounts = new Map<Element, number>()
  const isSupported = typeof ResizeObserver !== "undefined"
  let notificationScheduled = false

  const snapshotCache = new WeakMap<
    Element,
    WeakMap<
      Element,
      { horizontal: ElementDimensions; vertical: ElementDimensions }
    >
  >()

  function notify() {
    if (notificationScheduled) return
    notificationScheduled = true
    queueMicrotask(() => {
      notificationScheduled = false
      for (const callback of listeners) {
        callback()
      }
    })
  }

  function cleanup() {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    elements.clear()
    refCounts.clear()
  }

  function subscribe(callback: () => void) {
    listeners.add(callback)
    return () => {
      listeners.delete(callback)
      if (listeners.size === 0) {
        cleanup()
      }
    }
  }

  function getSnapshot(
    rootElement: RootElement | null,
    contentElement: ContentElement | null,
    orientation: Orientation
  ): ElementDimensions | null {
    if (!rootElement || !contentElement) return null

    const rootDims = elements.get(rootElement)
    const contentDims = elements.get(contentElement)

    if (!rootDims || !contentDims) return null

    const rootSize =
      orientation === "vertical" ? rootDims.height : rootDims.width
    const contentSize =
      orientation === "vertical" ? contentDims.height : contentDims.width

    let rootCache = snapshotCache.get(rootElement)
    if (!rootCache) {
      rootCache = new WeakMap()
      snapshotCache.set(rootElement, rootCache)
    }

    let contentCache = rootCache.get(contentElement)
    if (!contentCache) {
      contentCache = {
        horizontal: { rootSize: -1, contentSize: -1 },
        vertical: { rootSize: -1, contentSize: -1 },
      }
      rootCache.set(contentElement, contentCache)
    }

    const cached = contentCache[orientation]
    if (cached.rootSize === rootSize && cached.contentSize === contentSize) {
      return cached
    }

    const snapshot = { rootSize, contentSize }
    contentCache[orientation] = snapshot
    return snapshot
  }

  function observe(
    rootElement: RootElement | null,
    contentElement: Element | null
  ) {
    if (!isSupported || !rootElement || !contentElement) return

    if (!observer) {
      observer = new ResizeObserver((entries) => {
        let hasChanged = false

        for (const entry of entries) {
          const element = entry.target
          const { width, height } = entry.contentRect

          const currentData = elements.get(element)

          if (
            !currentData ||
            currentData.width !== width ||
            currentData.height !== height
          ) {
            elements.set(element, { width, height })
            hasChanged = true
          }
        }

        if (hasChanged) {
          notify()
        }
      })
    }

    refCounts.set(rootElement, (refCounts.get(rootElement) ?? 0) + 1)
    refCounts.set(contentElement, (refCounts.get(contentElement) ?? 0) + 1)

    observer.observe(rootElement)
    observer.observe(contentElement)

    const rootRect = rootElement.getBoundingClientRect()
    const contentRect = contentElement.getBoundingClientRect()

    const rootData = { width: rootRect.width, height: rootRect.height }
    const contentData = {
      width: contentRect.width,
      height: contentRect.height,
    }

    elements.set(rootElement, rootData)
    elements.set(contentElement, contentData)

    if (
      rootData.width > 0 &&
      rootData.height > 0 &&
      contentData.width > 0 &&
      contentData.height > 0
    ) {
      notify()
    }
  }

  function unobserve(
    rootElement: RootElement | null,
    contentElement: Element | null
  ) {
    if (!observer || !rootElement || !contentElement) return

    const rootCount = (refCounts.get(rootElement) ?? 1) - 1
    const contentCount = (refCounts.get(contentElement) ?? 1) - 1

    if (rootCount <= 0) {
      observer.unobserve(rootElement)
      elements.delete(rootElement)
      refCounts.delete(rootElement)
    } else {
      refCounts.set(rootElement, rootCount)
    }

    if (contentCount <= 0) {
      observer.unobserve(contentElement)
      elements.delete(contentElement)
      refCounts.delete(contentElement)
    } else {
      refCounts.set(contentElement, contentCount)
    }
  }

  return {
    subscribe,
    getSnapshot,
    observe,
    unobserve,
  }
}

const resizeObserverStore = createResizeObserverStore()

function useResizeObserverStore(
  rootRef: React.RefObject<RootElement | null>,
  contentRef: React.RefObject<ContentElement | null>,
  orientation: Orientation
): ElementDimensions | null {
  const onSubscribe = React.useCallback(
    (callback: () => void) => resizeObserverStore.subscribe(callback),
    []
  )

  const getSnapshot = React.useCallback(
    () =>
      resizeObserverStore.getSnapshot(
        rootRef.current,
        contentRef.current,
        orientation
      ),
    [rootRef, contentRef, orientation]
  )

  return React.useSyncExternalStore(onSubscribe, getSnapshot, getSnapshot)
}

interface MarqueeContextValue {
  side: Side
  orientation: Orientation
  dir: Direction
  contentRef: React.RefObject<ContentElement | null>
  rootRef: React.RefObject<RootElement | null>
  autoFill: boolean
  pauseOnHover: boolean
  reverse: boolean
}

const MarqueeContext = React.createContext<MarqueeContextValue | null>(null)

function useMarqueeContext(consumerName: string) {
  const context = React.useContext(MarqueeContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``)
  }
  return context
}

interface MarqueeProps
  extends React.ComponentProps<"div">, useRender.ComponentProps<"div"> {
  side?: Side
  dir?: Direction
  speed?: number
  delay?: number
  loopCount?: number
  gap?: string | number
  autoFill?: boolean
  pauseOnHover?: boolean
  pauseOnKeyboard?: boolean
  reverse?: boolean
}

function Marquee(props: MarqueeProps) {
  const {
    side = "left",
    dir: dirProp,
    speed = 50,
    delay = 0,
    loopCount = 0,
    gap = "1rem",
    render,
    autoFill = false,
    pauseOnHover = false,
    pauseOnKeyboard = false,
    reverse = false,
    className,
    style: styleProp,
    ref,
    ...marqueeProps
  } = props

  const orientation: Orientation =
    side === "top" || side === "bottom" ? "vertical" : "horizontal"

  const contextDir = useDirection()
  const dir = dirProp ?? contextDir

  const rootRef = React.useRef<RootElement>(null)
  const contentRef = React.useRef<ContentElement>(null)
  const composedRef = useMergedRefs(ref, rootRef)

  const [paused, setPaused] = React.useState(false)

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (pauseOnKeyboard && event.key === " ") {
        event.preventDefault()
        setPaused((prev) => !prev)
      }
    },
    [pauseOnKeyboard]
  )

  // Native focus scrolling cannot reach items translated past the start edge
  // and leaves the loop offset, so seek the animation to reveal the item
  const onFocus = React.useCallback(
    (event: React.FocusEvent<RootElement>) => {
      // The root itself is focusable with pauseOnKeyboard and needs no seek
      if (
        event.target === event.currentTarget ||
        !event.target.matches(":focus-visible")
      )
        return

      const root = event.currentTarget
      const target =
        event.target.closest('[data-slot="marquee-item"]') ?? event.target
      // The browser has already scrolled the root by the time this runs
      root.scrollTo(0, 0)

      const isVertical = orientation === "vertical"
      const rootRect = root.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      // Honors scroll-padding the way native focus scrolling would
      const rootStyle = getComputedStyle(root)
      const viewStart =
        (isVertical ? rootRect.top : rootRect.left) +
        (parseFloat(
          isVertical ? rootStyle.scrollPaddingTop : rootStyle.scrollPaddingLeft
        ) || 0)
      const viewEnd =
        (isVertical ? rootRect.bottom : rootRect.right) -
        (parseFloat(
          isVertical
            ? rootStyle.scrollPaddingBottom
            : rootStyle.scrollPaddingRight
        ) || 0)
      const itemStart = isVertical ? targetRect.top : targetRect.left
      const itemEnd = isVertical ? targetRect.bottom : targetRect.right

      let shift = 0
      if (itemStart < viewStart) shift = viewStart - itemStart
      else if (itemEnd > viewEnd) shift = viewEnd - itemEnd
      if (shift === 0) return

      // Sign of the track's movement along the axis as animation time advances
      const movesNegative = isVertical
        ? side === "top"
        : (side === "left") === (dir === "ltr")
      const travel = (movesNegative ? -1 : 1) * (reverse ? -1 : 1)

      const tracks = root.querySelectorAll<HTMLElement>(
        ':scope > :is([data-slot="marquee-content"], [data-slot="marquee-clone"])'
      )

      for (const track of tracks) {
        // Only the loop is seeked, not transitions added to the track
        const animation = track
          .getAnimations()
          .find((item) => item instanceof CSSAnimation)
        if (!animation?.effect) continue

        const { delay = 0, duration } = animation.effect.getComputedTiming()
        const cycle = Number(duration)
        const trackStyle = getComputedStyle(track)
        const distance = isVertical
          ? track.offsetHeight + (parseFloat(trackStyle.rowGap) || 0)
          : track.offsetWidth + (parseFloat(trackStyle.columnGap) || 0)

        const local = Math.max(0, Number(animation.currentTime) - delay)
        const iteration = Math.floor(local / cycle) * cycle
        const progress = local - iteration
        // Wrapping would jump the item by a full loop, so items near the start
        // of the track stop at the closest position they can reach
        const next = Math.min(
          Math.max(progress + (travel * shift * cycle) / distance, 0),
          cycle - 1
        )
        animation.currentTime = delay + iteration + next
      }
    },
    [orientation, side, dir, reverse]
  )

  const dimensions = useResizeObserverStore(rootRef, contentRef, orientation)

  const duration = React.useMemo(() => {
    const safeSpeed = Math.max(0.001, speed)

    if (!dimensions) {
      const defaultDistance = autoFill ? 1000 : 2000
      return defaultDistance / safeSpeed
    }

    const { rootSize, contentSize } = dimensions

    if (autoFill) {
      const multiplier =
        contentSize < rootSize ? Math.ceil(rootSize / contentSize) : 1
      return (contentSize * multiplier) / safeSpeed
    } else {
      return contentSize < rootSize
        ? rootSize / safeSpeed
        : contentSize / safeSpeed
    }
  }, [dimensions, speed, autoFill])

  const style = React.useMemo<React.CSSProperties>(
    () => ({
      "--marquee-duration": `${duration}s`,
      "--marquee-gap": gap,
      "--marquee-delay": `${delay}s`,
      "--marquee-loop-count":
        loopCount === 0 || loopCount === Infinity
          ? "infinite"
          : loopCount.toString(),
      ...styleProp,
    }),
    [duration, gap, delay, loopCount, styleProp]
  )

  const contextValue = React.useMemo<MarqueeContextValue>(
    () => ({
      side,
      orientation,
      dir,
      contentRef,
      rootRef,
      autoFill,
      pauseOnHover,
      reverse,
    }),
    [side, orientation, dir, autoFill, pauseOnHover, reverse]
  )

  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        role: "marquee" as React.AriaRole,
        "aria-live": "off",
        dir,
        tabIndex: pauseOnKeyboard ? 0 : undefined,
        ref: composedRef,
        className: cn(
          "relative flex overflow-hidden",
          orientation === "vertical" && "h-full flex-col",
          orientation === "horizontal" && "w-full",
          paused && "**:paused",
          "group/marquee has-focus-visible:**:paused",
          pauseOnHover && "group",
          pauseOnKeyboard &&
            "rounded-md focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
          className
        ),
        style,
        onKeyDown: pauseOnKeyboard ? onKeyDown : undefined,
        onFocus,
      },
      marqueeProps
    ),
    render,
    state: {
      slot: "marquee",
      orientation,
    },
  })

  return (
    <MarqueeContext.Provider value={contextValue}>
      <div data-slot="marquee-wrapper" className="grid">
        {element}
      </div>
    </MarqueeContext.Provider>
  )
}

const marqueeContentVariants = cva(
  // Paused rather than removed so focus can still seek hidden items into view
  "flex min-w-full shrink-0 gap-(--marquee-gap) motion-reduce:paused",
  {
    variants: {
      side: {
        left: "animate-marquee-left",
        right: "animate-marquee-right",
        top: "min-h-full min-w-auto animate-marquee-up flex-col",
        bottom: "min-h-full min-w-auto animate-marquee-down flex-col",
      },
      dir: {
        ltr: "",
        rtl: "",
      },
      pauseOnHover: {
        true: "group-hover:paused",
        false: "",
      },
    },
    compoundVariants: [
      {
        side: "left",
        dir: "rtl",
        className: "animate-marquee-left-rtl",
      },
      {
        side: "right",
        dir: "rtl",
        className: "animate-marquee-right-rtl",
      },
    ],
    defaultVariants: {
      side: "left",
      dir: "ltr",
      pauseOnHover: false,
    },
  }
)

interface MarqueeContentProps
  extends React.ComponentProps<"div">, useRender.ComponentProps<"div"> {}

function MarqueeContent(props: MarqueeContentProps) {
  const {
    className,
    render,
    ref,
    children,
    style: styleProp,
    ...contentProps
  } = props

  const context = useMarqueeContext(CONTENT_NAME)
  const composedRef = useMergedRefs(ref, context.contentRef)

  const isVertical = context.orientation === "vertical"
  const isRtl = context.dir === "rtl"

  const dimensions = useResizeObserverStore(
    context.rootRef,
    context.contentRef,
    context.orientation
  )

  React.useEffect(() => {
    const rootElement = context.rootRef.current
    const contentElement = context.contentRef.current

    if (rootElement && contentElement) {
      resizeObserverStore.observe(rootElement, contentElement)

      return () => {
        resizeObserverStore.unobserve(rootElement, contentElement)
      }
    }
  }, [context.rootRef, context.contentRef])

  const multiplier = React.useMemo(() => {
    if (!context.autoFill || !dimensions) return 1

    const { rootSize, contentSize } = dimensions
    if (contentSize === 0) return 1

    return contentSize < rootSize ? Math.ceil(rootSize / contentSize) : 1
  }, [context.autoFill, dimensions])

  // Clones stay clickable but must not add a second tab stop per item
  React.useEffect(() => {
    context.rootRef.current
      ?.querySelectorAll(
        `[data-slot="marquee-clone"] :is(${FOCUSABLE_SELECTOR}):not([tabindex="-1"])`
      )
      .forEach((element) => element.setAttribute("tabindex", "-1"))
  })

  const style = React.useMemo(
    () => ({
      ...styleProp,
      animationDuration: "var(--marquee-duration)",
      animationDelay: "var(--marquee-delay)",
      animationIterationCount: "var(--marquee-loop-count)",
      animationDirection: context.reverse ? "reverse" : "normal",
    }),
    [styleProp, context.reverse]
  )

  const contentClassName = cn(
    marqueeContentVariants({
      side: context.side,
      dir: context.dir,
      pauseOnHover: context.pauseOnHover,
      className,
    }),
    isVertical && "flex-col",
    isVertical
      ? "mb-(--marquee-gap)"
      : isRtl
        ? "ml-(--marquee-gap)"
        : "mr-(--marquee-gap)"
  )

  const copyClassName = cn(
    "flex shrink-0 gap-(--marquee-gap)",
    isVertical && "flex-col"
  )

  const innerContent = (
    <>
      <div ref={composedRef} className={copyClassName}>
        {children}
      </div>
      {Array.from({ length: multiplier - 1 }, (_, i) => (
        <div
          key={i}
          data-slot="marquee-clone"
          aria-hidden="true"
          className={copyClassName}
        >
          {children}
        </div>
      ))}
    </>
  )

  const visibleElement = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: contentClassName,
        style,
        children: innerContent,
      },
      contentProps
    ),
    render,
    state: {
      slot: "marquee-content",
      orientation: context.orientation,
    },
  })

  return (
    <>
      {visibleElement}
      <div
        aria-hidden="true"
        {...contentProps}
        data-slot="marquee-clone"
        style={style}
        className={cn(
          marqueeContentVariants({
            side: context.side,
            dir: context.dir,
            pauseOnHover: context.pauseOnHover,
          }),
          isVertical && "flex-col"
        )}
      >
        {Array.from({ length: multiplier }, (_, i) => (
          <React.Fragment key={i}>{children}</React.Fragment>
        ))}
      </div>
    </>
  )
}

interface MarqueeItemProps
  extends React.ComponentProps<"div">, useRender.ComponentProps<"div"> {}

function MarqueeItem({ className, render, ...itemProps }: MarqueeItemProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("shrink-0", className) },
      itemProps
    ),
    render,
    state: { slot: "marquee-item" },
  })
}

interface MarqueeEdgeProps
  extends
    VariantProps<typeof marqueeEdgeVariants>,
    React.ComponentProps<"div">,
    useRender.ComponentProps<"div"> {}

// Hidden during keyboard focus so it never covers the focused item
const marqueeEdgeVariants = cva(
  "pointer-events-none absolute z-10 transition-opacity group-has-focus-visible/marquee:opacity-0",
  {
    variants: {
      side: {
        left: "top-0 left-0 h-full bg-linear-to-r from-background to-transparent",
        right:
          "top-0 right-0 h-full bg-linear-to-l from-background to-transparent",
        top: "top-0 left-0 w-full bg-linear-to-b from-background to-transparent",
        bottom:
          "bottom-0 left-0 w-full bg-linear-to-t from-background to-transparent",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
    },
    compoundVariants: [
      {
        side: ["left", "right"],
        size: "default",
        className: "w-1/4",
      },
      {
        side: ["left", "right"],
        size: "sm",
        className: "w-1/6",
      },
      {
        side: ["left", "right"],
        size: "lg",
        className: "w-1/3",
      },
      {
        side: ["top", "bottom"],
        size: "default",
        className: "h-1/4",
      },
      {
        side: ["top", "bottom"],
        size: "sm",
        className: "h-1/6",
      },
      {
        side: ["top", "bottom"],
        size: "lg",
        className: "h-1/3",
      },
    ],
    defaultVariants: {
      size: "default",
    },
  }
)

function MarqueeEdge({
  side,
  size,
  className,
  render,
  ...edgeProps
}: MarqueeEdgeProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn(marqueeEdgeVariants({ side, size, className })) },
      edgeProps
    ),
    render,
    state: {
      slot: "marquee-edge",
      size: size ?? "default",
    },
  })
}

export { Marquee, MarqueeContent, MarqueeEdge, MarqueeItem, type MarqueeProps }
