"use client"

import { createContext, use, useId, useMemo, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  PointerEvent,
  ReactNode,
} from "react"
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react"
import type { MotionValue } from "motion/react"

import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

/** Pointer travel for a full open, in page widths. */
const DRAG_TRAVEL = 1.5

/** How far ahead (s) a flick is projected to pick where the cover lands. */
const FLICK_PROJECTION = 0.15

/**
 * The spring aims this far past the end and is stopped as it crosses it, so the
 * cover lands instead of creeping the last pixel. Hence progress is clamped
 * wherever it is read.
 */
const LANDING = 0.02

/** Distance from the viewer to the page, in page widths. */
const PERSPECTIVE = 4.7

/** How far the free edge rises past the page at most, in page heights. */
const MAX_RISE = (PERSPECTIVE / (PERSPECTIVE - 1) - 1) / 2

/** Radius the cover grows to standing up, in page widths (Apple's ratio). */
const COVER_RADIUS = 0.12

/**
 * How dark the inside starts, and the last stretch of the opening over which it
 * lights up.
 */
const INSIDE_SHADE = 0.75
const INSIDE_WAKE = 0.64

/** How a face of the cover blurs, after the shader on Apple's fold. */
type FaceFocus = {
  /** 0 to 1, by progress. */
  strength: (progress: number) => number
  /** Blur offset at the hinge and climb per page width, at full strength. */
  start: number
  climb: number
}

/**
 * Near either end, focus eases out ahead of the turn, or a faint dark rim
 * lingers as the cover lands.
 */
const SETTLE = 0.02

function getSettle(progress: number) {
  return Math.min(1, Math.min(progress, 1 - progress) / SETTLE)
}

/** Most blurred standing upright, sharp at the hinge. */
const FRONT_FOCUS: FaceFocus = {
  strength: (p) => Math.min(p, 1 - p) * getSettle(p),
  start: 0,
  climb: 2.78,
}

/** Blurred until well past upright, and a little even at the hinge. */
const BACK_FOCUS: FaceFocus = {
  strength: (p) => clamp01(1.2 * (1 - p)) * getSettle(p),
  start: 0.23,
  climb: 2.27,
}

/** Blur level reached at full strength: a third past Apple's top level, 8. */
const LEVEL_RUN = 8 / 0.75

/** Blur levels over which the print fades to black, past the last copy. */
const FADE_LEVELS = [7.2, 10.4]

/** How strongly the print dims out from the hinge, per unit of strength. */
const DIM_GAIN = 1.5

/**
 * The fade strip is its band plus this many bands of black, and the band
 * stretches to at most this many page widths.
 */
const FADE_TAIL = 4
const FADE_STRETCH = 8

/**
 * One copy of the print per blur level, each doubling the blur in texels set
 * per face as --foldable-texel. A copy runs past the print so the blur samples
 * paper at the sides and the body's black above and below; the paper stops half
 * a blur short there, so the edge softens without a hard line. Apple's top
 * level, 8, is left to the fade to black.
 */
