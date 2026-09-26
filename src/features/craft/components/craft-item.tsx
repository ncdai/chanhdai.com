import type { Route } from "next"
import type { ImageProps } from "next/image"
import Image from "next/image"
import Link from "next/link"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { format } from "date-fns"
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

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
      className={cn("flex flex-col", className)}
    >
      <div className="p-2 in-data-[media-type=gallery]:px-0 in-data-[media-type=gallery]:pb-4">
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
      </div>

      {/* On phones the links get their own row so they never wrap. */}
      <figcaption className="screen-line-top grid grid-cols-[--spacing(31)_1fr]">
        <CaptionCell>
          Fig.{figureNumber.toString().padStart(2, "0")}
        </CaptionCell>
        <p className="max-w-prose px-4 py-3 text-sm/5 text-pretty max-sm:row-span-2">
          {craft.description}
        </p>

        <CaptionCell
          className="border-t"
          render={<time dateTime={craft.createdAt} />}
        >
          {format(
            new Date(craft.createdAt),
            isMonthOnly(craft.createdAt) ? "MMM yyyy" : "d MMM yyyy"
          )}
        </CaptionCell>
        <div className="col-span-2 flex border-t border-line max-sm:empty:hidden sm:col-span-1">
          {craft.registryHref && (
            <CaptionLink render={<Link href={craft.registryHref as Route} />}>
              Get the code
              <ArrowRightIcon />
            </CaptionLink>
          )}

          {craft.xPostUrl && (
            <CaptionLink
              render={
                <a href={craft.xPostUrl} target="_blank" rel="noopener" />
              }
            >
              View on X
              <ArrowUpRightIcon />
            </CaptionLink>
          )}
        </div>
      </figcaption>
    </figure>
  )
}

const isMonthOnly = (date: string) => /^\d{4}-\d{2}$/.test(date)

function CaptionCell({
  className,
  render,
  ...props
}: useRender.ComponentProps<"span">) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(
          "border-r border-line px-4 py-3 font-mono text-xs/5 font-medium tracking-wide whitespace-nowrap text-muted-foreground uppercase",
          className
        ),
      },
      props
    ),
    render,
  })
}

function CaptionLink({
  className,
  ...props
}: React.ComponentProps<typeof CaptionCell>) {
  return (
    <CaptionCell
      className={cn(
        "flex items-center justify-between gap-1.5 transition-[color,background-color] ease-out hover:bg-accent-muted hover:text-foreground max-sm:flex-1 max-sm:last:border-r-0 [&_svg]:size-3.5",
        className
      )}
      {...props}
    />
  )
}
