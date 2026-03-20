import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee"
import type { TestimonialType } from "@/registry/components/testimonial-spotlight"
import { TestimonialSpotlight } from "@/registry/components/testimonial-spotlight"

export function TestimonialList({
  direction,
  data,
}: {
  direction?: "right" | "left"
  data: TestimonialType[]
}) {
  return (
    <Marquee>
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />

      <MarqueeContent direction={direction}>
        {data.map((item) => (
          <MarqueeItem
            key={item.url}
            className="mx-1 h-full max-w-xs min-w-2xs"
          >
            <TestimonialSpotlight {...item} />
          </MarqueeItem>
        ))}
      </MarqueeContent>
    </Marquee>
  )
}
