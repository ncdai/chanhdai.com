"use client"

import { ImagesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  createLightboxHandle,
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
  LightboxZoom,
} from "@/registry/components/lightbox"

const handle = createLightboxHandle()

export default function LightboxHandleDemo() {
  return (
    <>
      <Button variant="outline" onClick={() => handle.open(0)}>
        <ImagesIcon />
        View {PHOTOS.length} photos
      </Button>

      <Lightbox handle={handle}>
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
    </>
  )
}

const PHOTOS = [
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/1-2048w.webp",
    alt: "Limestone islands rising from turquoise water in Ha Long Bay, with tour boats near a sandy beach.",
    caption: "Ha Long Bay, Quang Ninh",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/2-2048w.webp",
    alt: "A narrow waterway under an arch of cajuput trees, their trunks reflected in the still green water.",
    caption: "Tra Su Forest, An Giang",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/3-2048w.webp",
    alt: "A traditional pavilion on the water at the foot of steep limestone mountains.",
    caption: "Trang An, Ninh Binh",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/4-2048w.webp",
    alt: "A gate tower with tiered roofs on top of an old stone wall, framed by bare trees.",
    caption: "Imperial City, Hue",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/5-2048w.webp",
    alt: "An aerial view of a pagoda complex among trees, with a lake and mountains in the distance.",
    caption: "Bai Dinh Pagoda, Ninh Binh",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/6-2048w.webp",
    alt: "Skyscrapers along the Saigon River at sunset, with the Bitexco Financial Tower in the middle.",
    caption: "Saigon River, Ho Chi Minh City",
    width: 2048,
    height: 1152,
  },
  {
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/7-2048w.webp",
    alt: "The Dragon Bridge lit up at night under a purple sky, reflected in the river.",
    caption: "Dragon Bridge, Da Nang",
    width: 2048,
    height: 1152,
  },
]
