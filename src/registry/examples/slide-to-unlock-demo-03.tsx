"use client"

import { toast } from "sonner"

import { ShimmeringText } from "@/registry/components/shimmering-text"
import {
  SlideToUnlock,
  SlideToUnlockHandle,
  SlideToUnlockText,
  SlideToUnlockTrack,
} from "@/registry/components/slide-to-unlock"

export default function SlideToUnlockDemo3() {
  return (
    <SlideToUnlock
      className="w-[180px] rounded-full ring-0"
      handleWidth={40}
      onUnlock={() => toast.success("Stopped")}
    >
      <SlideToUnlockTrack>
        <SlideToUnlockText className="pl-0">
          {({ isDragging }) => (
            <ShimmeringText text="slide to stop" isStopped={isDragging} />
          )}
        </SlideToUnlockText>

        <SlideToUnlockHandle className="w-10 rounded-full dark:bg-zinc-700">
          <svg
            className="size-5 dark:text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
          >
            <path
              d="M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z"
              fill="currentColor"
            />
          </svg>
        </SlideToUnlockHandle>
      </SlideToUnlockTrack>
    </SlideToUnlock>
  )
}
