import { AnimationsDevIcon, ResendIcon, VercelIcon } from "@/components/icons"

import { BookmarkCategory, type Bookmark } from "../types/bookmarks"

export const BOOKMARKS: Bookmark[] = [
  {
    title: "Design Engineering at Vercel",
    url: "https://vercel.com/blog/design-engineering-at-vercel",
    author: "Vercel",
    icon: <VercelIcon />,
    category: BookmarkCategory.ARTICLE,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "Developing Taste",
    url: "https://emilkowal.ski/ui/developing-taste",
    author: "Emil Kowalski",
    icon: <AnimationsDevIcon />,
    category: BookmarkCategory.ARTICLE,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "Web Interface Guidelines",
    url: "https://vercel.com/design/guidelines",
    author: "Vercel",
    icon: <VercelIcon />,
    category: BookmarkCategory.REFERENCE,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "7 Practical Animation Tips",
    url: "https://emilkowal.ski/ui/7-practical-animation-tips",
    author: "Emil Kowalski",
    icon: <AnimationsDevIcon />,
    category: BookmarkCategory.ARTICLE,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "You Don’t Need Animations",
    url: "https://emilkowal.ski/ui/you-dont-need-animations",
    author: "Emil Kowalski",
    icon: <AnimationsDevIcon />,
    category: BookmarkCategory.ARTICLE,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "animations.dev",
    url: "https://animations.dev",
    author: "Emil Kowalski",
    icon: <AnimationsDevIcon />,
    category: BookmarkCategory.COURSE,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "components.build",
    url: "https://www.components.build",
    author: "Hayden Bleasel & shadcn",
    icon: <VercelIcon />,
    category: BookmarkCategory.REFERENCE,
    bookmarkedAt: "2025-12-11",
  },
  {
    title: "7 Principles of Rich Web Applications",
    url: "https://rauchg.com/2014/7-principles-of-rich-web-applications",
    author: "Guillermo Rauch",
    category: BookmarkCategory.ARTICLE,
    bookmarkedAt: "2025-12-16",
  },
  {
    title: "How we think about design",
    url: "https://resend.com/handbook/design/how-we-think-about-design",
    author: "Resend",
    icon: <ResendIcon />,
    category: BookmarkCategory.REFERENCE,
    bookmarkedAt: "2025-12-20",
  },
  {
    title: "Philosophy",
    url: "https://resend.com/philosophy",
    author: "Resend",
    icon: <ResendIcon />,
    category: BookmarkCategory.REFERENCE,
    bookmarkedAt: "2025-12-20",
  },
  {
    title: "Train Your Judgement",
    url: "https://emilkowal.ski/ui/train-your-judgement",
    author: "Emil Kowalski",
    icon: <AnimationsDevIcon />,
    category: BookmarkCategory.ARTICLE,
    bookmarkedAt: "2026-04-09",
  },
  {
    title: "Devouring Details",
    url: "https://devouringdetails.com",
    author: "Rauno",
    category: BookmarkCategory.COURSE,
    bookmarkedAt: "2026-04-14",
  },
  {
    title: "React handbook",
    url: "https://devouringdetails.com/resources/react-handbook",
    author: "Rauno",
    category: BookmarkCategory.REFERENCE,
    bookmarkedAt: "2026-04-14",
  },
  {
    title: "Agents with Taste",
    url: "https://emilkowal.ski/ui/agents-with-taste",
    author: "Emil Kowalski",
    icon: <AnimationsDevIcon />,
    category: BookmarkCategory.ARTICLE,
    bookmarkedAt: "2026-04-21",
  },
  {
    title: "Component Architecture for React Server Components",
    url: "https://aurorascharff.no/posts/component-architecture-for-react-server-components",
    author: "Aurora Scharff",
    category: BookmarkCategory.ARTICLE,
    bookmarkedAt: "2026-05-30",
  },
  {
    title: "Details that make interfaces feel better",
    url: "https://interfaces.dev/magazine/issues/details-that-make-interfaces-feel-better",
    author: "Jakub Krehel",
    category: BookmarkCategory.ARTICLE,
    bookmarkedAt: "2026-06-05",
  },
  {
    title: "A Clock That Doesn’t Snap",
    url: "https://ethanniser.dev/blog/a-clock-that-doesnt-snap/",
    author: "Ethan Niser",
    category: BookmarkCategory.ARTICLE,
    bookmarkedAt: "2026-06-07",
  },
  {
    title: "Making Software",
    url: "https://www.makingsoftware.com",
    author: "Dan Hollick",
    category: BookmarkCategory.BOOK,
    bookmarkedAt: "2026-06-08",
  },
  {
    title: "Interface Craft",
    url: "https://www.interfacecraft.dev",
    author: "Josh Puckett",
    category: BookmarkCategory.COURSE,
    bookmarkedAt: "2026-06-20",
  },
  {
    title: "Interfaces",
    url: "http://interfaces.dev",
    author: "Jakub Krehel",
    category: BookmarkCategory.COURSE,
    bookmarkedAt: "2026-06-20",
  },
  {
    title: "Design Engineer Principles",
    url: "https://vercel.com/design/engineer",
    author: "Vercel",
    icon: <VercelIcon />,
    category: BookmarkCategory.REFERENCE,
    bookmarkedAt: "2026-06-20",
  },
  {
    title: "Interactive SVG Animations",
    url: "https://www.svg.guide",
    author: "Nanda Syahrasyad",
    category: BookmarkCategory.COURSE,
    bookmarkedAt: "2026-07-03",
  },
  {
    title: "Invisible Details",
    url: "https://invisibledetails.com",
    author: "Dmytro",
    category: BookmarkCategory.COURSE,
    bookmarkedAt: "2026-07-25",
  },
  {
    title: "Copper",
    url: "https://shadcn.com/copper",
    author: "shadcn",
    icon: (
      // Designed by shadcn.
      <svg viewBox="0 0 24 24" fill="none">
        <path
          fill="currentColor"
          d="M20.041 4.824a10.125 10.125 0 1 0 0 14.352 2.11 2.11 0 1 0-2.976-2.99 5.906 5.906 0 1 1 0-8.372 2.11 2.11 0 1 0 2.976-2.99"
        />
        <path
          fill="currentColor"
          d="M18.807 10.453h-1.631a.844.844 0 0 0-.844.844v1.406c0 .466.378.844.844.844h1.631a.844.844 0 0 0 .844-.844v-1.406a.844.844 0 0 0-.844-.844"
        />
      </svg>
    ),
    category: BookmarkCategory.SOFTWARE,
    bookmarkedAt: "2026-07-30",
  },
]
