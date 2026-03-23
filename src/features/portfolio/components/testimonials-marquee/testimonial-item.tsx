import { cn } from "@/lib/utils"
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/registry/components/testimonial"

import type { Testimonial as TestimonialType } from "../../types/testimonials"

export function TestimonialItem({
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
        "block h-full rounded-xl ring-1 ring-foreground/10 transition-[background-color] ease-out ring-inset hover:bg-accent-muted",
        className
      )}
    >
      <Testimonial>
        <TestimonialQuote className="text-pretty">
          <p>{quote}</p>
        </TestimonialQuote>

        <TestimonialAuthor>
          <TestimonialAvatar>
            <TestimonialAvatarImg src={authorAvatar} alt={authorName} />
            <TestimonialAvatarRing />
          </TestimonialAvatar>

          <TestimonialAuthorName>{authorName}</TestimonialAuthorName>

          <TestimonialAuthorTagline>{authorTagline}</TestimonialAuthorTagline>
        </TestimonialAuthor>
      </Testimonial>
    </a>
  )
}
