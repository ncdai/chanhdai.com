import type { TestimonialType } from "@/registry/blocks/testimonials-01/components/testimonial-list"
import { TestimonialList } from "@/registry/blocks/testimonials-01/components/testimonial-list"

export default function Testimonials01() {
  return (
    <div className="flex flex-col gap-2 [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!">
      <TestimonialList data={TESTIMONIALS_1} />
      <TestimonialList data={TESTIMONIALS_2} direction="right" />
    </div>
  )
}

// Demo avatars only. Replace them with your own URLs.
const TESTIMONIALS_1: TestimonialType[] = [
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/kapehe_ok.webp",
    authorName: "Kap",
    authorTagline: "Head of Developer Community at Vercel",
    url: "https://x.com/kapehe_ok/status/1948104774358106612",
    quote: "one of my favorite projects that submitted! you are crushing it!",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/rauchg.webp",
    authorName: "Guillermo Rauch",
    authorTagline: "CEO at Vercel",
    url: "https://x.com/rauchg/status/1978913158514237669",
    quote:
      "awesome. Love the components, especially slide-to-unlock. Great job",
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
    authorAvatar: "https://assets.chanhdai.com/avatars/x/francescociull4.webp",
    authorName: "Francesco Ciulla",
    authorTagline: "Developer Advocate at daily.dev",
    url: "https://x.com/FrancescoCiull4/status/2006332479536529608",
    quote:
      "your portfolio is stunning. i created mine some weeks ago but this is another planet.",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/orcdev.webp",
    authorName: "OrcDev",
    authorTagline: "Creator of 8bitcn.com",
    url: "https://x.com/orcdev/status/2011373509310878010",
    quote: "@iamncdai is one of the best design engineers!",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/shadcncraft.webp",
    authorName: "shadcncraft",
    authorTagline: "shadcncraft.com",
    url: "https://x.com/shadcncraft/status/2017091317244055988",
    quote: "Love your work Dai! You’re a great talent :-)",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/khushiirl.webp",
    authorName: "khushi.vy",
    authorTagline: "Software Engineer",
    url: "https://x.com/khushiirl/status/2025894411155206168",
    quote: "Goated portfolio. I love the whole UI in Vercel style",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/dimicx.webp",
    authorName: "dimi",
    authorTagline: "Design Engineer",
    url: "https://x.com/dimicx/status/2035018694053577149",
    quote:
      "i like this subtle version a lot more than the over-the-top examples i see everywhere, very nice",
  },
]

const TESTIMONIALS_2: TestimonialType[] = [
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/maxprilutskiy.webp",
    authorName: "Max Prilutskiy",
    authorTagline: "CEO at Lingo.dev",
    url: "https://x.com/MaxPrilutskiy/status/1923952193893466379",
    quote: "i like your style! :)",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/jordwalke.webp",
    authorName: "jordwalke",
    authorTagline: "Creator of React",
    url: "https://x.com/jordwalke/status/1937165909778657589",
    quote: "Looks great",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/mannupaaji.webp",
    authorName: "Manu Arora",
    authorTagline: "Creator of ui.aceternity.com",
    url: "https://x.com/mannupaaji/status/1944755561117163597",
    quote: "Great work on the portfolio",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/ajaypatel_aj.webp",
    authorName: "Ajay Patel",
    authorTagline: "Creator of shadcnstudio.com",
    url: "https://x.com/ajaypatel_aj/status/1992946036558778494",
    quote: "This Portfolio is something else",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/davidhaz.webp",
    authorName: "David Haz",
    authorTagline: "Creator of reactbits.dev",
    url: "https://x.com/davidhaz/status/2017868986969444511",
    quote: "Simple and clean, love it!",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/uixmat.webp",
    authorName: "Matt",
    authorTagline: "Creator of ui.bklit.com",
    url: "https://x.com/uixmat/status/2023145872771436904",
    quote: "great work bro",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/branmcconnell.webp",
    authorName: "Brandon McConnell",
    authorTagline: "Frontend Engineer at Mintlify",
    url: "https://x.com/branmcconnell/status/2028391281198862377",
    quote: "amazing, such cool libraries",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/shadcn.webp",
    authorName: "shadcn",
    authorTagline: "Creator of shadcn/ui",
    url: "https://x.com/shadcn/status/2032193591133495700",
    quote: "You’re doing amazing work.",
  },
  {
    authorAvatar: "https://assets.chanhdai.com/avatars/x/joshpuckett.webp",
    authorName: "joshpuckett",
    authorTagline: "Teaching at interfacecraft.dev",
    url: "https://x.com/joshpuckett/status/2038713206764617896",
    quote: "Yooo I love this 🎨",
  },
]
