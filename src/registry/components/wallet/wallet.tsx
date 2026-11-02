"use client"

import {
  Children,
  createContext,
  use,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import type { ComponentProps, ReactNode, RefObject } from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from "motion/react"
import type {
  LegacyAnimationControls,
  TargetAndTransition,
  Transition,
} from "motion/react"

import { cn } from "@/lib/utils"

// 384x240 pocket with a thumb notch cut from the top edge.
const POCKET_PATH =
  "M24 0H140C158 0 164 32 192 32C220 32 226 0 244 0H360A24 24 0 0 1 384 24V216A24 24 0 0 1 360 240H24A24 24 0 0 1 0 216V24A24 24 0 0 1 24 0Z"

// Open along the top, where the cards go in.
const STITCH_PATH = "M12 24V216A12 12 0 0 0 24 228H360A12 12 0 0 0 372 216V24"

// Distances are spacing steps of the stage, matching `h-56` on the card.
const CARD_HEIGHT = 56
const CARD_REVEAL = 9
const PEEK_REVEAL = 4
const PULL_REVEAL = 52

const ENTER_DELAY = 0.12
const ENTER_STAGGER = 0.08
const ENTER_SHINE_DELAY = 0.5

const PULL_SPRING: Transition = {
  type: "spring",
  visualDuration: 0.4,
  bounce: 0.25,
}

const SETTLE_SPRING: Transition = {
  type: "spring",
  visualDuration: 0.25,
  bounce: 0,
}

const REDUCED_TRANSITION: Transition = { duration: 0 }

// `null` starts from the current scale, so a quick second pull doesn't jump.
const SQUEEZE = {
  scaleX: [null, 1.006, 1],
  scaleY: [null, 0.985, 1],
  transition: { duration: 0.36, times: [0, 0.36, 1], ease: "easeOut" },
} satisfies TargetAndTransition

type WithChildren<Props> = Omit<Props, "children"> & { children?: ReactNode }

// Percent of the card's own height, so travel follows the rendered size.
function getCardY(steps: number) {
  return `${(-steps / CARD_HEIGHT) * 100}%`
}

function getTargetY(
  index: number,
  count: number,
  activeIndex: number | null,
  peekIndex: number | null
) {
  if (activeIndex !== null) {
    return getCardY(index === activeIndex ? PULL_REVEAL : 0)
  }

  // Cards behind the peeked one rise with it, so none of them gets covered.
  const isPeeking = peekIndex !== null && index <= peekIndex
  return getCardY((count - index) * CARD_REVEAL + (isPeeking ? PEEK_REVEAL : 0))
}

type WalletContextValue = {
  activeIndex: number | null
  peekIndex: number | null
  isInView: boolean
  isEntering: boolean
  pocketControls: LegacyAnimationControls
  selectCard: (index: number | null) => void
  peekCard: (index: number | null) => void
  finishEntering: () => void
}

const WalletContext = createContext<WalletContextValue | null>(null)

function useWallet() {
  const context = use(WalletContext)
  if (!context) throw new Error("Wallet parts must be used within <Wallet>")
  return context
}

const WalletCardSlotContext = createContext<{
  index: number
  count: number
} | null>(null)

type WalletCardContextValue = {
  index: number
  isActive: boolean
  triggerRef: RefObject<HTMLButtonElement | null>
}

const WalletCardContext = createContext<WalletCardContextValue | null>(null)

function useWalletCard() {
  const context = use(WalletCardContext)
  if (!context) {
    throw new Error("WalletCard parts must be used within <WalletCard>")
  }
  return context
}

export function Wallet({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const rootRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(rootRef, { once: true, amount: 0.5 })
  const shouldReduceMotion = useReducedMotion()
  const pocketControls = useAnimationControls()

  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [peekIndex, setPeekIndex] = useState<number | null>(null)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    if (isInView && !shouldReduceMotion) pocketControls.start(SQUEEZE)
  }, [isInView, pocketControls, shouldReduceMotion])

  const context = useMemo(
    () => ({
      activeIndex,
      peekIndex,
      isInView,
      isEntering: isInView && !hasEntered,
      pocketControls,
      // Any interaction ends the intro, so its stagger never holds a card back.
      selectCard: (index: number | null) => {
        setHasEntered(true)
        setActiveIndex(index)
        // A card that moved away leaves its hover behind under a still pointer.
        setPeekIndex(null)
        if (index !== null && !shouldReduceMotion) {
          pocketControls.start(SQUEEZE)
        }
      },
      peekCard: (index: number | null) => {
        if (shouldReduceMotion) return
        setHasEntered(true)
        setPeekIndex(index)
      },
      finishEntering: () => setHasEntered(true),
    }),
    [
      activeIndex,
      peekIndex,
      isInView,
      hasEntered,
      pocketControls,
      shouldReduceMotion,
    ]
  )

  return (
    <WalletContext value={context}>
      <div
        ref={rootRef}
        data-slot="wallet"
        className={cn("@container w-96 max-w-full select-none", className)}
        {...props}
      >
        {/* Every length inside is a spacing step, so this scales with the root.
            Radii and type are `cqw`: lint folds spacing radii to fixed ones. */}
        <div className="relative [--spacing:calc(100cqw/96)]">{children}</div>
      </div>
    </WalletContext>
  )
}

