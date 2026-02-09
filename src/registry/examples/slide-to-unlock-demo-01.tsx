"use client"

import { toast } from "sonner"

import { useSound } from "@/hooks/use-sound"
import { ShimmeringText } from "@/registry/components/shimmering-text"
import {
  SlideToUnlock,
  SlideToUnlockHandle,
  SlideToUnlockText,
  SlideToUnlockTrack,
} from "@/registry/components/slide-to-unlock"

export default function SlideToUnlockDemo1() {
  const playSound = useSound("/audio/ui-sounds/unlock.wav")

  return (
    <SlideToUnlock
      onUnlock={() => {
        playSound()
        toast.success("Unlocked")
      }}
    >
      <SlideToUnlockTrack>
        <SlideToUnlockText>
          {({ isDragging }) => (
            <ShimmeringText text="slide to unlock" isStopped={isDragging} />
          )}
        </SlideToUnlockText>
        <SlideToUnlockHandle />
      </SlideToUnlockTrack>
    </SlideToUnlock>
  )
}