const PRINT_LEVELS = [
  {
    level: 0,
    blur: "",
    body: "",
    bleed: "inset-0",
    paper: "inset-y-0",
    print: "inset-0",
    mask: "",
  },
  {
    level: 2,
    blur: "blur-[calc(var(--foldable-w)*var(--foldable-texel)*4)]",
    body: "bg-black",
    bleed: "-inset-[calc(var(--foldable-w)*var(--foldable-texel)*8)]",
    paper: "inset-y-[calc(var(--foldable-w)*var(--foldable-texel)*10)]",
    print:
      "inset-x-[calc(var(--foldable-w)*var(--foldable-texel)*8)] -inset-y-[calc(var(--foldable-w)*var(--foldable-texel)*2)]",
    mask: "[mask-size:calc(100%_-_var(--foldable-w)*var(--foldable-texel)*16)_calc(100%_-_var(--foldable-w)*var(--foldable-texel)*16)]",
  },
  {
    level: 4,
    blur: "blur-[calc(var(--foldable-w)*var(--foldable-texel)*16)]",
    body: "bg-black",
    bleed: "-inset-[calc(var(--foldable-w)*var(--foldable-texel)*32)]",
    paper: "inset-y-[calc(var(--foldable-w)*var(--foldable-texel)*40)]",
    print:
      "inset-x-[calc(var(--foldable-w)*var(--foldable-texel)*32)] -inset-y-[calc(var(--foldable-w)*var(--foldable-texel)*8)]",
    mask: "[mask-size:calc(100%_-_var(--foldable-w)*var(--foldable-texel)*64)_calc(100%_-_var(--foldable-w)*var(--foldable-texel)*64)]",
  },
  {
    level: 6,
    blur: "blur-[calc(var(--foldable-w)*var(--foldable-texel)*64)]",
    body: "bg-black",
    bleed: "-inset-[calc(var(--foldable-w)*var(--foldable-texel)*128)]",
    paper: "inset-y-[calc(var(--foldable-w)*var(--foldable-texel)*160)]",
    print:
      "inset-x-[calc(var(--foldable-w)*var(--foldable-texel)*128)] -inset-y-[calc(var(--foldable-w)*var(--foldable-texel)*32)]",
    mask: "[mask-size:calc(100%_-_var(--foldable-w)*var(--foldable-texel)*256)_calc(100%_-_var(--foldable-w)*var(--foldable-texel)*256)]",
  },
]

/**
 * Open flat, the spread has no line down its middle. A ring has no side to
 * leave off, so on the hinge side it runs past the hinge, where the clip cuts
 * it: 2px, as at 1px a stage on a fractional x snaps it back into view.
 */
const LINE_WIDTH = 1
const LINE_RING = "inset-ring inset-ring-foreground"
const LINE_PAST_HINGE = {
  insideRight: "-left-0.5",
  insideLeft: "-right-0.5 origin-[calc(100%-2px)_50%]",
}

type FreeSide = "right" | "left"

/** The inner screen spans the spread, so its texel is twice the front's. */
const COVER_SIDES = {
  cover: {
    slot: "foldable-cover",
    freeSide: "right",
    focus: FRONT_FOCUS,
    isInside: false,
    className: "inset-0 origin-left [--foldable-texel:0.001]",
  },
  insideLeft: {
    slot: "foldable-inside-left",
    freeSide: "left",
    focus: BACK_FOCUS,
    isInside: true,
    className:
      "inset-y-0 right-full w-full origin-right [--foldable-texel:0.002]",
  },
} satisfies Record<
  string,
  {
    slot: string
    freeSide: FreeSide
    focus: FaceFocus
    isInside: boolean
    className: string
  }
>

const MASK_WHOLE = "linear-gradient(black, black)"
const MASK_NONE = "linear-gradient(transparent, transparent)"

/**
 * Page widths from the hinge that stand for "past the print": finite, so
 * nothing turns NaN.
 */
const BEYOND = 1000

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function smoothstep(t: number) {
  const s = clamp01(t)
  return s * s * (3 - 2 * s)
}

/** Off the page, anywhere between lying flat at either end. */
function isTurning(progress: number) {
  return progress > 0 && progress < 1
}

/** How much closer the lifted free edge looks: 1 flat, growing as it turns. */
function scaleFreeEdge(progress: number) {
  return PERSPECTIVE / (PERSPECTIVE - Math.sin(Math.PI * progress))
}

/**
 * Where the free edge lands on screen, in page widths from the hinge; negative
 * once the back faces the viewer.
 */
function projectFreeEdge(progress: number) {
  const shift = progress / 2
  const x = shift + Math.cos(Math.PI * progress)

  // The vanishing point sits at the center of the closed page.
  return 0.5 + (x - 0.5) * scaleFreeEdge(progress) - shift
}

/**
 * The cover's corner radius in its own plane, the print's radius lying flat and
 * growing as it stands up, and that corner as projected: taller coming closer,
 * narrower turning away.
 */
function getCoverShape(progress: number) {
  const scale = scaleFreeEdge(progress)
  const turn = Math.abs(Math.cos(Math.PI * progress))
  const radius = `(var(--foldable-radius) + max(0px, var(--foldable-w) * ${COVER_RADIUS} - var(--foldable-radius)) * ${1 - turn})`

  return {
    scale,
    radius: `calc${radius}`,
    rx: `calc(${radius} * ${turn * scale})`,
    ry: `calc(${radius} * ${scale})`,
  }
}