export function WalletCards({
  className,
  children,
  onPointerLeave,
  ...props
}: ComponentProps<"ul">) {
  const { peekCard } = useWallet()
  const cards = Children.toArray(children)

  return (
    // The height is the headroom a pulled card rises into.
    <ul
      role="list"
      data-slot="wallet-cards"
      className={cn("relative h-52", className)}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        peekCard(null)
      }}
      {...props}
    >
      {cards.map((card, index) => (
        <WalletCardSlotContext
          key={index}
          value={{ index, count: cards.length }}
        >
          {card}
        </WalletCardSlotContext>
      ))}
    </ul>
  )
}

export function WalletCard({
  className,
  children,
  onPointerMove,
  ...props
}: WithChildren<ComponentProps<typeof motion.li>>) {
  const slot = use(WalletCardSlotContext)
  if (!slot) throw new Error("WalletCard must be used within <WalletCards>")

  const { index, count } = slot
  const {
    activeIndex,
    peekIndex,
    isInView,
    isEntering,
    selectCard,
    peekCard,
    finishEntering,
  } = useWallet()
  const shouldReduceMotion = useReducedMotion()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const isActive = index === activeIndex
  const isFront = index === count - 1

  useEffect(() => {
    if (!isActive) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return

      // The card's content turns inert, which would drop focus to the body.
      const trigger = triggerRef.current
      if (trigger?.closest("li")?.contains(document.activeElement)) {
        trigger.focus()
      }
      selectCard(null)
    }

    function handlePointerDown(event: PointerEvent) {
      const cards = triggerRef.current?.closest('[data-slot="wallet-cards"]')
      const card = (event.target as Element).closest(
        '[data-slot="wallet-card"]'
      )
      if (!card || !cards?.contains(card)) selectCard(null)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [isActive, selectCard])

  const context = useMemo(
    () => ({ index, isActive, triggerRef }),
    [index, isActive]
  )

  function getCardTransition(): Transition {
    if (shouldReduceMotion) return REDUCED_TRANSITION

    if (isEntering) {
      return { ...PULL_SPRING, delay: ENTER_DELAY + index * ENTER_STAGGER }
    }

    return activeIndex === null ? SETTLE_SPRING : PULL_SPRING
  }

  return (
    <WalletCardContext value={context}>
      <motion.li
        data-slot="wallet-card"
        data-active={isActive || undefined}
        className={cn(
          "absolute inset-x-4 top-full h-56 overflow-hidden rounded-[3cqw] bg-card text-card-foreground shadow-[0_--spacing(-1.5)_--spacing(4)_--spacing(-2)_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.18)] inset-ring inset-ring-white/10",
          className
        )}
        initial={false}
        animate={{
          y: isInView
            ? getTargetY(index, count, activeIndex, peekIndex)
            : getCardY(0),
        }}
        transition={getCardTransition()}
        onAnimationComplete={() => {
          if (isFront && isEntering) finishEntering()
        }}
        // Not enter: a settling card leaves a stale hover under a still pointer.
        onPointerMove={(event) => {
          onPointerMove?.(event)
          if (event.pointerType !== "touch") peekCard(index)
        }}
        {...props}
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-linear-160 from-white/15 to-transparent to-45%"
        />
        {children}
        {isFront && <WalletCardShine />}
      </motion.li>
    </WalletCardContext>
  )
}

function WalletCardShine() {
  const { isInView } = useWallet()
  const shouldReduceMotion = useReducedMotion()
  const controls = useAnimationControls()

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return

    controls.start({
      x: ["-170%", "430%"],
      opacity: [0, 1, 1, 0],
      transition: {
        delay: ENTER_SHINE_DELAY,
        duration: 0.8,
        ease: "easeInOut",
      },
    })
  }, [controls, isInView, shouldReduceMotion])

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-[46%] bg-linear-to-r from-transparent via-white/50 to-transparent"
      initial={{ x: "-170%", skewX: -16, opacity: 0 }}
      animate={controls}
    />
  )
}

