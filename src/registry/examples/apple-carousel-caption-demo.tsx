import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AppleCarouselContent,
  AppleCarouselControls,
  AppleCarouselItem,
  AppleCarouselPlayButton,
  AppleCarouselRoot,
  AppleCarouselTab,
  AppleCarouselTabList,
} from "@/registry/components/apple-carousel"

export default function AppleCarouselCaptionDemo() {
  return (
    <AppleCarouselRoot duration={3600}>
      <AppleCarouselContent>
        {ITEMS.map((item) => (
          // The caption always sits on a photo, so the card resolves the dark
          // tokens in either theme.
          <AppleCarouselItem key={item.image} className="dark @max-3xl:h-96">
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 size-full object-cover select-none"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/70 via-background/30 to-transparent"
            />
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 flex items-center gap-4 px-12 pb-10 text-xl/6 text-foreground",
                "opacity-36 transition-opacity duration-150 ease-out in-data-current:opacity-100 in-data-current:duration-400",
                "@max-5xl:gap-3 @max-5xl:px-6 @max-5xl:pb-6 @max-5xl:text-base/5",
                "@max-3xl:flex-col @max-3xl:px-6 @max-3xl:text-center"
              )}
            >
              <Button
                className="rounded-full"
                nativeButton={false}
                render={
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Learn more
              </Button>
              <p className="text-pretty text-shadow-sm">
                <span className="font-semibold after:px-2 after:opacity-50 after:content-['•'/''] @max-3xl:block @max-3xl:after:hidden">
                  {item.title}
                </span>
                {item.description}
              </p>
            </div>
          </AppleCarouselItem>
        ))}
      </AppleCarouselContent>

      <AppleCarouselControls>
        <AppleCarouselTabList aria-label="Places in Viet Nam">
          {ITEMS.map((item) => (
            <AppleCarouselTab key={item.image}>{item.title}</AppleCarouselTab>
          ))}
        </AppleCarouselTabList>
        <AppleCarouselPlayButton />
      </AppleCarouselControls>
    </AppleCarouselRoot>
  )
}

const ITEMS = [
  {
    title: "Quang Ninh",
    description: "Limestone islands rise from emerald water.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/1.webp",
    href: "https://en.wikipedia.org/wiki/Quảng_Ninh_province",
  },
  {
    title: "An Giang",
    description: "Cajuput trees arch over a quiet green waterway.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/2.webp?v=2",
    href: "https://en.wikipedia.org/wiki/An_Giang_province",
  },
  {
    title: "Ninh Binh",
    description: "A pavilion rests on still water beneath karst cliffs.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/3.webp",
    href: "https://en.wikipedia.org/wiki/Ninh_Bình_province",
  },
  {
    title: "Hue",
    description: "Tiered palace roofs against a pale sky.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/4.webp",
    href: "https://en.wikipedia.org/wiki/Huế",
  },
  {
    title: "Ninh Binh",
    description: "Temple corridors wind toward a lake among the mountains.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/5.webp",
    href: "https://en.wikipedia.org/wiki/Ninh_Bình_province",
  },
  {
    title: "Ho Chi Minh City",
    description: "The skyline glows over the river at dusk.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/6.webp",
    href: "https://en.wikipedia.org/wiki/Ho_Chi_Minh_City",
  },
  {
    title: "Da Nang",
    description: "A dragon-shaped bridge lights up the evening river.",
    image:
      "https://assets.chanhdai.com/registry/images/components/apple-carousel/7.webp",
    href: "https://en.wikipedia.org/wiki/Da_Nang",
  },
]
