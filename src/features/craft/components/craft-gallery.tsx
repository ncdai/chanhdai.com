"use client"

import type { ImageProps } from "next/image"
import Image from "next/image"

import { cn } from "@/lib/utils"
import {
  Lightbox,
  LightboxClose,
  LightboxContent,
  LightboxFooter,
  LightboxHeader,
  LightboxItem,
  LightboxMedia,
  LightboxNext,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxThumbnail,
  LightboxThumbnailStrip,
  LightboxThumbnailStripTrack,
  LightboxTrigger,
  LightboxZoom,
  LightboxZoomIn,
  LightboxZoomOut,
} from "@/registry/components/lightbox"

import type { CraftImage } from "../types"

const MAX_TILES = 4

export function CraftGallery({
  images,
  label,
  imageLoading,
}: {
  images: CraftImage[]
  label: string
  imageLoading?: ImageProps["loading"]
}) {
  const count = images.length
  const tiles = images.slice(0, MAX_TILES)
  const hiddenCount = count - tiles.length
  const isPortrait = images[0].height > images[0].width

  return (
    // Closing on an image past the last tile morphs back into the "+N" tile.
    <Lightbox morphTo="closest">
      <div
        className={cn(
          "grid gap-0.5",
          count > 1 && [
            "grid-cols-2 grid-rows-2",
            isPortrait ? "aspect-square" : "aspect-video",
          ]
        )}
      >
        {tiles.map((image, index) => {
          const isLastTile = index === tiles.length - 1 && hiddenCount > 0

          return (
            <LightboxTrigger
              key={image.src}
              index={index}
              crossfade={isLastTile ? "both" : undefined}
              className={cn(
                // Each tile rounds only the corners it sits on, since the
                // morph reads the tile's own radius.
                "relative overflow-hidden",
                count === 1
                  ? "rounded-xl"
                  : "first:rounded-ss-xl last:rounded-ee-xl",
                count === 2 && "row-span-2 last:rounded-se-xl",
                count === 3 && "first:row-span-2",
                count > 1 && count < 4 && "first:rounded-es-xl",
                count > 2 && "nth-2:rounded-se-xl",
                count > 3 && "nth-3:rounded-es-xl"
              )}
            >
              {({ imageRef }) => (
                <>
                  <Image
                    ref={imageRef}
                    className={cn(
                      "rounded-[inherit] bg-muted outline -outline-offset-1 outline-foreground/10 select-none",
                      count === 1 ? "h-auto w-full" : "size-full object-cover"
                    )}
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading={imageLoading}
                    unoptimized
                  />
                  {isLastTile && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-2xl font-medium text-white">
                      +{hiddenCount}
                    </span>
                  )}
                </>
              )}
            </LightboxTrigger>
          )
        })}
      </div>

      <LightboxContent aria-label={label}>
        <LightboxSlides>
          {images.map((image, index) => (
            <LightboxSlide key={image.src}>
              <LightboxItem index={index}>
                <LightboxZoom>
                  <LightboxMedia width={image.width} height={image.height}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      draggable={false}
                      unoptimized
                    />
                  </LightboxMedia>
                </LightboxZoom>
              </LightboxItem>
            </LightboxSlide>
          ))}
        </LightboxSlides>

        <LightboxHeader>
          <LightboxZoomOut />
          <LightboxZoomIn />
          <LightboxClose />
        </LightboxHeader>

        {count > 1 && (
          <>
            <LightboxPrevious />
            <LightboxNext />

            <LightboxFooter>
              <LightboxThumbnailStrip>
                <LightboxThumbnailStripTrack aria-label="Photos">
                  {images.map((image, index) => (
                    <LightboxThumbnail key={image.src} index={index}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        unoptimized
                      />
                    </LightboxThumbnail>
                  ))}
                </LightboxThumbnailStripTrack>
              </LightboxThumbnailStrip>
            </LightboxFooter>
          </>
        )}
      </LightboxContent>
    </Lightbox>
  )
}
