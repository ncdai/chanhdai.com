"use client"

import { useState } from "react"

import {
  AppleAccordionClose,
  AppleAccordionContent,
  AppleAccordionItem,
  AppleAccordionList,
  AppleAccordionNext,
  AppleAccordionPrevious,
  AppleAccordionRoot,
  AppleAccordionTrigger,
  AppleAccordionTriggerIcon,
} from "@/registry/components/apple-accordion"

export default function AppleAccordionDemo() {
  const [value, setValue] = useState<string | null>(null)
  const image = ITEMS.find((item) => item.value === value)?.image ?? COVER

  return (
    <AppleAccordionRoot
      value={value}
      onValueChange={setValue}
      className="mx-auto h-176 max-w-6xl overflow-hidden rounded-4xl bg-background"
    >
      {[COVER, ...ITEMS.map((item) => item.image)].map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          data-current={src === image ? "" : undefined}
          className="absolute inset-0 -z-10 size-full object-cover opacity-0 transition-opacity duration-500 ease-in-out data-current:opacity-100"
        />
      ))}

      <div className="flex h-full items-center gap-4 px-4 sm:gap-8 sm:px-8">
        <div className="flex flex-col gap-5">
          <AppleAccordionPrevious aria-label="Previous place" />
          <AppleAccordionNext aria-label="Next place" />
        </div>

        <AppleAccordionList aria-label="Places in Viet Nam">
          {ITEMS.map((item) => (
            <AppleAccordionItem key={item.value} value={item.value}>
              <AppleAccordionTrigger>
                <AppleAccordionTriggerIcon />
                {item.title}
              </AppleAccordionTrigger>
              <AppleAccordionContent>
                <p>
                  <span className="font-medium">{item.title}.</span>{" "}
                  {item.description}
                </p>
              </AppleAccordionContent>
            </AppleAccordionItem>
          ))}
        </AppleAccordionList>
      </div>

      <AppleAccordionClose className="absolute inset-e-4 top-4 sm:inset-e-6 sm:top-6" />
    </AppleAccordionRoot>
  )
}

const COVER =
  "https://assets.chanhdai.com/registry/images/components/apple-carousel/5.webp"

const ITEMS = [
  {
    value: "quang-ninh",
    title: "Quang Ninh",
    description:
      "Home to Ha Long Bay, where nearly two thousand limestone islands rise from emerald water.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/1.webp",
  },
  {
    value: "an-giang",
    title: "An Giang",
    description:
      "Rice fields, floating markets, and the Tra Su cajuput forest in the heart of the Mekong Delta.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/2.webp?v=2",
  },
  {
    value: "ninh-binh",
    title: "Ninh Binh",
    description:
      "Boats drift through limestone caves at Trang An, a UNESCO World Heritage site.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/3.webp",
  },
  {
    value: "hue",
    title: "Hue",
    description:
      "The former imperial capital, with its Citadel and royal tombs along the Perfume River.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/4.webp",
  },
  {
    value: "ho-chi-minh-city",
    title: "Ho Chi Minh City",
    description:
      "The country’s largest city, busy day and night, with street food on every corner.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/6.webp",
  },
  {
    value: "da-nang",
    title: "Da Nang",
    description:
      "Long sandy beaches, the Dragon Bridge, and the Marble Mountains just south of the city.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/7.webp",
  },
]
