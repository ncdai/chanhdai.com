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

export function DocTestimonial2({
  className,
  authorAvatar,
  authorName,
  authorTagline,
  url,
  quote,
}: {
  className?: string
  authorAvatar: string
  authorName: string
  authorTagline: string
  url: string
  quote: string
}) {
  return (
    <Testimonial
      className={cn(
        "not-prose relative my-[2.5em] items-center gap-3",
        className
      )}
    >
      <TestimonialQuote className="p-0 font-serif text-lg">
        <p>
          <span
            className="mr-0.5 inline-block text-muted-foreground/80 select-none"
            aria-hidden="true"
          >
            “
          </span>
          {quote}
          <span
            className="inline-block text-muted-foreground/80 select-none"
            aria-hidden="true"
          >
            ”
          </span>
        </p>
      </TestimonialQuote>

      <TestimonialAuthor className="gap-x-3 p-0">
        <TestimonialAvatar>
          <TestimonialAvatarImg src={authorAvatar} alt={authorName} />
          <TestimonialAvatarRing />
        </TestimonialAvatar>

        <TestimonialAuthorName>
          <a href={url} target="_blank" rel="noopener">
            <span className="absolute inset-0" aria-hidden />
            {authorName}
          </a>
        </TestimonialAuthorName>
        <TestimonialAuthorTagline>{authorTagline}</TestimonialAuthorTagline>
      </TestimonialAuthor>
    </Testimonial>
  )
}