function getInsideShade(p: number) {
  return INSIDE_SHADE * clamp01((1 - p) / INSIDE_WAKE)
}

/**
 * Page widths from the hinge where a face's blur reaches `level`; BEYOND if it
 * never does.
 */
function getLevelReach(face: FaceFocus, p: number, level: number) {
  if (level === 0) return -face.start / face.climb
  const strength = face.strength(clamp01(p))
  if (strength === 0) return BEYOND
  return Math.min(
    (level / LEVEL_RUN / strength - face.start) / face.climb,
    BEYOND
  )
}

// Clamped to what a gradient stop accepts.
function toPercent(x: number) {
  return `${Math.max(-99, Math.min(99, x)) * 100}%`
}

/**
 * The print cut to the cover's projected shape; its corners sit above and below
 * by the rise.
 */
function coverClip(freeSide: FreeSide, progress: number) {
  const { scale, rx, ry } = getCoverShape(progress)
  const reach = `calc(var(--foldable-h) * ${(1 - scale) / 2})`
  const edge = projectFreeEdge(progress) * (freeSide === "right" ? 1 : -1)
  const cut = `${(1 - clamp01(edge)) * 100}%`

  return freeSide === "right"
    ? `inset(${reach} ${cut} ${reach} 0 round 0 ${rx} ${rx} 0 / 0 ${ry} ${ry} 0)`
    : `inset(${reach} 0 ${reach} ${cut} round ${rx} 0 0 ${rx} / ${ry} 0 0 ${ry})`
}

const SAMPLES = Array.from({ length: 9 }, (_, i) => i / 8)

function byFreeSide(build: (direction: string) => string) {
  return {
    right: build("to right"),
    left: build("to left"),
  } satisfies Record<FreeSide, string>
}

// Apple's smoothstep dimming, drawn once; only its opacity animates.
const DIM_GRADIENT = byFreeSide(
  (direction) =>
    `linear-gradient(${direction}, ${SAMPLES.map(
      (x) => `rgb(0 0 0 / ${smoothstep(x).toFixed(3)}) ${x * 100}%`
    ).join(", ")})`
)

// A band and then solid black, slid and stretched over FADE_LEVELS.
const FADE_GRADIENT = byFreeSide(
  (direction) =>
    `linear-gradient(${direction}, ${SAMPLES.map(
      (x) =>
        `rgb(0 0 0 / ${smoothstep(x).toFixed(3)}) ${(x / FADE_TAIL) * 100}%`
    ).join(", ")}, black)`
)

type FoldableContextValue = {
  /** 0 is closed, 1 is open. */
  progress: MotionValue<number>
  /** How dark the inside is: the page, and the inside of the cover. */
  shade: MotionValue<number>
}

const FoldableContext = createContext<FoldableContextValue | null>(null)

function useFoldable() {
  const context = use(FoldableContext)
  if (!context)
    throw new Error("Foldable parts must be used within <Foldable>.")
  return context
}

export function Foldable({ className, ...props }: ComponentProps<"div">) {
  const progress = useMotionValue(0)
  const shade = useTransform(progress, getInsideShade)
  const value = useMemo(() => ({ progress, shade }), [progress, shade])

  return (
    <FoldableContext value={value}>
      <div
        data-slot="foldable"
        // Whole-pixel height where the browser can round: the flat parts snap
        // to the pixel grid and the 3D body does not, so on a fraction their
        // lines part at the hinge.
        className={cn(
          "flex flex-col items-center gap-6 [--foldable-h:calc(var(--foldable-w)*7/5)] [--foldable-radius:--spacing(4)] [--foldable-surface:var(--background)] [--foldable-w:min(20rem,calc(50vw-2rem))] supports-[height:round(1px,1px)]:[--foldable-h:round(var(--foldable-w)*7/5,1px)]",
          className
        )}
        {...props}
      />
    </FoldableContext>
  )
}

type DragState = {
  pointerId: number
  startX: number
  startProgress: number
  width: number
  moved: boolean
}

