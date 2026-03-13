import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"

import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee"
import { Button } from "@/components/ui/button"

import { TESTIMONIALS_1, TESTIMONIALS_2 } from "../../data/testimonials"
import type { Testimonial } from "../../types/testimonials"
import { Panel } from "../panel"
import { TestimonialItem } from "./testimonial-item"

function compareFn(a: Testimonial, b: Testimonial) {
  return a.date.localeCompare(b.date, undefined, { numeric: true })
}

const FEATURED_TESTIMONIALS = [
  ...TESTIMONIALS_1.filter((item) => item.isFeatured),
  ...TESTIMONIALS_2.filter((item) => item.isFeatured),
].sort(compareFn)

export function TestimonialsMarquee() {
  return (
    <Panel
      id="testimonials"
      className="before:content-none after:content-none [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!"
    >
      <h2 className="sr-only">Testimonials</h2>

      <div className="grid gap-2 px-2 sm:grid-cols-2">
        {FEATURED_TESTIMONIALS.map((item) => (
          <TestimonialItem
            key={item.url}
            className="border-border bg-accent-muted"
            {...item}
          />
        ))}
      </div>

      <div className="flex h-2 w-full" />

      <TestimonialList data={TESTIMONIALS_1} />

      <div className="flex h-2 w-full" />

      <TestimonialList direction="right" data={TESTIMONIALS_2} />

      <div className="absolute right-0 bottom-0 z-10 -translate-x-2 rounded-lg bg-background ring-1 ring-background">
        <Button className="size-7" variant="outline" size="icon-sm" asChild>
          <Link href="/testimonials" aria-label="See all testimonials">
            <ArrowUpRightIcon />
          </Link>
        </Button>
      </div>
    </Panel>
  )
}

function TestimonialList({
  direction,
  data,
}: {
  direction?: "right" | "left"
  data: Testimonial[]
}) {
  return (
    <Marquee>
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />

      <MarqueeContent direction={direction}>
        {data
          .filter((item) => !item.isFeatured)
          .sort(compareFn)
          .map((item) => (
            <MarqueeItem
              key={item.url}
              className="mx-1 h-full max-w-xs min-w-2xs"
              style={item.style}
            >
              <TestimonialItem {...item} />
            </MarqueeItem>
          ))}
      </MarqueeContent>
    </Marquee>
  )
}
