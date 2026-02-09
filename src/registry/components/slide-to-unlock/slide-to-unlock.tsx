"use client"

import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useTransform,
} from "motion/react"
import {
  type ComponentPropsWithoutRef,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react"

import { cn } from "@/lib/utils"

type SlideToUnlockContextValue = {
  x: MotionValue<number>
  trackRef: React.RefObject<HTMLDivElement | null>
  isDragging: boolean
  handleWidth: number
  textOpacity: MotionValue<number>
  onDragStart: () => void
  onDragEnd: () => void
}

const SlideToUnlockContext = createContext<SlideToUnlockContextValue | null>(
  null
)

function useSlideToUnlock() {
  const context = useContext(SlideToUnlockContext)
  if (!context) {
    throw new Error(
      `SlideToUnlock components must be used within SlideToUnlock`
    )
  }
  return context
}

export type SlideToUnlockRootProps = React.ComponentProps<"div"> & {
  handleWidth?: number
  onUnlock?: () => void
}

export function SlideToUnlock({
  className,
  handleWidth = 56,
  children,
  onUnlock,
  ...props
}: SlideToUnlockRootProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)

  const fadeDistance = handleWidth
  const textOpacity = useTransform(x, [0, fadeDistance], [1, 0])

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)

    const trackWidth = trackRef.current?.offsetWidth || 0
    const maxX = trackWidth - handleWidth

    if (x.get() >= maxX) {
      onUnlock?.()
    } else {
      animate(x, 0, { type: "spring", bounce: 0, duration: 0.25 })
    }
  }, [x, onUnlock, handleWidth])

  return (
    <SlideToUnlockContext.Provider
      value={{
        x,
        trackRef,
        isDragging,
        handleWidth,
        textOpacity,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
      }}
    >
      <div
        data-slot="slide-to-unlock"
        className={cn(
          "w-54 rounded-xl bg-zinc-100 p-1 shadow-inner ring ring-black/5 ring-inset dark:bg-zinc-900 dark:ring-white/10",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SlideToUnlockContext.Provider>
  )
}

export type SlideToUnlockTrackProps = React.ComponentProps<"div">

export function SlideToUnlockTrack({
  className,
  children,
  ...props
}: SlideToUnlockTrackProps) {
  const { trackRef } = useSlideToUnlock()

  return (
    <div
      ref={trackRef}
      data-slot="track"
      className={cn(
        "relative flex h-10 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export type SlideToUnlockTextProps = Omit<
  ComponentPropsWithoutRef<typeof motion.div>,
  "children"
> & {
  children:
    | React.ReactNode
    | ((props: { isDragging: boolean }) => React.ReactNode)
}

export function SlideToUnlockText({
  className,
  children,
  style,
  ...props
}: SlideToUnlockTextProps) {
  const { handleWidth, textOpacity, isDragging } = useSlideToUnlock()

  return (
    <motion.div
      data-slot="text"
      data-dragging={isDragging}
      className={cn("pl-1 text-lg font-medium", className)}
      style={{ marginLeft: handleWidth, opacity: textOpacity, ...style }}
      {...props}
    >
      {typeof children === "function" ? children({ isDragging }) : children}
    </motion.div>
  )
}

export type SlideToUnlockHandleProps = ComponentPropsWithoutRef<
  typeof motion.div
>

export function SlideToUnlockHandle({
  className,
  children,
  style,
  ...props
}: SlideToUnlockHandleProps) {
  const {
    x,
    trackRef,
    onDragStart,
    onDragEnd,
    handleWidth: width,
  } = useSlideToUnlock()

  return (
    <motion.div
      data-slot="handle"
      className={cn(
        "absolute top-0 left-0 flex h-10 cursor-grab items-center justify-center rounded-lg bg-white text-zinc-400 shadow-sm active:cursor-grabbing",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
        className
      )}
      style={{ width, x, ...style }}
      drag="x"
      dragDirectionLock
      dragConstraints={trackRef}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      {...props}
    >
      {children ?? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          aria-hidden
        >
          <path
            d="M237.66,133.66l-96,96A8,8,0,0,1,128,224V184H48a16,16,0,0,1-16-16V88A16,16,0,0,1,48,72h80V32a8,8,0,0,1,13.66-5.66l96,96A8,8,0,0,1,237.66,133.66Z"
            fill="currentColor"
          />
        </svg>
      )}
    </motion.div>
  )
}
