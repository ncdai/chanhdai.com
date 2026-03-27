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
      className="block w-80 max-w-full rounded-xl border bg-card ring-1 ring-border/50 ring-offset-2 ring-offset-background transition-[background-color] ease-out hover:bg-accent/60"
      href="https://x.com/rauchg/status/1978913158514237669"
      target="_blank"
      rel="noopener noreferrer"
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
            <TestimonialVerifiedBadge className="text-info">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M24 12a4.454 4.454 0 0 0-2.564-3.91 4.437 4.437 0 0 0-.948-4.578 4.436 4.436 0 0 0-4.577-.948A4.44 4.44 0 0 0 12 0a4.423 4.423 0 0 0-3.9 2.564 4.434 4.434 0 0 0-2.43-.178 4.425 4.425 0 0 0-2.158 1.126 4.42 4.42 0 0 0-1.12 2.156 4.42 4.42 0 0 0 .183 2.421A4.456 4.456 0 0 0 0 12a4.465 4.465 0 0 0 2.576 3.91 4.433 4.433 0 0 0 .936 4.577 4.459 4.459 0 0 0 4.577.95A4.454 4.454 0 0 0 12 24a4.439 4.439 0 0 0 3.91-2.563 4.26 4.26 0 0 0 5.526-5.526A4.453 4.453 0 0 0 24 12Zm-13.709 4.917-4.38-4.378 1.652-1.663 2.646 2.646L15.83 7.4l1.72 1.591-7.258 7.926Z"
                />
              </svg>
            </TestimonialVerifiedBadge>
          </TestimonialAuthorName>
          <TestimonialAuthorTagline>CEO @Vercel</TestimonialAuthorTagline>
        </TestimonialAuthor>
      </Testimonial>
    </a>
  )
}
