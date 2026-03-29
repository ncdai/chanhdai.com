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
} from "@/registry/components/testimonial"

export type TestimonialType = {
  /** URL to the person's profile picture or avatar image */
  authorAvatar: string
  /** Full display name of the person giving the testimonial */
  authorName: string
  /** Short tagline, title, or description of the person */
  authorTagline: string
  /** Link to the person's profile, website, or social media page */
  url: string
  /** The testimonial text content or recommendation message */
  quote: string
}

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
            className="mx-0 h-full w-xs border-r border-line"
          >
            <a
              className="block h-full transition-[background-color] hover:bg-accent/15"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TestimonialItem {...item} />
            </a>
          </MarqueeItem>
        ))}
      </MarqueeContent>
    </Marquee>
  )
}

function TestimonialItem({
  authorAvatar,
  authorName,
  authorTagline,
  quote,
}: TestimonialType) {
  return (
    <Testimonial>
      <TestimonialQuote className="min-h-14">
        <p>{quote}</p>
      </TestimonialQuote>

      <TestimonialAuthor>
        <TestimonialAvatar>
          <TestimonialAvatarImg src={authorAvatar} alt={authorName} />
          <TestimonialAvatarRing />
        </TestimonialAvatar>

        <TestimonialAuthorName>{authorName}</TestimonialAuthorName>
        <TestimonialAuthorTagline>{authorTagline}</TestimonialAuthorTagline>
      </TestimonialAuthor>
    </Testimonial>
  )
}
