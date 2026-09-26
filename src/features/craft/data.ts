import type { Craft } from "./types"

// Rendered in this order, so keep the newest first.
export const CRAFTS: Craft[] = [
  {
    description:
      "Business Card: an open and close interaction inspired by iPhone Duo.",
    media: {
      type: "video",
      src: "https://assets.chanhdai.com/videos/craft/2101608687702053067-1600w.mp4",
      poster:
        "https://assets.chanhdai.com/images/craft/2101608687702053067.webp",
      width: 1600,
      height: 1004,
    },
    createdAt: "2026-09-20",
    xPostUrl: "https://x.com/iamncdai/status/2101608687702053067",
  },
  {
    description:
      "JPG Card Holder: a leather card holder shaped like a JPG file, with cards you can pull out.",
    media: {
      type: "video",
      src: "https://assets.chanhdai.com/videos/craft/2101154119641878870-1600w.mp4",
      poster:
        "https://assets.chanhdai.com/images/craft/2101154119641878870.webp",
      width: 1600,
      height: 1004,
    },
    createdAt: "2026-09-19",
    registryHref: "/components/jpg-card-holder",
    xPostUrl: "https://x.com/iamncdai/status/2101154119641878870",
  },
  {
    description:
      "Apple Carousel: an infinite autoplay carousel with progress dots, inspired by Apple’s website.",
    media: {
      type: "video",
      src: "https://assets.chanhdai.com/videos/craft/2099952343982932285-1600w.mp4",
      poster:
        "https://assets.chanhdai.com/images/craft/2099952343982932285.webp",
      width: 1600,
      height: 1004,
    },
    createdAt: "2026-09-16",
    registryHref: "/components/apple-carousel",
    xPostUrl: "https://x.com/iamncdai/status/2099952343982932285",
  },
  {
    description:
      "Deal Board: a sales pipeline kanban with drag-and-drop cards, built at shadcncraft.",
    media: {
      type: "video",
      src: "https://assets.chanhdai.com/videos/craft/2099902335715848548-1600w.mp4",
      poster:
        "https://assets.chanhdai.com/images/craft/2099902335715848548.webp",
      width: 1600,
      height: 1004,
    },
    createdAt: "2026-09-15",
    xPostUrl: "https://x.com/iamncdai/status/2099902335715848548",
  },
  {
    description: "Museum: a little Apple corner at home.",
    media: {
      type: "gallery",
      images: [
        {
          src: "https://assets.chanhdai.com/images/craft/2098000111234343170-1-1000w.webp",
          alt: "Vintage iPhones on stands across two lit shelves, seen at an angle through the glass door, with their boxes behind them.",
          width: 1000,
          height: 1524,
        },
        {
          src: "https://assets.chanhdai.com/images/craft/2098000111234343170-2-1000w.webp",
          alt: "The whole cabinet from the front: iPhones and their boxes on two shelves, and an iPad with its box on the bottom shelf.",
          width: 1000,
          height: 1488,
        },
        {
          src: "https://assets.chanhdai.com/images/craft/2098000111234343170-3-1000w.webp",
          alt: "A black-and-white close-up of the Apple Museum sign on the cabinet door, with a Vercel bottle on the shelf above.",
          width: 1000,
          height: 1655,
        },
      ],
    },
    createdAt: "2026-09-10",
    xPostUrl: "https://x.com/iamncdai/status/2098000111234343170",
  },
  {
    description:
      "Swipe Actions: swipeable list rows that reveal actions on the left or right.",
    media: {
      type: "video",
      src: "https://assets.chanhdai.com/videos/craft/2097315369434358238-1600w.mp4",
      poster:
        "https://assets.chanhdai.com/images/craft/2097315369434358238.webp",
      width: 1600,
      height: 1004,
    },
    createdAt: "2026-09-08",
    registryHref: "/components/swipe-actions",
    xPostUrl: "https://x.com/iamncdai/status/2097315369434358238",
  },
  {
    description:
      "Spotlight Logo: an SVG logo that lights up around the cursor, inspired by the X login page.",
    media: {
      type: "video",
      src: "https://assets.chanhdai.com/videos/craft/2071332019850846394-1600w.mp4",
      poster:
        "https://assets.chanhdai.com/images/craft/2071332019850846394.webp",
      width: 1600,
      height: 1004,
    },
    createdAt: "2026-06-29",
    registryHref: "/components/spotlight-logo",
    xPostUrl: "https://x.com/iamncdai/status/2071332019850846394",
  },
  {
    description:
      "Theme-Adaptive Avatar: a portrait with day and night versions that crossfade when the theme changes.",
    media: {
      type: "video",
      src: "https://assets.chanhdai.com/videos/craft/2055648700127740096-1600w.mp4",
      poster:
        "https://assets.chanhdai.com/images/craft/2055648700127740096.webp",
      width: 1600,
      height: 1000,
    },
    createdAt: "2026-05-16",
    xPostUrl: "https://x.com/iamncdai/status/2055648700127740096",
  },
  {
    description:
      "Bento Grid: every registry component running live in one grid.",
    media: {
      type: "video",
      src: "https://assets.chanhdai.com/videos/craft/2051681608579809631-1600w.mp4",
      poster:
        "https://assets.chanhdai.com/images/craft/2051681608579809631.webp",
      width: 1600,
      height: 1000,
    },
    createdAt: "2026-05-05",
    xPostUrl: "https://x.com/iamncdai/status/2051681608579809631",
  },
  {
    description:
      "Simplamo AI: a coaching chat and milestone suggestions for OKR goals, built at Simplamo.",
    media: {
      type: "gallery",
      images: [
        {
          src: "https://assets.chanhdai.com/images/craft/simplamo-ai-1-1600w.webp",
          alt: "Simplamo's goals page with the AI chat panel open, where the OKR & KPI Coach answers a question about OKR best practices.",
          width: 1600,
          height: 1000,
        },
        {
          src: "https://assets.chanhdai.com/images/craft/simplamo-ai-2-1600w.webp",
          alt: "The Ideate Milestones dialog working through its steps, with a robot illustration while suggestions generate.",
          width: 1600,
          height: 1000,
        },
        {
          src: "https://assets.chanhdai.com/images/craft/simplamo-ai-3-1600w.webp",
          alt: "The Ideate Milestones dialog listing five suggested milestones for a goal, three of them selected, above a Create Milestones button.",
          width: 1600,
          height: 1000,
        },
      ],
    },
    createdAt: "2024-07",
  },
  {
    description:
      "Tung Tung Mobile App: a learning community for taking tests, climbing score boards, and following topics.",
    media: {
      type: "gallery",
      images: [
        {
          src: "https://assets.chanhdai.com/images/craft/tungtung-1.webp",
          alt: "Three dark mode screens of the Tung Tung app: a math question with answer choices, a score board, and the home screen.",
          width: 1600,
          height: 1200,
        },
        {
          src: "https://assets.chanhdai.com/images/craft/tungtung-2.webp",
          alt: "Three light mode screens of the Tung Tung app: community topics, suggested tests, and a test's detail page.",
          width: 1600,
          height: 1200,
        },
      ],
    },
    createdAt: "2019-09",
  },
  {
    description:
      "UnlimitedStudy: a quiz website for students, with tools for teachers to build and track tests.",
    media: {
      type: "gallery",
      images: [
        {
          src: "https://assets.chanhdai.com/images/craft/unlimitedstudy-1.webp",
          alt: "The UnlimitedStudy landing page listing its tools: quizzes, knowledge sharing, literature and culture maps, and health and life skills.",
          width: 1440,
          height: 900,
        },
        {
          src: "https://assets.chanhdai.com/images/craft/unlimitedstudy-2.webp",
          alt: "The home page with featured quiz collections and popular tests.",
          width: 1440,
          height: 900,
        },
        {
          src: "https://assets.chanhdai.com/images/craft/unlimitedstudy-3.webp",
          alt: "The quiz section with subject tabs, a featured collection banner, and suggested tests.",
          width: 1440,
          height: 900,
        },
        {
          src: "https://assets.chanhdai.com/images/craft/unlimitedstudy-4.webp",
          alt: "A collection page listing the 24 official math papers from the 2017 national exam.",
          width: 1440,
          height: 900,
        },
        {
          src: "https://assets.chanhdai.com/images/craft/unlimitedstudy-5.webp",
          alt: "A submitted physics quiz with the answer sheet on the right, scored 9 out of 10.",
          width: 1440,
          height: 900,
        },
        {
          src: "https://assets.chanhdai.com/images/craft/unlimitedstudy-6.webp",
          alt: "A test's overview for its author, with charts of attempts per day, week, and month, and a score distribution.",
          width: 1440,
          height: 900,
        },
        {
          src: "https://assets.chanhdai.com/images/craft/unlimitedstudy-7.webp",
          alt: "The question editor for a test, with the questions on the left and the answer key on the right.",
          width: 1440,
          height: 900,
        },
      ],
    },
    createdAt: "2018-01",
  },
  {
    description:
      "Hành Trình Khám Phá Miền Tây: my first website, a Mekong Delta travel guide I built in 8th grade.",
    media: {
      type: "image",
      src: "https://assets.chanhdai.com/images/craft/2066194589539823825.webp",
      alt: "The home page of a Mekong Delta travel site: a green notebook-style layout with a banner of the region's landmarks, a photo slideshow, and sidebars for provinces and a distance search.",
      width: 1526,
      height: 858,
    },
    createdAt: "2014-05",
    xPostUrl: "https://x.com/iamncdai/status/2066194589539823825",
  },
]
