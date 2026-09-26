import Image from "next/image"

import { cn } from "@/lib/utils"
import {
  AppleCarouselContent,
  AppleCarouselControls,
  AppleCarouselItem,
  AppleCarouselPlayButton,
  AppleCarouselRoot,
  AppleCarouselTab,
  AppleCarouselTabList,
} from "@/registry/components/apple-carousel"

import type { CraftImage } from "../types"

export function CraftGallery({ images }: { images: CraftImage[] }) {
  // Cards share the first photo's ratio so the height holds between slides.
  const [{ width, height }] = images
  const isPortrait = height > width

  return (
    <AppleCarouselRoot>
      {/* Only the next card peeks in, on the right and unfaded: fading
          washes dark photos out on light themes. */}
      <AppleCarouselContent className="scroll-ps-(--apple-carousel-padding) [--apple-carousel-gap:--spacing(2)] [--apple-carousel-padding:--spacing(2)] [--craft-gallery-peek:--spacing(10)]">
        {images.map((image) => (
          <AppleCarouselItem
            key={image.src}
            className={cn(
              "h-auto w-[calc(100cqw-var(--apple-carousel-padding)-var(--apple-carousel-gap)-var(--craft-gallery-peek))] snap-start rounded-xl @max-5xl:h-auto @max-3xl:h-auto",
              // Two portrait photos per view from @md, so they fit uncropped.
              isPortrait &&
                "@md:w-[calc((100cqw-var(--apple-carousel-padding)-2*var(--apple-carousel-gap)-var(--craft-gallery-peek))/2)]"
            )}
            style={{ aspectRatio: `${width} / ${height}` }}
          >
            <Image
              className="size-full object-cover select-none"
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              unoptimized
            />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] inset-ring-1 inset-ring-black/10 dark:inset-ring-white/10" />
          </AppleCarouselItem>
        ))}
      </AppleCarouselContent>

      <AppleCarouselControls size="sm">
        <AppleCarouselTabList aria-label="Photos">
          {images.map((image, index) => (
            <AppleCarouselTab key={image.src}>
              Photo {index + 1}
            </AppleCarouselTab>
          ))}
        </AppleCarouselTabList>
        <AppleCarouselPlayButton />
      </AppleCarouselControls>
    </AppleCarouselRoot>
  )
}
