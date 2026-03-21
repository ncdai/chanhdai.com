import { TestimonialSpotlight } from "@/registry/components/testimonial-spotlight"

export default function TestimonialSpotlightDemo() {
  return (
    <TestimonialSpotlight
      className="w-72 max-w-full"
      authorAvatar="https://unavatar.io/x/shadcn"
      authorName="shadcn"
      authorTagline="Creator of shadcn/ui"
      url="https://x.com/shadcn/status/2032193591133495700"
      quote="You’re doing amazing work."
    />
  )
}
