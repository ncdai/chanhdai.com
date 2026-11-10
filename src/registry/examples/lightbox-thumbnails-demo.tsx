"use client"

import { cn } from "@/lib/utils"
import {
  Lightbox,
  LightboxCaption,
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
} from "@/registry/components/lightbox"

export default function LightboxThumbnailsDemo() {
  return (
    <Lightbox>
      <div className="grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-3">
        {PHOTOS.map((photo, index) => (
          <LightboxTrigger
            key={photo.src}
            index={index}
            className={cn(
              "overflow-hidden rounded-lg",
              index === 0 && "col-span-2 sm:col-span-3"
            )}
          >
            {({ imageRef }) => (
              <img
                ref={imageRef}
                className="block h-auto w-full rounded-[inherit] outline -outline-offset-1 outline-foreground/10"
                // The wide cover tile needs the full-size image to stay sharp.
                src={index === 0 ? photo.src : photo.thumbnail}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
              />
            )}
          </LightboxTrigger>
        ))}
      </div>

      <LightboxContent aria-label="Photos of Vietnam">
        <LightboxSlides aria-label="Photos" aria-roledescription="carousel">
          {PHOTOS.map((photo, index) => (
            <LightboxSlide key={photo.src}>
              <LightboxItem
                index={index}
                caption={photo.caption}
                aria-roledescription="slide"
              >
                <LightboxZoom>
                  <LightboxMedia width={photo.width} height={photo.height}>
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      draggable={false}
                    />
                  </LightboxMedia>
                </LightboxZoom>
              </LightboxItem>
            </LightboxSlide>
          ))}
        </LightboxSlides>

        <LightboxHeader>
          <LightboxClose />
        </LightboxHeader>

        <LightboxPrevious />
        <LightboxNext />

        <LightboxFooter>
          <LightboxCaption />
          <LightboxThumbnailStrip>
            <LightboxThumbnailStripTrack aria-label="Photo thumbnails">
              {PHOTOS.map((photo, index) => (
                <LightboxThumbnail key={photo.src} index={index}>
                  <img src={photo.thumbnail} alt={photo.caption} />
                </LightboxThumbnail>
              ))}
            </LightboxThumbnailStripTrack>
          </LightboxThumbnailStrip>
        </LightboxFooter>
      </LightboxContent>
    </Lightbox>
  )
}

const PHOTOS = [
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/1-2048w.webp",
    thumbnail:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/1-640w.webp",
    alt: "Limestone islands rising from turquoise water in Ha Long Bay, with tour boats near a sandy beach.",
    caption: "Ha Long Bay, Quang Ninh",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/2-2048w.webp",
    thumbnail:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/2-640w.webp",
    alt: "A narrow waterway under an arch of cajuput trees, their trunks reflected in the still green water.",
    caption: "Tra Su Forest, An Giang",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/3-2048w.webp",
    thumbnail:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/3-640w.webp",
    alt: "A traditional pavilion on the water at the foot of steep limestone mountains.",
    caption: "Trang An, Ninh Binh",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/4-2048w.webp",
    thumbnail:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/4-640w.webp",
    alt: "A gate tower with tiered roofs on top of an old stone wall, framed by bare trees.",
    caption: "Imperial City, Hue",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/5-2048w.webp",
    thumbnail:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/5-640w.webp",
    alt: "An aerial view of a pagoda complex among trees, with a lake and mountains in the distance.",
    caption: "Bai Dinh Pagoda, Ninh Binh",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/6-2048w.webp",
    thumbnail:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/6-640w.webp",
    alt: "Skyscrapers along the Saigon River at sunset, with the Bitexco Financial Tower in the middle.",
    caption: "Saigon River, Ho Chi Minh City",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/7-2048w.webp",
    thumbnail:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/7-640w.webp",
    alt: "The Dragon Bridge lit up at night under a purple sky, reflected in the river.",
    caption: "Dragon Bridge, Da Nang",
    width: 2048,
    height: 1152,
  },
]