/**
 * The paper folds in 3D; the content in `children` stays flat, framed by
 * wherever the paper is.
 */
export function FoldableStage({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { progress } = useFoldable()
  const shouldReduceMotion = useReducedMotion()

  // Half a page right keeps the spread centered where the closed page sat.
  const x = useTransform(progress, (p) => `${clamp01(p) * 50}%`)
  const rotateY = useTransform(progress, [0, 1], [0, -180])

  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<DragState | null>(null)

  function settle(target: 0 | 1, velocity = 0) {
    if (shouldReduceMotion) {
      animate(progress, target, { duration: 0.2, ease: "easeOut" })
      return
    }

    animate(progress, target === 1 ? 1 + LANDING : -LANDING, {
      type: "spring",
      bounce: 0,
      visualDuration: 0.5,
      velocity,
      onUpdate: (latest) => {
        if (target === 1 ? latest < 1 : latest > 0) return
        progress.stop()
        progress.set(target)
      },
    })
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return

    event.currentTarget.setPointerCapture(event.pointerId)
    // Catches the cover mid-turn.
    progress.stop()

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startProgress: progress.get(),
      width: event.currentTarget.offsetWidth,
      moved: false,
    }
    setIsDragging(true)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.startX
    if (Math.abs(deltaX) > 3) drag.moved = true

    progress.set(
      clamp01(drag.startProgress - deltaX / (drag.width * DRAG_TRAVEL))
    )
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null
    setIsDragging(false)

    const current = progress.get()

    // A tap turns to the other side, with no velocity to carry.
    if (!drag.moved) {
      settle(current < 0.5 ? 1 : 0)
      return
    }

    const velocity = progress.getVelocity()
    settle(current + velocity * FLICK_PROJECTION > 0.5 ? 1 : 0, velocity)
  }

  return (
    // Sized to the closed page so the vanishing point stays at its center. The
    // margin, rounded like the height, makes room for the cover rising past it
    // as it turns. Safari ignores the perspective of a stage it first drew flat,
    // so the stage keeps its own layer from the start.
    <div
      data-slot="foldable-stage"
      className={cn(
        "relative my-[calc(var(--foldable-h)*var(--foldable-rise))] h-(--foldable-h) w-(--foldable-w) will-change-transform supports-[height:round(1px,1px)]:my-[round(var(--foldable-h)*var(--foldable-rise),1px)]",
        className
      )}
      style={
        {
          perspective: `calc(var(--foldable-w) * ${PERSPECTIVE})`,
          "--foldable-rise": MAX_RISE,
        } as CSSProperties
      }
    >
      {/* Pointer-only; FoldableSlider is the accessible control. */}
      <motion.div
        aria-hidden
        data-dragging={isDragging || undefined}
        className="absolute inset-0 cursor-grab touch-none select-none transform-3d data-dragging:cursor-grabbing"
        style={{ x }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <motion.div
          className="absolute inset-0 origin-left transform-3d"
          style={{ rotateY }}
        >
          <CoverBody />
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ x }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * The black wedges above and below the flat content while the cover turns, with
 * their edge line: one sheet seen from both sides, shaped by clip-path because
 * a changing radius repaints.
 */
function CoverBody() {
  const { progress } = useFoldable()
  const clipPath = useTransform(progress, (p) => {
    const { radius } = getCoverShape(clamp01(p))
    return `inset(0 round 0 ${radius} ${radius} 0)`
  })
  const bodyClipPath = useTransform(progress, (p) => {
    const line = `${LINE_WIDTH}px`
    const radius = `calc(${getCoverShape(clamp01(p)).radius} - ${line})`
    return `inset(${line} ${line} ${line} 0 round 0 ${radius} ${radius} 0)`
  })
  // Hidden lying flat, where its softer edge would thicken the line; not faded
  // in, or the line blinks.
  const opacity = useTransform(progress, (p) => (isTurning(p) ? 1 : 0))

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-foreground"
      style={{ clipPath, opacity }}
    >
      <motion.div
        className="absolute inset-0 bg-black"
        style={{ clipPath: bodyClipPath }}
      />
    </motion.div>
  )
}

/** Content of the page the cover closes over: the right half of the spread. */
export function FoldableInsideRight({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { progress, shade } = useFoldable()
  const clipPath = useTransform(
    progress,
    (p) => `inset(0 0 0 ${clamp01(projectFreeEdge(clamp01(p))) * 100}%)`
  )

  return (
    <motion.div
      data-slot="foldable-inside-right"
      className={cn("absolute inset-0", className)}
      style={{ clipPath }}
    >
      {/* Rounded apart from the reveal, so a thin sliver still ends in the
          page's corner. */}
      <div className="absolute inset-0 bg-(--foldable-surface) [clip-path:inset(0_round_0_var(--foldable-radius)_var(--foldable-radius)_0)]">
        {children}
        {/* A shade, not a brightness filter, which would repaint each frame. */}
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: shade }}
        />
        {/* Over the shade, so the line is the same at any light. */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 rounded-r-(--foldable-radius)",
            LINE_RING,
            LINE_PAST_HINGE.insideRight
          )}
        />
      </div>
    </motion.div>
  )
}

