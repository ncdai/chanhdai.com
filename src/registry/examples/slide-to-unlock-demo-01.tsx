"use client"

import { toast } from "sonner"

import { ShimmeringText } from "@/registry/components/shimmering-text"
import {
  SlideToUnlock,
  SlideToUnlockHandle,
  SlideToUnlockText,
  SlideToUnlockTrack,
} from "@/registry/components/slide-to-unlock"
import { useSound } from "@/registry/hooks/sound/use-sound"

export default function SlideToUnlockDemo1() {
  const [play] = useSound("https://assets.chanhdai.com/sounds/ios/unlock.mp3", {
    volume: 0.5,
  })

  return (
    <SlideToUnlock
      onUnlock={() => {
        play()
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
