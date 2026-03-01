export interface HapticType {
  /**
   * Trigger haptic feedback on mobile devices.
   *
   * Uses Vibration API on Android/modern browsers, and iOS checkbox trick on iOS.
   *
   * @param pattern - Vibration duration (ms) or pattern. Custom patterns only work on Android devices. iOS uses fixed feedback. See [Vibration API](https://developer.mozilla.org/docs/Web/API/Vibration_API)
   *
   * @example
   *
   * ```tsx
   * import { haptic } from "@/lib/haptic"
   *
   * <Button onClick={haptic}>Haptic</Button>
   * ```
   */
  haptic: (pattern?: number | number[]) => void

  /**
   * Boolean constant that checks if the device likely supports haptic feedback.
   *
   * Detects mobile devices using the `pointer: coarse` media query.
   */
  supportsHaptic: boolean
}
