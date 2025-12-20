import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee";
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
  TestimonialVerifiedBadge,
} from "@/registry/testimonials-marquee";

export default function TestimonialsMarqueeDemo2() {
  return (
    <div className="w-full space-y-4 bg-background [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!">
      {[TESTIMONIALS_1, TESTIMONIALS_2].map((list, index) => (
        <Marquee key={index} className="border-y border-edge">
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />

          <MarqueeContent direction={index % 2 === 1 ? "right" : "left"}>
            {list.map((item) => (
              <MarqueeItem
                key={item.url}
                className="mx-0 h-full w-xs border-r border-edge"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <Testimonial>
                    <TestimonialQuote>
                      <p>{item.quote}</p>
                    </TestimonialQuote>

                    <TestimonialAuthor>
                      <TestimonialAvatar>
                        <TestimonialAvatarImg src={item.authorAvatar} />
                        <TestimonialAvatarRing />
                      </TestimonialAvatar>

                      <TestimonialAuthorName>
                        {item.authorName}
                        <TestimonialVerifiedBadge />
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
      ))}
    </div>
  );
}

const TESTIMONIALS_1 = [
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg",
    authorName: "Guillermo Rauch",
    authorTagline: "CEO @Vercel",
    url: "https://x.com/rauchg/status/1978913158514237669",
    quote:
      "awesome. Love the components, especially slide-to-unlock. Great job",
  },
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1756766826736893952/6Gvg6jha_400x400.jpg",
    authorName: "OrcDev",
    authorTagline: "Creator of 8bitcn.com",
    url: "https://x.com/theorcdev/status/1980378575170859446",
    quote:
      "Seriously, this is one of the best portfolio templates I've ever seen.",
  },
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1954573702768504833/LW-j7iTr_400x400.jpg",
    authorName: "Sahaj",
    authorTagline: "Creator of tweakcn.com",
    url: "https://x.com/iamsahaj_xyz/status/1982814244501381239",
    quote:
      "remember seeing it on @mannupaaji's review. it's one of the best looking ones I've seen",
  },
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1923813473240203264/owJG92AC_400x400.jpg",
    authorName: "Steven Tey",
    authorTagline: "Founder @Dub.co",
    url: "https://x.com/steventey/status/1936934909370830924",
    quote: "whoa, this is really dope – needs to get added to @shadcn UI 👀",
  },
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1868745200010428416/jKSU2o_W_400x400.jpg",
    authorName: "Kap",
    authorTagline: "Head of Developer Community @Vercel",
    url: "https://x.com/kapehe_ok/status/1948104774358106612",
    quote: "one of my favorite projects that submitted! you are crushing it!",
  },
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1962676904013492224/crWj9Gfa_400x400.jpg",
    authorName: "Jean P.D. Meijer",
    authorTagline: "Building analog.now",
    url: "https://x.com/initjean/status/1948159885960438151",
    quote:
      "congrats you deserve it! react wheel picker is so smooth, its insane 🐐",
  },
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1679831765744259073/hoVtsOZ9_400x400.jpg",
    authorName: "GitHub Projects Community",
    authorTagline: "UNOFFICIAL, but followed by @github",
    url: "https://x.com/GithubProjects/status/1931034244337271044",
    quote:
      "Everything you'd want in a picker, minus the styling headaches. Awesome job!",
  },
];

export const TESTIMONIALS_2 = [
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg",
    authorName: "Manu Arora",
    authorTagline: "Creator of ui.aceternity.com",
    url: "https://x.com/mannupaaji/status/1944755561117163597",
    quote: "Great work on the portfolio",
  },
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/2000818902339870722/d0ncPi7-_400x400.jpg",
    authorName: "Max Prilutskiy",
    authorTagline: "Creator of Lingo.dev",
    url: "https://x.com/MaxPrilutskiy/status/1923952193893466379",
    quote: "i like your style! :)",
  },
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/2001654841299369985/GcVYVPuU_400x400.png",
    authorName: "Aaron",
    authorTagline: "Founding Design Engineer @Mail0",
    url: "https://x.com/aaronmahlke/status/1955606729657344490",
    quote: "super cool portfolio!",
  },
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1333329963383103489/ee7VrWQy_400x400.jpg",
    authorName: "jordwalke",
    authorTagline: "Creator of React",
    url: "https://x.com/jordwalke/status/1937165909778657589",
    quote: "Looks great.\nAlso, cool wheel picker!",
  },
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1875548702971985920/Fp6h28Es_400x400.jpg",
    authorName: "Yonaries",
    authorTagline: "Making orabrowser.com",
    url: "https://x.com/YonathanDejene/status/1984529637309886639",
    quote: "incredible portfolio i've seen by far",
  },
  {
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1927419360492011520/bitKDhjx_400x400.jpg",
    authorName: "Zaid",
    authorTagline: "Creator of scira.ai",
    url: "https://x.com/zaidmukaddam/status/1984599685974409374",
    quote: "super clean",
  },
];
