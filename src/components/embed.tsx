import { cn } from "@/lib/utils"

import { ImageZoom } from "./kibo-ui/image-zoom"

export function YouTubeEmbed({
  videoId,
  title,
}: {
  videoId: string
  title: string
}) {
  return (
    <div className="relative my-[1.25em]">
      <iframe
        className="aspect-video w-full rounded-xl"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
    </div>
  )
}

export function IframeEmbed({
  className,
  ...props
}: React.ComponentProps<"iframe">) {
  return (
    <div className="relative my-[1.25em]">
      <iframe
        className={cn("aspect-video w-full rounded-xl", className)}
        {...props}
      />

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
    </div>
  )
}

export function FramedImage({
  canZoom = true,
  ...props
}: React.ComponentProps<"img"> & {
  canZoom?: boolean
}) {
  // eslint-disable-next-line jsx-a11y/alt-text
  const image = <img {...props} />

  return (
    <figure className="relative [&_img]:rounded-xl">
      {canZoom ? <ImageZoom>{image}</ImageZoom> : image}

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
    </figure>
  )
}
