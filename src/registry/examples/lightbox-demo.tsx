"use client"

import {
  Lightbox,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxCounter,
  LightboxFooter,
  LightboxHeader,
  LightboxItem,
  LightboxMedia,
  LightboxNext,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxTrigger,
  LightboxZoom,
  LightboxZoomIn,
  LightboxZoomOut,
} from "@/registry/components/lightbox"

export default function LightboxDemo() {
  return (
    <Lightbox>
      <div className="grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
        {PHOTOS.map((photo, index) => (
          <LightboxTrigger
            key={photo.src}
            index={index}
            className="aspect-square overflow-hidden rounded-lg"
          >
            {({ imageRef }) => (
              <img
                ref={imageRef}
                className="size-full rounded-[inherit] object-cover outline -outline-offset-1 outline-foreground/10"
                src={photo.thumbnail}
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
                aria-label={`${index + 1} of ${PHOTOS.length}`}
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
          <LightboxZoomOut />
          <LightboxZoomIn />
          <LightboxClose />
        </LightboxHeader>

        <LightboxPrevious />
        <LightboxNext />

        <LightboxFooter>
          <div className="flex flex-col items-center gap-0.5">
            <LightboxCaption />
            <LightboxCounter>
              {({ current, total }) => `${current} of ${total}`}
            </LightboxCounter>
          </div>
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
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/3-2048w.webp",
    thumbnail:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/3-640w.webp",
    alt: "A traditional pavilion on the water at the foot of steep limestone mountains.",
    caption: "Trang An, Ninh Binh",
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
