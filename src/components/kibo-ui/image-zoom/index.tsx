"use client"

import Zoom, {
  type ControlledProps,
  type UncontrolledProps,
} from "react-medium-image-zoom"

import { cn } from "@/lib/utils"

export type ImageZoomProps = UncontrolledProps & {
  isZoomed?: ControlledProps["isZoomed"]
  onZoomChange?: ControlledProps["onZoomChange"]
  className?: string
  backdropClassName?: string
}

export const ImageZoom = ({
  className,
  backdropClassName,
  ...props
}: ImageZoomProps) => (
  <div
    className={cn(
      "relative",
      "**:data-rmiz-ghost:pointer-events-none **:data-rmiz-ghost:absolute",
      "**:data-rmiz-btn-zoom:m-0 **:data-rmiz-btn-zoom:size-10 **:data-rmiz-btn-zoom:touch-manipulation **:data-rmiz-btn-zoom:appearance-none **:data-rmiz-btn-zoom:rounded-[50%] **:data-rmiz-btn-zoom:border-none **:data-rmiz-btn-zoom:bg-foreground/70 **:data-rmiz-btn-zoom:p-2 **:data-rmiz-btn-zoom:text-background **:data-rmiz-btn-zoom:outline-offset-2",
      "**:data-rmiz-btn-unzoom:m-0 **:data-rmiz-btn-unzoom:size-10 **:data-rmiz-btn-unzoom:touch-manipulation **:data-rmiz-btn-unzoom:appearance-none **:data-rmiz-btn-unzoom:rounded-[50%] **:data-rmiz-btn-unzoom:border-none **:data-rmiz-btn-unzoom:bg-foreground/70 **:data-rmiz-btn-unzoom:p-2 **:data-rmiz-btn-unzoom:text-background **:data-rmiz-btn-unzoom:outline-offset-2",
      "[&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:pointer-events-none [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:absolute [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:size-px [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:overflow-hidden [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:whitespace-nowrap [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:[clip-path:inset(50%)] [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:[clip:rect(0_0_0_0)]",
      "**:data-rmiz-btn-zoom:absolute **:data-rmiz-btn-zoom:top-2.5 **:data-rmiz-btn-zoom:right-2.5 **:data-rmiz-btn-zoom:bottom-auto **:data-rmiz-btn-zoom:left-auto **:data-rmiz-btn-zoom:cursor-zoom-in",
      "**:data-rmiz-btn-unzoom:absolute **:data-rmiz-btn-unzoom:top-5 **:data-rmiz-btn-unzoom:right-5 **:data-rmiz-btn-unzoom:bottom-auto **:data-rmiz-btn-unzoom:left-auto **:data-rmiz-btn-unzoom:z-1 **:data-rmiz-btn-unzoom:cursor-zoom-out",
      '[&_[data-rmiz-content="found"]_img]:cursor-zoom-in',
      '[&_[data-rmiz-content="found"]_svg]:cursor-zoom-in',
      '[&_[data-rmiz-content="found"]_[role="img"]]:cursor-zoom-in',
      '[&_[data-rmiz-content="found"]_[data-zoom]]:cursor-zoom-in',
      className
    )}
  >
    <Zoom
      classDialog={cn(
        "backdrop:hidden",
        "[[open]]:fixed [[open]]:m-0 [[open]]:h-dvh [[open]]:max-h-none [[open]]:w-dvw [[open]]:max-w-none [[open]]:overflow-hidden [[open]]:border-0 [[open]]:bg-transparent [[open]]:p-0",
        "**:data-rmiz-modal-overlay:absolute **:data-rmiz-modal-overlay:inset-0 **:data-rmiz-modal-overlay:transition-all",
        '**:data-[rmiz-modal-overlay="hidden"]:bg-transparent',
        '**:data-[rmiz-modal-overlay="visible"]:bg-background/80 **:data-[rmiz-modal-overlay="visible"]:backdrop-blur-md',
        "**:data-rmiz-modal-content:relative **:data-rmiz-modal-content:size-full",
        "**:data-rmiz-modal-img:absolute **:data-rmiz-modal-img:origin-top-left **:data-rmiz-modal-img:cursor-zoom-out **:data-rmiz-modal-img:transition-transform",
        "motion-reduce:**:data-rmiz-modal-img:transition-none motion-reduce:**:data-rmiz-modal-overlay:transition-none",
        backdropClassName
      )}
      {...props}
    />
  </div>
)
