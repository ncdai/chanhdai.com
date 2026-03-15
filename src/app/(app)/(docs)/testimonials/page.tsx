import type { Metadata } from "next"

import { SITE_INFO, X_USERNAME } from "@/config/site"
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
} from "@/registry/components/testimonial"

export const metadata: Metadata = {
  title: "Loved by Devs Worldwide",
  description: "See what developers are saying about my work and projects.",
  alternates: {
    canonical: "/testimonials",
  },
  openGraph: {
    url: "/testimonials",
    type: "website",
    images: {
      url: SITE_INFO.ogImage,
      width: 1200,
      height: 630,
      alt: "Loved by Devs Worldwide",
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_USERNAME,
    creator: X_USERNAME,
    images: [SITE_INFO.ogImage],
  },
}

const TESTIMONIALS = [
  ...TESTIMONIALS_1.slice().sort((a, b) =>
    a.date.localeCompare(b.date, undefined, { numeric: true })
  ),
  ...TESTIMONIALS_2.slice().sort((a, b) =>
    a.date.localeCompare(b.date, undefined, { numeric: true })
  ),
]

export default function TestimonialsPage() {
  return (
    <div className="min-h-svh">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Loved by Devs Worldwide
        </h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          See what developers are saying about my work and projects.
        </p>
      </div>

      <div className="screen-line-before relative pt-4">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge" />
          <div className="border-l border-edge" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TESTIMONIALS.map((item) => (
            <a
              key={item.url}
              className={cn(
                "block transition-[background-color] ease-out hover:bg-accent-muted",
                "max-sm:screen-line-before max-sm:screen-line-after",
                "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
              )}
              href={item.url}
              target="_blank"
              rel="noopener"
            >
              <Testimonial>
                <TestimonialQuote className="text-pretty">
                  <p>{item.quote}</p>
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
