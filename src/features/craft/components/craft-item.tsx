import type { Route } from "next"
import type { ImageProps } from "next/image"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

import type { Craft } from "../types"
import { CraftGallery } from "./craft-gallery"
import { CraftVideo } from "./craft-video"

export function CraftItem({
  craft,
  figureNumber,
  imageLoading = "lazy",
  className,
}: {
  craft: Craft
  figureNumber: number
  imageLoading?: ImageProps["loading"]
  className?: string
}) {
  const { media } = craft

  return (
    <figure
      data-media-type={media.type}
      className={cn(
        "flex flex-col gap-2 p-2 data-[media-type=gallery]:px-0",
        className
      )}
    >
      {media.type === "gallery" ? (
        <CraftGallery images={media.images} />
      ) : (
        <div className="relative rounded-xl">
          {media.type === "video" ? (
            <CraftVideo
              className="rounded-[inherit]"
              src={media.src}
              poster={media.poster}
              width={media.width}
              height={media.height}
            />
          ) : (
            <Image
              className="h-auto w-full rounded-[inherit] bg-muted"
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
              loading={imageLoading}
              unoptimized
            />
          )}

          <div className="pointer-events-none absolute inset-0 rounded-[inherit] inset-ring-1 inset-ring-black/10 dark:inset-ring-white/10" />
        </div>
      )}

      <figcaption className="flex flex-col items-center gap-1 p-2 text-center text-sm">
        <p className="text-balance">
          <span className="font-medium">
            Fig. {figureNumber.toString().padStart(2, "0")}.
          </span>{" "}
          {craft.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-muted-foreground">
          {craft.registryHref && (
            <>
              <Link
                className="link-underline hover:text-foreground"
                href={craft.registryHref as Route}
              >
                Get the code
              </Link>
              <MetaSeparator />
            </>
          )}

          {craft.xPostUrl && (
            <>
              <a
                className="link-underline hover:text-foreground"
                href={craft.xPostUrl}
                target="_blank"
                rel="noopener"
              >
                View on <span aria-hidden>𝕏</span>
                <span className="sr-only">X</span>
              </a>
              <MetaSeparator />
            </>
          )}

          <time dateTime={new Date(craft.createdAt).toISOString()}>
            {format(new Date(craft.createdAt), "MMM d, yyyy")}
          </time>
        </div>
      </figcaption>
    </figure>
  )
}

function MetaSeparator() {
  return (
    <Separator
      className="data-vertical:h-4 data-vertical:self-center"
      orientation="vertical"
      aria-hidden
    />
  )
}
