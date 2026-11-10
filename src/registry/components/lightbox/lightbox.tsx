"use client"

import type { ComponentProps } from "react"
import * as LightboxPrimitive from "@ramka/react/lightbox"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ButtonStyleProps = Pick<ComponentProps<typeof Button>, "variant" | "size">

type LightboxHandle = LightboxPrimitive.LightboxHandle

const createLightboxHandle = LightboxPrimitive.createHandle

function Lightbox(props: ComponentProps<typeof LightboxPrimitive.Root>) {
  return <LightboxPrimitive.Root {...props} />
}

function LightboxTrigger({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Trigger>) {
  return (
    <LightboxPrimitive.Trigger
      data-slot="lightbox-trigger"
      className={cn(
        "cursor-zoom-in outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

function LightboxPortal(
  props: ComponentProps<typeof LightboxPrimitive.Portal>
) {
  return <LightboxPrimitive.Portal data-slot="lightbox-portal" {...props} />
}

function LightboxBackdrop({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Backdrop>) {
  return (
    <LightboxPrimitive.Backdrop
      data-slot="lightbox-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-background opacity-0",
        // Pull-snap timing exists only while a cancelled pull springs back.
        "transition-opacity duration-(--lightbox-pull-snap-duration,var(--lightbox-vt-duration,360ms)) ease-(--lightbox-pull-snap-easing,cubic-bezier(0.16,1,0.3,1))",
        "data-open:opacity-[calc(1-var(--lightbox-pull-progress,0)*0.6)] data-open:starting:opacity-0",
        "data-pulling:transition-none",
        className
      )}
      {...props}
    />
  )
}

function LightboxContent({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Content>) {
  return (
    <LightboxPortal>
      <LightboxBackdrop />
      <LightboxPrimitive.Content
        data-slot="lightbox-content"
        className={cn(
          "group/lightbox fixed inset-0 z-50 flex flex-col overscroll-contain opacity-0 outline-none",
          "transition-opacity duration-(--lightbox-vt-duration,360ms) ease-[cubic-bezier(0.16,1,0.3,1)]",
          "data-open:opacity-100 data-open:starting:opacity-0",
          // Shared by the slides, header, and footer so they stay aligned.
          "[--lb-inset-bottom:calc(4rem+env(safe-area-inset-bottom,0px))] [--lb-inset-top:calc(4rem+env(safe-area-inset-top,0px))] [--lb-inset-x:0px]",
          "md:[--lb-inset-bottom:calc(4.5rem+env(safe-area-inset-bottom,0px))] md:[--lb-inset-top:calc(4.5rem+env(safe-area-inset-top,0px))] md:[--lb-inset-x:4.5rem]",
          "has-data-[slot=lightbox-thumbnail-strip]:[--lb-inset-bottom:calc(8rem+env(safe-area-inset-bottom,0px))]",
          className
        )}
        {...props}
      />
    </LightboxPortal>
  )
}

function LightboxStage(props: ComponentProps<typeof LightboxPrimitive.Stage>) {
  return <LightboxPrimitive.Stage data-slot="lightbox-stage" {...props} />
}

function LightboxSlides({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Slides>) {
  return (
    <LightboxPrimitive.Slides
      data-slot="lightbox-slides"
      className={cn(
        "flex-1 scrollbar-none gap-4 md:gap-0 [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    />
  )
}

function LightboxSlide({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Slide>) {
  return (
    <LightboxPrimitive.Slide
      data-slot="lightbox-slide"
      className={cn(
        "h-full min-w-full flex-[0_0_100%] px-(--lb-inset-x) pt-(--lb-inset-top) pb-(--lb-inset-bottom)",
        className
      )}
      {...props}
    />
  )
}

function LightboxItem(props: ComponentProps<typeof LightboxPrimitive.Item>) {
  return <LightboxPrimitive.Item data-slot="lightbox-item" {...props} />
}

function LightboxZoom({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Zoom>) {
  return (
    <LightboxPrimitive.Zoom
      data-slot="lightbox-zoom"
      className={cn("cursor-zoom-in", className)}
      {...props}
    />
  )
}

function LightboxMedia({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Media>) {
  return (
    <LightboxPrimitive.Media
      data-slot="lightbox-media"
      className={cn(
        "overflow-hidden md:rounded-xl [&_img]:select-none",
        // Keeps image edges from blending into the backdrop.
        "after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] md:after:inset-ring md:after:inset-ring-foreground/10",
        className
      )}
      {...props}
    />
  )
}

function LightboxHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="lightbox-header"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-10 flex h-(--lb-inset-top) items-center justify-end gap-2 px-3 pt-[env(safe-area-inset-top,0px)] *:pointer-events-auto",
        "transition-[opacity,visibility] duration-200",
        "group-data-pull-dismissing/lightbox:invisible group-data-pull-dismissing/lightbox:opacity-0 group-data-pulling/lightbox:invisible group-data-pulling/lightbox:opacity-0",
        // Zoomed media fills small screens.
        "max-md:group-data-zoomed/lightbox:invisible max-md:group-data-zoomed/lightbox:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function LightboxFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="lightbox-footer"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-(--lb-inset-bottom) flex-col items-center justify-center gap-3 px-4 pb-[env(safe-area-inset-bottom,0px)] text-center *:pointer-events-auto",
        "transition-[opacity,visibility] duration-200",
        "group-data-pull-dismissing/lightbox:invisible group-data-pull-dismissing/lightbox:opacity-0 group-data-pulling/lightbox:invisible group-data-pulling/lightbox:opacity-0",
        "group-data-zoomed/lightbox:invisible group-data-zoomed/lightbox:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function LightboxClose({
  variant = "secondary",
  size = "icon",
  children,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Close> & ButtonStyleProps) {
  return (
    <LightboxPrimitive.Close
      data-slot="lightbox-close"
      render={<Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <XIcon />
          <span className="sr-only">Close</span>
        </>
      )}
    </LightboxPrimitive.Close>
  )
}

function LightboxZoomIn({
  variant = "secondary",
  size = "icon",
  children,
  ...props
}: ComponentProps<typeof LightboxPrimitive.ZoomIn> & ButtonStyleProps) {
  return (
    <LightboxPrimitive.ZoomIn
      data-slot="lightbox-zoom-in"
      render={<Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <ZoomInIcon />
          <span className="sr-only">Zoom in</span>
        </>
      )}
    </LightboxPrimitive.ZoomIn>
  )
}

function LightboxZoomOut({
  variant = "secondary",
  size = "icon",
  children,
  ...props
}: ComponentProps<typeof LightboxPrimitive.ZoomOut> & ButtonStyleProps) {
  return (
    <LightboxPrimitive.ZoomOut
      data-slot="lightbox-zoom-out"
      render={<Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <ZoomOutIcon />
          <span className="sr-only">Zoom out</span>
        </>
      )}
    </LightboxPrimitive.ZoomOut>
  )
}

function LightboxPrevious({
  className,
  variant = "secondary",
  size = "icon",
  children,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Previous> & ButtonStyleProps) {
  return (
    <LightboxPrimitive.Previous
      data-slot="lightbox-previous"
      render={<Button variant={variant} size={size} />}
      className={cn(
        "absolute inset-s-4 top-1/2 z-10 -translate-y-1/2 max-md:hidden rtl:[&_svg]:rotate-180",
        "group-data-pull-dismissing/lightbox:invisible group-data-pull-dismissing/lightbox:opacity-0 group-data-pulling/lightbox:invisible group-data-pulling/lightbox:opacity-0",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <ChevronLeftIcon />
          <span className="sr-only">Previous</span>
        </>
      )}
    </LightboxPrimitive.Previous>
  )
}

function LightboxNext({
  className,
  variant = "secondary",
  size = "icon",
  children,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Next> & ButtonStyleProps) {
  return (
    <LightboxPrimitive.Next
      data-slot="lightbox-next"
      render={<Button variant={variant} size={size} />}
      className={cn(
        "absolute inset-e-4 top-1/2 z-10 -translate-y-1/2 max-md:hidden rtl:[&_svg]:rotate-180",
        "group-data-pull-dismissing/lightbox:invisible group-data-pull-dismissing/lightbox:opacity-0 group-data-pulling/lightbox:invisible group-data-pulling/lightbox:opacity-0",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <ChevronRightIcon />
          <span className="sr-only">Next</span>
        </>
      )}
    </LightboxPrimitive.Next>
  )
}

function LightboxCounter({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Counter>) {
  return (
    <LightboxPrimitive.Counter
      data-slot="lightbox-counter"
      className={cn("text-sm text-muted-foreground tabular-nums", className)}
      {...props}
    />
  )
}

function LightboxCaption({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Caption>) {
  return (
    <LightboxPrimitive.Caption
      data-slot="lightbox-caption"
      className={cn(
        "max-w-full truncate text-sm font-medium text-foreground select-text",
        className
      )}
      {...props}
    />
  )
}

function LightboxThumbnailGroup(
  props: ComponentProps<typeof LightboxPrimitive.ThumbnailGroup>
) {
  return (
    <LightboxPrimitive.ThumbnailGroup
      data-slot="lightbox-thumbnail-group"
      {...props}
    />
  )
}

function LightboxThumbnailStrip({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.ThumbnailStrip>) {
  return (
    <LightboxPrimitive.ThumbnailStrip
      data-slot="lightbox-thumbnail-strip"
      className={cn(
        "w-full py-1",
        "mask-[linear-gradient(to_right,transparent,black_2.5rem,black_calc(100%-2.5rem),transparent)]",
        className
      )}
      {...props}
    />
  )
}

function LightboxThumbnailStripTrack({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.ThumbnailStripTrack>) {
  return (
    <LightboxPrimitive.ThumbnailStripTrack
      data-slot="lightbox-thumbnail-strip-track"
      className={cn("flex w-max items-center gap-2", className)}
      {...props}
    />
  )
}

function LightboxThumbnail({
  className,
  ...props
}: ComponentProps<typeof LightboxPrimitive.Thumbnail>) {
  return (
    <LightboxPrimitive.Thumbnail
      data-slot="lightbox-thumbnail"
      className={cn(
        "block size-14 shrink-0 cursor-pointer overflow-hidden rounded-md outline-none",
        "ring-offset-2 ring-offset-background focus-visible:ring-3 focus-visible:ring-ring/50 data-active:ring-2 data-active:ring-foreground",
        "[&_img]:size-full [&_img]:object-cover",
        className
      )}
      {...props}
    />
  )
}

export {
  createLightboxHandle,
  Lightbox,
  LightboxBackdrop,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxCounter,
  LightboxFooter,
  LightboxHeader,
  LightboxItem,
  LightboxMedia,
  LightboxNext,
  LightboxPortal,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxStage,
  LightboxThumbnail,
  LightboxThumbnailGroup,
  LightboxThumbnailStrip,
  LightboxThumbnailStripTrack,
  LightboxTrigger,
  LightboxZoom,
  LightboxZoomIn,
  LightboxZoomOut,
}
export type { LightboxHandle }
