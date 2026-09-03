import { AnimationsDevIcon, ResendIcon, VercelIcon } from "@/components/icons"

import { BookmarkCategory, type Bookmark } from "./types"

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
  {
    title: "React Bits Pro",
    url: "https://pro.reactbits.dev?atp=ncdai",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          fill="currentColor"
          d="M14.72 2.32c.66-.3 1.42-.46 2.13-.16l.14.06.2.12c.42.28.7.7.88 1.15q.26.69.28 1.52v1.08h-1.68v-.84l-.02-.36q-.04-.5-.16-.8c-.1-.24-.2-.33-.26-.36l-.04-.02c-.11-.03-.34-.05-.76.14q-.72.33-1.7 1.29-1.07 1.03-2.18 2.64H12c2.87 0 5.5.39 7.45 1.03.97.32 1.81.73 2.43 1.21.61.48 1.12 1.14 1.12 1.98 0 .72-.38 1.31-.87 1.76q-.75.68-1.9 1.14l-.8.32-.64-1.56.79-.32a5 5 0 0 0 1.4-.81c.29-.27.33-.45.33-.53 0-.1-.06-.32-.48-.65a7 7 0 0 0-1.92-.94A23 23 0 0 0 12 9.47q-.79 0-1.53.04A30 30 0 0 0 9.18 12l.56 1.15.23.45a22 22 0 0 0 3.75 5.26 7 7 0 0 0 1.7 1.28c.49.23.72.18.8.13l.08-.05c.07-.07.18-.21.26-.51q.16-.6.07-1.72a19 19 0 0 0-1.61-5.54l.78-.33.77-.34a21 21 0 0 1 1.74 6.05 7 7 0 0 1-.12 2.31c-.17.66-.53 1.3-1.2 1.64-.74.37-1.57.22-2.27-.1a8 8 0 0 1-2.19-1.61 24 24 0 0 1-4.2-5.97 18 18 0 0 0-.89 3.32q-.19 1.36-.03 2.13c.1.52.28.68.36.72l.07.03c.18.04.62 0 1.4-.55l.69-.49.97 1.38-.68.49-.19.12c-.92.61-2.03 1.03-3.02.53-.75-.38-1.11-1.14-1.26-1.9a8 8 0 0 1 .02-2.7c.23-1.52.76-3.31 1.56-5.18Q6.9 10.98 6.57 10q-.8.18-1.48.4-1.3.45-1.92.94c-.42.33-.48.55-.48.65 0 .14.15.51.96.97l.17.1.75.38-.78 1.5-.75-.39-.2-.1C1.88 13.9 1 13.1 1 12c0-.84.51-1.5 1.12-1.98a8 8 0 0 1 2.43-1.2q.73-.25 1.54-.43-.2-.82-.32-1.56c-.15-1-.18-1.94-.02-2.71.15-.76.51-1.52 1.26-1.9.78-.4 1.64-.21 2.4.16l.31.17.73.43-.85 1.46L8.86 4l-.23-.13c-.5-.25-.76-.2-.86-.15-.08.04-.26.2-.36.72q-.16.76.03 2.13.12.7.32 1.5.83-.12 1.71-.2c.99-1.59 2.04-2.95 3.06-3.95a8 8 0 0 1 2.19-1.6m1.85 9.46-1.55.67-.34-.77 1.55-.68zM8.33 8.86a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8"
        />
      </svg>
    ),
    category: BookmarkCategory.UI_LIBRARY,
    bookmarkedAt: "2026-09-03",
  },
  {
    title: "shadcncraft",
    url: "https://shadcncraft.com?atp=ncdai",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          fill="currentColor"
          d="M21.92 3.71v5.16H9.57L6.23 14.4a.7.7 0 0 1-.63.35H2.73a.7.7 0 0 1-.73-.72V8.87h7.04l2.92-4.82C12.35 3.4 13.06 3 13.83 3h7.36c.4 0 .73.32.73.71"
        />
        <path
          fill="currentColor"
          d="M2 21.28v-5.16h12.35l3.34-5.52a.7.7 0 0 1 .63-.35h2.87c.4 0 .73.32.73.71v5.16h-7.04l-2.92 4.83c-.39.65-1.1 1.05-1.87 1.05H2.73a.7.7 0 0 1-.73-.72"
        />
      </svg>
    ),
    category: BookmarkCategory.UI_LIBRARY,
    bookmarkedAt: "2026-09-03",
  },
]
