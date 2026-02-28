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
import { Panel } from "../panel"
import { TestimonialItem } from "./testimonial-item"

export function TestimonialsMarquee() {
  return (
    <Panel
      id="testimonials"
      className="before:z-11 after:z-10 [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!"
    >
      <h2 className="sr-only">Testimonials</h2>

      <Marquee>
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />

        <MarqueeContent>
          {TESTIMONIALS_1.slice()
            .sort((a, b) =>
              a.date.localeCompare(b.date, undefined, { numeric: true })
            )
            .map((item) => (
              <MarqueeItem
                key={item.url}
                className="mx-0 h-full max-w-xs min-w-2xs border-r border-edge"
                style={item.style}
              >
                <TestimonialItem {...item} />
              </MarqueeItem>
            ))}
        </MarqueeContent>
      </Marquee>

      <div className="screen-line-before screen-line-after relative flex h-4 w-full" />

      <Marquee>
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />

        <MarqueeContent direction="right">
          {TESTIMONIALS_2.slice()
            .sort((a, b) =>
              a.date.localeCompare(b.date, undefined, { numeric: true })
            )
            .map((item) => (
              <MarqueeItem
                key={item.url}
                className="mx-0 h-full max-w-xs min-w-2xs border-r border-edge"
                style={item.style}
              >
                <TestimonialItem {...item} />
              </MarqueeItem>
            ))}
        </MarqueeContent>
      </Marquee>

      <Button
        className="absolute right-0 bottom-0 z-10 -translate-x-1 -translate-y-[calc(var(--spacing)+1px)] ring-1 ring-background"
        variant="outline"
        size="icon-sm"
        asChild
      >
        <Link href="/testimonials" aria-label="See all testimonials">
          <ArrowUpRightIcon />
        </Link>
      </Button>
    </Panel>
  )
}
