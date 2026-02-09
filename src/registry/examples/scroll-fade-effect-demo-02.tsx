import Image from "next/image"

import { ScrollFadeEffect } from "@/registry/components/scroll-fade-effect"

interface Artwork {
  artist: string
  art: string
}

const works: Artwork[] = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Vladimir Malyavko",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
  },
]

export default function ScrollFadeEffectHorizontalDemo() {
  return (
    <div className="rounded-lg border">
      <ScrollFadeEffect className="w-72 sm:w-96" orientation="horizontal">
        <div className="flex w-max gap-4 p-4">
          {works.map((artwork) => (
            <figure key={artwork.artist} className="shrink-0">
              <Image
                src={artwork.art}
                alt={`Photo by ${artwork.artist}`}
                className="aspect-3/4 h-fit w-fit rounded-sm object-cover"
                width={300}
                height={400}
              />

              <figcaption className="pt-2 text-xs text-muted-foreground">
                Photo by{" "}
                <span className="font-semibold text-foreground">
                  {artwork.artist}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </ScrollFadeEffect>
    </div>
  )
}
