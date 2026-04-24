import type { Metadata } from "next"

import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { X_HANDLE } from "@/config/site"
import { VerifiedIcon } from "@/features/portfolio/components/verified-icon"
import {
  TESTIMONIALS_1,
  TESTIMONIALS_2,
} from "@/features/portfolio/data/testimonials"
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
  TestimonialVerifiedBadge,
} from "@/registry/components/testimonial"
import { Twemoji } from "@/registry/components/twemoji/twemoji"

const title = "Testimonials"
const description = "Trusted by top builders."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/testimonials",
  },
  openGraph: {
    url: "/testimonials",
    type: "website",
    images: {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    creator: X_HANDLE,
    images: [ogImage],
  },
}

const TESTIMONIALS = [...TESTIMONIALS_1, ...TESTIMONIALS_2].sort(
  (a, b) => Number(a.order ?? 999) - Number(b.order ?? 999)
)

export default function TestimonialsPage() {
  return (
    <div className="min-h-svh">
      <PageHeading>
        <PageHeadingTagline>Testimonials</PageHeadingTagline>
        <PageHeadingTitle>Trusted by top builders.</PageHeadingTitle>
      </PageHeading>

      <div className="relative pt-4">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-line" />
          <div className="border-l border-line" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TESTIMONIALS.map((item) => (
            <a
              key={item.url}
              className={cn(
                "block transition-[background-color] ease-out hover:bg-accent-muted",
                "max-sm:screen-line-top max-sm:screen-line-bottom",
                "sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom"
              )}
              href={item.url}
              target="_blank"
              rel="noopener"
            >
              <Testimonial>
                <TestimonialQuote className="min-h-14 font-serif">
                  <p>
                    <Twemoji>{item.quote}</Twemoji>
                  </p>
                </TestimonialQuote>

                <TestimonialAuthor>
                  <TestimonialAvatar>
                    <TestimonialAvatarImg
                      src={item.authorAvatar}
                      alt={item.authorName}
                    />
                    <TestimonialAvatarRing />
                  </TestimonialAvatar>

                  <TestimonialAuthorName>
                    {item.authorName}
                    {item.isVerified && (
                      <TestimonialVerifiedBadge className="text-info">
                        <VerifiedIcon />
                      </TestimonialVerifiedBadge>
                    )}
                  </TestimonialAuthorName>
                  <TestimonialAuthorTagline>
                    {item.authorTagline}
                  </TestimonialAuthorTagline>
                </TestimonialAuthor>
              </Testimonial>
            </a>
          ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}
