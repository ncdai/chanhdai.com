import type { Testimonial as TestimonialType } from "@/features/portfolio/types/testimonials"
import { cn } from "@/lib/utils"
import * as TestimonialPrimitive from "@/registry/components/testimonial"

export function Testimonial({
  className,
  authorAvatar,
  authorName,
  authorTagline,
  url,
  quote,
}: TestimonialType & { className?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      className={cn(
        "not-prose block h-full rounded-xl border ring-1 ring-edge ring-offset-2 ring-offset-background transition-[background-color] ease-out hover:bg-accent-muted",
        className
      )}
    >
      <TestimonialPrimitive.Testimonial>
        <TestimonialPrimitive.TestimonialQuote>
          <p>{quote}</p>
        </TestimonialPrimitive.TestimonialQuote>

        <TestimonialPrimitive.TestimonialAuthor>
          <TestimonialPrimitive.TestimonialAvatar>
            <TestimonialPrimitive.TestimonialAvatarImg
              src={authorAvatar}
              alt={authorName}
            />
            <TestimonialPrimitive.TestimonialAvatarRing />
          </TestimonialPrimitive.TestimonialAvatar>

          <TestimonialPrimitive.TestimonialAuthorName>
            {authorName}
            <TestimonialPrimitive.TestimonialVerifiedBadge />
          </TestimonialPrimitive.TestimonialAuthorName>
          <TestimonialPrimitive.TestimonialAuthorTagline>
            {authorTagline}
          </TestimonialPrimitive.TestimonialAuthorTagline>
        </TestimonialPrimitive.TestimonialAuthor>
      </TestimonialPrimitive.Testimonial>
    </a>
  )
}
