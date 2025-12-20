import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/registry/testimonials-marquee";

import type { Testimonial as TestimonialType } from "../../types/testimonials";

export function TestimonialItem({
  authorAvatar,
  authorName,
  authorTagline,
  url,
  quote,
}: TestimonialType) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full transition-[background-color] ease-out hover:bg-accent2"
    >
      <Testimonial>
        <TestimonialQuote className="not-italic">
          <p className="line-clamp-3">{quote}</p>
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
    </a>
  );
}
