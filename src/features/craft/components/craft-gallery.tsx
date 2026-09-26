import Image from "next/image"

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
  return (
    <AppleCarouselRoot>
      {/* Two cards per view from @md, so portrait photos fit uncropped. */}
      <AppleCarouselContent className="scroll-ps-(--apple-carousel-padding) [--apple-carousel-gap:--spacing(2)] @md:[--apple-carousel-item-width:calc((100cqw-2*var(--apple-carousel-padding)-var(--apple-carousel-gap))/2)]">
        {images.map((image) => (
          <AppleCarouselItem
            key={image.src}
            className="aspect-2/3 h-auto snap-start rounded-xl @max-5xl:h-auto @max-3xl:h-auto"
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
