import type { Testimonial as TestimonialType } from "@/features/portfolio/types/testimonials"
import { cn } from "@/lib/utils"
import * as TestimonialPrimitive from "@/registry/components/testimonial"
import { TestimonialSpotlight } from "@/registry/components/testimonial-spotlight"

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
      className={cn("not-prose flex", className)}
    >
      <TestimonialSpotlight
        className="flex-1 bg-accent-muted"
        spotlightSize="30%"
      >
        <TestimonialPrimitive.Testimonial>
          <TestimonialPrimitive.TestimonialQuote className="min-h-14">
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
      </TestimonialSpotlight>
    </a>
  )
}
