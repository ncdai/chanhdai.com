import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
  TestimonialVerifiedBadge,
} from "@/registry/components/testimonial"

export default function TestimonialDemo() {
  return (
    <a
      href="https://x.com/rauchg/status/1978913158514237669"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-80 max-w-full rounded-xl border bg-card ring-1 ring-border/50 ring-offset-2 ring-offset-background transition-[background-color] ease-out hover:bg-accent/60"
    >
      <Testimonial>
        <TestimonialQuote>
          <p>
            awesome. Love the components, especially slide-to-unlock. Great job
          </p>
        </TestimonialQuote>

        <TestimonialAuthor>
          <TestimonialAvatar>
            <TestimonialAvatarImg
              src="https://unavatar.io/x/rauchg"
              alt="Guillermo Rauch"
            />
            <TestimonialAvatarRing />
          </TestimonialAvatar>

          <TestimonialAuthorName>
            Guillermo Rauch
            <TestimonialVerifiedBadge />
          </TestimonialAuthorName>
          <TestimonialAuthorTagline>CEO @Vercel</TestimonialAuthorTagline>
        </TestimonialAuthor>
      </Testimonial>
    </a>
  )
}