export function WalletCardHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="wallet-card-header"
      className={cn(
        "flex h-9 items-center justify-between gap-2 px-3.5",
        className
      )}
      {...props}
    />
  )
}

export function WalletCardTitle({
  className,
  children,
  render,
  ...props
}: useRender.ComponentProps<"h3">) {
  const { index, isActive, triggerRef } = useWalletCard()
  const { selectCard, peekCard } = useWallet()

  return useRender({
    defaultTagName: "h3",
    render,
    state: { slot: "wallet-card-title" },
    props: mergeProps<"h3">(
      {
        className: cn(
          "min-w-0 text-[3.75cqw] leading-normal font-medium",
          className
        ),
        children: (
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={isActive}
            className="group/wallet-trigger block max-w-full cursor-pointer truncate outline-none"
            onClick={() => selectCard(isActive ? null : index)}
            onFocus={(event) => {
              if (event.target.matches(":focus-visible")) peekCard(index)
            }}
            onBlur={() => peekCard(null)}
          >
            {/* Stretched over the card, so inner links stay outside the button. */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-[3cqw] group-focus-visible/wallet-trigger:inset-ring-2 group-focus-visible/wallet-trigger:inset-ring-current"
            />
            {children}
          </button>
        ),
      },
      props
    ),
  })
}

export function WalletCardDescription({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="wallet-card-description"
      className={cn(
        "flex shrink-0 items-center gap-1.5 font-mono text-[2.5cqw] leading-none tracking-wider uppercase opacity-70 [&_svg]:size-[3.75cqw]",
        className
      )}
      {...props}
    />
  )
}

export function WalletCardContent({
  className,
  ...props
}: ComponentProps<"div">) {
  const { isActive } = useWalletCard()

  return (
    // Clicks fall through to the trigger, except on inner links and buttons.
    <div
      data-slot="wallet-card-content"
      inert={!isActive}
      className={cn(
        "pointer-events-none absolute inset-x-3.5 bottom-7 [&_a,&_button]:pointer-events-auto",
        className
      )}
      {...props}
    />
  )
}

export function WalletPocket({
  className,
  children,
  ...props
}: WithChildren<ComponentProps<typeof motion.div>>) {
  const { pocketControls } = useWallet()
  const id = useId()
  const grainId = `${id}-grain`
  const shadeId = `${id}-shade`

  return (
    <motion.div
      data-slot="wallet-pocket"
      className={cn(
        "pointer-events-none relative z-10 h-60 origin-bottom will-change-transform",
        className
      )}
      animate={pocketControls}
      {...props}
    >
      <svg
        aria-hidden
        viewBox="0 0 384 240"
        className="absolute inset-0 size-full overflow-visible drop-shadow-[0_--spacing(-0.75)_--spacing(1.5)_rgb(0_0_0/0.15)]"
      >
        <defs>
          {/* Lit noise becomes alpha, so the grain takes the fill's color. */}
          <filter id={grainId} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="3"
              seed="7"
            />
            <feDiffuseLighting surfaceScale="0.6" lightingColor="#fff">
              <feDistantLight azimuth="235" elevation="55" />
            </feDiffuseLighting>
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 0 0 0 1"
            />
            <feComposite in="SourceGraphic" operator="in" />
          </filter>

          <linearGradient id={shadeId} x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="white" stopOpacity="0.1" />
            <stop offset="0.3" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="black" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* Only the pocket shape blocks the cards, so the notch stays clickable. */}
        <path d={POCKET_PATH} className="pointer-events-auto fill-surface" />
        <path
          d={POCKET_PATH}
          filter={`url(#${grainId})`}
          className="fill-foreground opacity-15"
        />
        <path d={POCKET_PATH} fill={`url(#${shadeId})`} />
        <path
          d={POCKET_PATH}
          className="fill-none stroke-foreground/10"
          vectorEffect="non-scaling-stroke"
        />

        <path
          d={STITCH_PATH}
          fill="none"
          strokeWidth={2}
          className="stroke-foreground/10"
        />
        <path
          d={STITCH_PATH}
          fill="none"
          strokeWidth={1.5}
          strokeDasharray="5 5"
          strokeLinecap="round"
          className="stroke-foreground/25"
        />
      </svg>

      {children}
    </motion.div>
  )
}

export function WalletLabel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="wallet-label"
      className={cn(
        "absolute bottom-7 left-7 flex items-center gap-2 text-[5.25cqw] leading-none font-medium text-foreground/80 [&_svg]:h-[4.5cqw] [&_svg]:w-auto",
        className
      )}
      {...props}
    />
  )
}