/** Content on the outside of the cover, shown while closed. */
export function FoldableCover(props: {
  className?: string
  children: ReactNode
}) {
  return <CoverSide side="cover" {...props} />
}

/** Content on the inside of the cover: the left half of the spread. */
export function FoldableInsideLeft(props: {
  className?: string
  children: ReactNode
}) {
  return <CoverSide side="insideLeft" {...props} />
}

/**
 * A side of the cover: blurred copies of the print, dim and fade overlays, and
 * the edge line. Per-frame values only touch transform, opacity, clip-path and
 * mask, never inherited custom properties, which would restyle every element
 * below each frame.
 */
function CoverSide({
  side,
  className,
  children,
}: {
  side: keyof typeof COVER_SIDES
  className?: string
  children: ReactNode
}) {
  const { progress, shade } = useFoldable()
  const { freeSide, focus, isInside } = COVER_SIDES[side]
  const direction = freeSide === "right" ? "to right" : "to left"
  const sign = freeSide === "right" ? 1 : -1
  // Lifted, the free edge can project past the content's width; stretch to meet
  // it.
  const scaleX = useTransform(progress, (p) =>
    Math.max(sign * projectFreeEdge(clamp01(p)), 1)
  )
  const clipPath = useTransform(progress, (p) =>
    coverClip(freeSide, clamp01(p))
  )
  // While turning, the print stops a line's width short above and below, so the
  // body's line runs at full width down to the hinge and meets the page's.
  const boxClipPath = useTransform(
    progress,
    (p) => `inset(${isTurning(p) ? LINE_WIDTH : 0}px 0)`
  )
  // A clip alone does not reliably keep a turned-away side's blurred copies
  // from being drawn.
  const visibility = useTransform(progress, (p) =>
    sign * projectFreeEdge(clamp01(p)) > 0 ? "visible" : "hidden"
  )
  // The line follows the projected edge: thinning as the face turns away,
  // taller as it rises.
  const edgeScaleX = useTransform(progress, (p) =>
    clamp01(sign * projectFreeEdge(clamp01(p)))
  )
  const edgeScaleY = useTransform(progress, (p) => scaleFreeEdge(clamp01(p)))
  const dimOpacity = useTransform(progress, (p) =>
    Math.min(1, DIM_GAIN * focus.strength(clamp01(p)))
  )
  // One page wide and stretched by scaleX, which takes far less texture than a
  // strip as long as its tail.
  const fadeX = useTransform(progress, (p) => {
    const from = getLevelReach(focus, p, FADE_LEVELS[0])
    return `${sign * Math.min(from, FADE_STRETCH * FADE_TAIL) * 100}%`
  })
  const fadeScaleX = useTransform(progress, (p) => {
    const [from, to] = FADE_LEVELS.map((level) =>
      getLevelReach(focus, p, level)
    )
    return Math.min(Math.max(to - from, 0.01), FADE_STRETCH) * FADE_TAIL
  })

  return (
    <motion.div
      data-slot={COVER_SIDES[side].slot}
      className={cn("absolute", COVER_SIDES[side].className, className)}
      style={{ scaleX, visibility, clipPath: boxClipPath }}
    >
      <motion.div
        className="absolute inset-0 bg-(--foldable-surface)"
        style={{ clipPath }}
      >
        {PRINT_LEVELS.map((step, index) => (
          <PrintCopy
            key={step.level}
            focus={focus}
            direction={direction}
            index={index}
          >
            {children}
          </PrintCopy>
        )).reverse()}
        {/* The overlays run a pixel past the box like the copies' paper, so one
            cut ends them on the same row; ending on the box, a row of unlit
            paper shows at fractional positions. */}
        <motion.div
          className="absolute inset-x-0 -inset-y-px"
          style={{
            backgroundImage: DIM_GRADIENT[freeSide],
            opacity: dimOpacity,
          }}
        />
        <motion.div
          className={cn(
            "absolute -inset-y-px w-full will-change-transform",
            freeSide === "right" ? "left-0 origin-left" : "right-0 origin-right"
          )}
          style={{
            backgroundImage: FADE_GRADIENT[freeSide],
            x: fadeX,
            scaleX: fadeScaleX,
          }}
        />
        {isInside && (
          <motion.div
            className="absolute inset-x-0 -inset-y-px bg-black"
            style={{ opacity: shade }}
          />
        )}
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0",
            LINE_RING,
            freeSide === "right"
              ? "right-0 origin-left rounded-r-(--foldable-radius)"
              : cn("rounded-l-(--foldable-radius)", LINE_PAST_HINGE.insideLeft)
          )}
          style={{ scaleX: edgeScaleX, scaleY: edgeScaleY }}
        />
      </motion.div>
    </motion.div>
  )
}

