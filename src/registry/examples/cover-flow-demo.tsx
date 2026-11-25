"use client"

import { useState } from "react"

import {
  CoverFlow,
  CoverFlowCover,
  CoverFlowItem,
  CoverFlowReflection,
} from "@/registry/components/cover-flow"

export default function CoverFlowDemo() {
  const [value, setValue] = useState(PHOTOS[3].id)
  const selected = PHOTOS.find((photo) => photo.id === value)

  return (
    <div className="relative w-full">
      <CoverFlow
        value={value}
        onValueChange={setValue}
        aria-label="Photos of Vietnam"
        className="[--cover-flow-size:--spacing(40)] sm:[--cover-flow-size:--spacing(56)]"
      >
        {PHOTOS.map((photo) => (
          <CoverFlowItem key={photo.id} value={photo.id}>
            <CoverFlowCover>
              <img src={photo.src} alt={`${photo.title}, ${photo.place}`} />
              <CoverFlowReflection>
                <img src={photo.src} alt="" />
              </CoverFlowReflection>
            </CoverFlowCover>
          </CoverFlowItem>
        ))}
      </CoverFlow>

      {/* Sits over the reflection's fade, where the covers leave room */}
      <p className="pointer-events-none absolute inset-x-0 bottom-2 flex flex-col items-center px-4 text-center text-sm sm:bottom-4">
        <span className="max-w-full truncate font-medium">
          {selected?.title}
        </span>
        <span className="max-w-full truncate text-muted-foreground">
          {selected?.place}
        </span>
      </p>
    </div>
  )
}

const PHOTOS = [
  {
    id: "ha-long-bay",
    title: "Ha Long Bay",
    place: "Quang Ninh",
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/1-640w.webp",
  },
  {
    id: "tra-su-forest",
    title: "Tra Su Forest",
    place: "An Giang",
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/2-640w.webp",
  },
  {
    id: "trang-an",
    title: "Trang An",
    place: "Ninh Binh",
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/3-640w.webp",
  },
  {
    id: "saigon-river",
    title: "Saigon River",
    place: "Ho Chi Minh City",
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/6-640w.webp",
  },
  {
    id: "bai-dinh-pagoda",
    title: "Bai Dinh Pagoda",
    place: "Ninh Binh",
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/5-640w.webp",
  },
  {
    id: "imperial-city",
    title: "Imperial City",
    place: "Hue",
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/4-640w.webp",
  },
  {
    id: "dragon-bridge",
    title: "Dragon Bridge",
    place: "Da Nang",
    src: "https://assets.chanhdai.com/registry/images/components/apple-carousel/7-640w.webp",
  },
]
