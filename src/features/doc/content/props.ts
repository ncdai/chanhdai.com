import type { motion } from "motion/react"
import type { ComponentProps } from "react"

import type { Button } from "@/components/ui/button"
import type { AppleHelloVietnameseEffect } from "@/registry/components/apple-hello-effect"
import type { CopyButton } from "@/registry/components/copy-button"
import type { ScrollFadeEffect } from "@/registry/components/scroll-fade-effect"
import type { ShimmeringText } from "@/registry/components/shimmering-text"
import type {
  SlideToUnlock,
  SlideToUnlockText,
} from "@/registry/components/slide-to-unlock"
import type { TestimonialSpotlight } from "@/registry/components/testimonial-spotlight"

export type AppleHelloEffectProps = Omit<
  ComponentProps<typeof AppleHelloVietnameseEffect>,
  keyof Omit<ComponentProps<typeof motion.svg>, "speed" | "onAnimationComplete">
>

export type ShimmeringTextProps = Omit<
  ComponentProps<typeof ShimmeringText>,
  keyof ComponentProps<typeof motion.span>
>

export type SlideToUnlockRootProps = Omit<
  ComponentProps<typeof SlideToUnlock>,
  keyof ComponentProps<"div">
>

export type SlideToUnlockTextProps = Omit<
  ComponentProps<typeof SlideToUnlockText>,
  keyof Omit<ComponentProps<typeof motion.div>, "children">
>

export type ScrollFadeEffectProps = Omit<
  ComponentProps<typeof ScrollFadeEffect>,
  keyof ComponentProps<"div">
>

export type CopyButtonProps = Omit<
  ComponentProps<typeof CopyButton>,
  keyof ComponentProps<typeof Button>
>

export type HapticProps = {
  /**
   * Trigger haptic feedback on mobile devices.
   * Uses Vibration API on Android/modern browsers, and iOS checkbox trick on iOS.
   *
   * @param pattern - Vibration duration (ms) or pattern.
   * Custom patterns only work on Android devices. iOS uses fixed feedback.
   * See [Vibration API](https://developer.mozilla.org/docs/Web/API/Vibration_API)
   *
   * @example
   *
   * ```tsx
   * import { haptic } from "@/lib/haptic"
   *
   * <Button onClick={() => haptic()}>Haptic</Button>
   * ```
   */
  haptic: (pattern?: number | number[]) => void
}

export type TestimonialSpotlightProps = ComponentProps<
  typeof TestimonialSpotlight
>