/**
 * The print at one blur level, shown from where the blur climbs to it until the
 * next level takes over. It stays hidden before that, or its dark edge would
 * show through the copy above as a fringe.
 */
function PrintCopy({
  focus,
  direction,
  index,
  children,
}: {
  focus: FaceFocus
  direction: string
  /** Index into PRINT_LEVELS, from the sharpest. */
  index: number
  children: ReactNode
}) {
  const { progress } = useFoldable()
  const step = PRINT_LEVELS[index]
  const maskImage = useTransform(progress, (p) => {
    const reach = (i: number) => getLevelReach(focus, p, PRINT_LEVELS[i].level)
    if (index > 0 && reach(index) === BEYOND) return MASK_NONE

    const stops = [`black ${toPercent(reach(index))}`]
    if (index >= 2) {
      stops.unshift(
        `transparent ${toPercent(reach(index - 2))}`,
        `black ${toPercent(reach(index - 1))}`
      )
    }
    if (index < PRINT_LEVELS.length - 1 && reach(index + 1) !== BEYOND) {
      stops.push(`transparent ${toPercent(reach(index + 1))}`)
    }

    return stops.length > 1
      ? `linear-gradient(${direction}, ${stops.join(", ")})`
      : MASK_WHOLE
  })

  return (
    <motion.div
      className={cn(
        "absolute mask-center mask-no-repeat",
        step.body,
        step.bleed,
        step.blur,
        step.mask
      )}
      style={{ maskImage }}
    >
      <div
        className={cn(
          "absolute inset-x-0 overflow-hidden bg-(--foldable-surface)",
          step.paper
        )}
      >
        <div className={cn("absolute", step.print)}>{children}</div>
      </div>
    </motion.div>
  )
}

export function FoldableSlider({ className }: { className?: string }) {
  const labelId = useId()
  const { progress } = useFoldable()

  // Controlled, as the cover also moves by drag and spring. Only this
  // re-renders as it turns.
  const [value, setValue] = useState(0)
  useMotionValueEvent(progress, "change", (p) => setValue(clamp01(p)))

  return (
    <div className={cn("flex w-64 flex-col gap-3", className)}>
      <p id={labelId} className="text-sm text-muted-foreground">
        Move slider to open and close.
      </p>
      <Slider
        aria-labelledby={labelId}
        min={0}
        max={1}
        step={0.001}
        largeStep={0.1}
        value={[value]}
        onValueChange={(next) => {
          progress.stop()
          progress.set(typeof next === "number" ? next : next[0])
        }}
      />
    </div>
  )
}
