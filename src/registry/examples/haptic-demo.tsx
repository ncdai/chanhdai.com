"use client"

import { Button } from "@/components/ui/button"
import { haptic, supportsHaptic } from "@/lib/haptic"

export default function HapticDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => haptic()}>Haptic</Button>

      {!supportsHaptic && (
        <p className="text-sm text-muted-foreground">
          Visit on mobile to experience haptic feedback.
        </p>
      )}
    </div>
  )
}
