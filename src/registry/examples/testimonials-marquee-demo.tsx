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

export default function TestimonialsMarqueeDemo() {
  return (
    <div className="w-full bg-background">
      <Marquee
        data-slot="marquee"
        className="border-y border-line [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!"
      >
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />

        <MarqueeContent>
          {TESTIMONIALS.map((item) => (
            <MarqueeItem
              key={item.url}
              className="mx-0 h-full w-xs border-r border-line"
            >
              <a
                className="block h-full transition-[background-color] ease-out hover:bg-accent/20"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Testimonial>
                  <TestimonialQuote className="font-serif">
                    <p>{item.quote}</p>
                  </TestimonialQuote>

                  <TestimonialAuthor>
                    <TestimonialAvatar>
                      <TestimonialAvatarImg src={item.authorAvatar} />
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
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  )
}

// Demo avatars only. Replace them with your own URLs.
const TESTIMONIALS = [
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/rauchg.webp",
    authorName: "Guillermo Rauch",
    authorTagline: "CEO at Vercel",
    url: "https://x.com/rauchg/status/1978913158514237669",
    quote:
      "awesome. Love the components, especially slide-to-unlock. Great job",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/orcdev.webp",
    authorName: "OrcDev",
    authorTagline: "Creator of 8bitcn.com",
    url: "https://x.com/orcdev/status/1980378575170859446",
    quote:
      "Seriously, this is one of the best portfolio templates I’ve ever seen.",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/iamsahaj_xyz.webp",
    authorName: "Sahaj",
    authorTagline: "Creator of tweakcn.com",
    url: "https://x.com/iamsahaj_xyz/status/1982814244501381239",
    quote:
      "remember seeing it on @mannupaaji’s review. it’s one of the best looking ones I’ve seen",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/steventey.webp",
    authorName: "Steven Tey",
    authorTagline: "Founder of Dub",
    url: "https://x.com/steventey/status/1936934909370830924",
    quote: "whoa, this is really dope – needs to get added to @shadcn UI",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/kapehe_ok.webp",
    authorName: "Kap",
    authorTagline: "Head of Developer Community at Vercel",
    url: "https://x.com/kapehe_ok/status/1948104774358106612",
    quote: "one of my favorite projects that submitted! you are crushing it!",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/initjean.webp",
    authorName: "Jean P.D. Meijer",
    authorTagline: "Design Engineer",
    url: "https://x.com/initjean/status/1948159885960438151",
    quote:
      "congrats you deserve it! react wheel picker is so smooth, its insane",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/githubprojects.webp",
    authorName: "GitHub Projects Community",
    authorTagline: "UNOFFICIAL, but followed by @github",
    url: "https://x.com/GithubProjects/status/1931034244337271044",
    quote:
      "Everything you’d want in a picker, minus the styling headaches. Awesome job!",
  },
]
