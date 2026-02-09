import { cn } from "@/lib/utils"

export function Testimonial({
  className,
  ...props
}: React.ComponentProps<"figure">) {
  return (
    <figure
      data-slot="testimonial"
      className={cn("flex h-full flex-col", className)}
      {...props}
    />
  )
}

export function TestimonialQuote({
  className,
  ...props
}: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      data-slot="quote"
      className={cn(
        "grow px-4 py-3 text-base text-balance text-foreground",
        className
      )}
      {...props}
    />
  )
}

export function TestimonialAuthor({
  className,
  ...props
}: React.ComponentProps<"figcaption">) {
  return (
    <figcaption
      data-slot="author"
      className={cn(
        "grid grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-3.5 px-4 pt-1 pb-3",
        className
      )}
      {...props}
    />
  )
}

export function TestimonialAvatar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar"
      className={cn("relative row-span-2 size-8 shrink-0", className)}
      {...props}
    />
  )
}

export function TestimonialAvatarImg({
  className,
  src,
  alt,
  ...props
}: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="avatar-img"
      className={cn("size-8 rounded-full select-none", className)}
      src={src}
      alt={alt}
      {...props}
    />
  )
}

export function TestimonialAvatarRing({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-ring"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/15",
        className
      )}
      {...props}
    />
  )
}

export function TestimonialAuthorName({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="author-name"
      className={cn(
        "text-sm leading-4 font-semibold text-foreground",
        className
      )}
      {...props}
    />
  )
}

export function TestimonialAuthorTagline({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="author-tagline"
      className={cn(
        "text-xs leading-4 text-balance text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function TestimonialVerifiedBadge({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="verified-badge"
      className={cn(
        "ml-1.5 inline-block size-3 -translate-y-px text-info",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M24 12a4.454 4.454 0 0 0-2.564-3.91 4.437 4.437 0 0 0-.948-4.578 4.436 4.436 0 0 0-4.577-.948A4.44 4.44 0 0 0 12 0a4.423 4.423 0 0 0-3.9 2.564 4.434 4.434 0 0 0-2.43-.178 4.425 4.425 0 0 0-2.158 1.126 4.42 4.42 0 0 0-1.12 2.156 4.42 4.42 0 0 0 .183 2.421A4.456 4.456 0 0 0 0 12a4.465 4.465 0 0 0 2.576 3.91 4.433 4.433 0 0 0 .936 4.577 4.459 4.459 0 0 0 4.577.95A4.454 4.454 0 0 0 12 24a4.439 4.439 0 0 0 3.91-2.563 4.26 4.26 0 0 0 5.526-5.526A4.453 4.453 0 0 0 24 12Zm-13.709 4.917-4.38-4.378 1.652-1.663 2.646 2.646L15.83 7.4l1.72 1.591-7.258 7.926Z"
      />
    </svg>
  )
}
