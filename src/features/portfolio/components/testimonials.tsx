"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { useInView, usePageInView } from "motion/react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/base/ui/button"
import type { MarqueeContentProps } from "@/components/kibo-ui/marquee"
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee"
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/registry/transformed/components/testimonial"
import { TestimonialSpotlight } from "@/registry/transformed/components/testimonial-spotlight"
import { Twemoji } from "@/registry/transformed/components/twemoji/twemoji"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import {
  TESTIMONIALS_1,
  TESTIMONIALS_2,
} from "@/features/portfolio/data/testimonials"
import type { Testimonial as TestimonialType } from "@/features/portfolio/types/testimonials"

import { Panel, PanelContent } from "./panel"

const ID = "testimonials"

const TESTIMONIALS = [...TESTIMONIALS_1, ...TESTIMONIALS_2].sort(
  (a, b) => Number(a.order ?? 999) - Number(b.order ?? 999)
)

const TESTIMONIALS_MOBILE = TESTIMONIALS.slice(0, 8)

const TESTIMONIALS_FEATURED = TESTIMONIALS.filter((item) => item.isFeatured)

const TESTIMONIALS_1_FILTERED = TESTIMONIALS_1.filter(
  (item) => !item.isFeatured
)

const TESTIMONIALS_2_FILTERED = TESTIMONIALS_2.filter(
  (item) => !item.isFeatured
)

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const isPageInView = usePageInView()
  const isInView = useInView(ref)
  const isDesktop = useMediaQuery("(min-width: 40rem)") // sm breakpoint
  const play = isPageInView && isInView && isDesktop

  return (
    <Panel ref={ref} id={ID}>
      <div className="h-px" />
      <div className="h-4" />
      <div className="screen-line-bottom h-px" />

      <div className="flex items-center justify-center py-4">
        <h2 className="text-center text-sm/none font-medium text-muted-foreground">
          Trusted by top builders on{" "}
          <a href={SOCIAL.x.href} target="_blank" rel="noopener" aria-label="X">
            𝕏
          </a>
        </h2>
      </div>

      <div className="screen-line-bottom h-px" />

      <div className="grid gap-4 py-4 sm:hidden">
        {TESTIMONIALS_MOBILE.map((item) => (
          <TestimonialItem
            key={item.url}
            className="screen-line-top screen-line-bottom"
            {...item}
          />
        ))}
      </div>

      <PanelContent className="hidden gap-2 p-2 sm:grid sm:grid-cols-2">
        {TESTIMONIALS_FEATURED.map((item) => (
          <TestimonialSpotlight
            key={item.url}
            className="bg-background inset-ring-foreground/15 [--spotlight-size:50%]"
          >
            <TestimonialItem {...item} showIcon />
          </TestimonialSpotlight>
        ))}

        <TestimonialsMarquee
          className="sm:col-span-2"
          data={TESTIMONIALS_1_FILTERED}
          play={play}
        />

        <TestimonialsMarquee
          className="sm:col-span-2"
          data={TESTIMONIALS_2_FILTERED}
          direction="right"
          play={play}
        />
      </PanelContent>

      <div className="screen-line-top flex justify-center py-4">
        <Button
          className="gap-2 pr-2.5 pl-3 shadow-[inset_0_0_1px] shadow-foreground/20"
          variant="secondary"
          size="sm"
          nativeButton={false}
          render={<Link href="/testimonials" />}
        >
          All builders
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}

function TestimonialsMarquee({
  data,
  direction,
  play,
  className,
}: {
  data: TestimonialType[]
  direction?: MarqueeContentProps["direction"]
  play?: boolean
  className?: string
}) {
  return (
    <Marquee className={className}>
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />

      <MarqueeContent
        className="[&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!"
        play={play}
        pauseOnHover={false}
        direction={direction}
        speed={30}
      >
        {data.map((item) => (
          <MarqueeItem
            key={item.url}
            className="mx-1 h-full w-xs rounded-xl bg-background inset-ring-1 inset-ring-foreground/15 transition-[background-color] ease-out hover:bg-accent-muted"
          >
            <TestimonialItem {...item} />
          </MarqueeItem>
        ))}
      </MarqueeContent>
    </Marquee>
  )
}

function TestimonialItem({
  className,
  authorAvatar,
  authorName,
  authorTagline,
  url,
  quote,
  icon,
  showIcon = false,
}: TestimonialType & { className?: string; showIcon?: boolean }) {
  return (
    <Testimonial className={cn("group/testimonial relative", className)}>
      <TestimonialQuote className="font-serif text-base">
        <p>
          <Twemoji className="grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/testimonial:grayscale-0">
            {quote}
          </Twemoji>
        </p>
      </TestimonialQuote>

      <TestimonialAuthor>
        <TestimonialAvatar>
          <TestimonialAvatarImg
            className="grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/testimonial:grayscale-0"
            src={authorAvatar}
            alt={authorName}
          />
          <TestimonialAvatarRing />
        </TestimonialAvatar>

        <TestimonialAuthorName>
          <a href={url} target="_blank" rel="noopener">
            <span className="absolute inset-0" aria-hidden />
            {authorName}
          </a>
          {/* {isVerified && (
            <TestimonialVerifiedBadge className="text-info">
              <VerifiedIcon />
            </TestimonialVerifiedBadge>
          )} */}
        </TestimonialAuthorName>
        <TestimonialAuthorTagline>{authorTagline}</TestimonialAuthorTagline>
      </TestimonialAuthor>

      {showIcon && icon && (
        <div
          className="pointer-events-none absolute right-3 bottom-3 flex size-8 items-center justify-center [&_svg]:size-4 [&_svg]:text-muted-foreground/80"
          aria-hidden
        >
          {icon}
        </div>
      )}
    </Testimonial>
  )
}
