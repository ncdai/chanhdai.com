import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorBio,
  TestimonialAuthorName,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
} from "@/registry/testimonials-marquee";

import type { Testimonial as TestimonialType } from "../../types/testimonials";

export function TestimonialItem({
  authorAvatar,
  authorName,
  authorBio,
  url,
  quote,
}: TestimonialType) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full transition-colors hover:bg-accent2"
    >
      <Testimonial>
        <TestimonialQuote>
          <p>{quote}</p>
        </TestimonialQuote>

        <TestimonialAuthor>
          <TestimonialAvatar>
            <TestimonialAvatarImg src={authorAvatar} alt={authorName} />
            <TestimonialAvatarRing />
          </TestimonialAvatar>

          <TestimonialAuthorName>{authorName}</TestimonialAuthorName>

          <TestimonialAuthorBio>{authorBio}</TestimonialAuthorBio>
        </TestimonialAuthor>
      </Testimonial>
    </a>
  );
}
