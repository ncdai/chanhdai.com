import { Icons } from "@/components/icons"

import type { Bookmark } from "../types/bookmarks"

export const BOOKMARKS: Bookmark[] = [
  {
    title: "Design Engineering at Vercel",
    url: "https://vercel.com/blog/design-engineering-at-vercel",
    author: "Vercel",
    icon: <Icons.vercel />,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "Developing Taste",
    url: "https://emilkowal.ski/ui/developing-taste",
    author: "Emil Kowalski",
    icon: <Icons.animationsdev />,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "Web Interface Guidelines",
    url: "https://vercel.com/design/guidelines",
    author: "Vercel",
    icon: <Icons.vercel />,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "7 Practical Animation Tips",
    url: "https://emilkowal.ski/ui/7-practical-animation-tips",
    author: "Emil Kowalski",
    icon: <Icons.animationsdev />,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "You Don’t Need Animations",
    url: "https://emilkowal.ski/ui/you-dont-need-animations",
    author: "Emil Kowalski",
    icon: <Icons.animationsdev />,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "animations.dev",
    url: "https://animations.dev",
    author: "Emil Kowalski",
    icon: <Icons.animationsdev />,
    bookmarkedAt: "2025-12-01",
  },
  {
    title: "components.build",
    url: "https://www.components.build",
    author: "Hayden Bleasel & shadcn",
    icon: <Icons.vercel />,
    bookmarkedAt: "2025-12-11",
  },
  {
    title: "7 Principles of Rich Web Applications",
    url: "https://rauchg.com/2014/7-principles-of-rich-web-applications",
    author: "Guillermo Rauch",
    bookmarkedAt: "2025-12-16",
  },
  {
    title: "How we think about design",
    url: "https://resend.com/handbook/design/how-we-think-about-design",
    author: "Resend",
    icon: <Icons.resend />,
    bookmarkedAt: "2025-12-20",
  },
  {
    title: "Philosophy",
    url: "https://resend.com/philosophy",
    author: "Resend",
    icon: <Icons.resend />,
    bookmarkedAt: "2025-12-20",
  },
  {
    title: "Train Your Judgement",
    url: "https://emilkowal.ski/ui/train-your-judgement",
    author: "Emil Kowalski",
    icon: <Icons.animationsdev />,
    bookmarkedAt: "2026-04-09",
  },
  {
    title: "Devouring Details",
    url: "https://devouringdetails.com",
    author: "Rauno",
    icon: <Circle />,
    bookmarkedAt: "2026-04-14",
  },
  {
    title: "React handbook",
    url: "https://devouringdetails.com/resources/react-handbook",
    author: "Rauno",
    icon: <Circle />,
    bookmarkedAt: "2026-04-14",
  },
  {
    title: "Agents with Taste",
    url: "https://emilkowal.ski/ui/agents-with-taste",
    author: "Emil Kowalski",
    icon: <Icons.animationsdev />,
    bookmarkedAt: "2026-04-21",
  },
]

function Circle() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
    </svg>
  )
}
