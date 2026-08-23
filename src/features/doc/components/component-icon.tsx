import {
  IconBaselineDensitySmall,
  IconBlockquote,
  IconCircle,
  IconCircleSquare,
  IconGridDots,
  IconRipple,
} from "@tabler/icons-react"
import {
  BriefcaseBusinessIcon,
  ChevronsUpDownIcon,
  CopyIcon,
  Droplet,
  GalleryHorizontalEndIcon,
  LayoutGridIcon,
  MoonStarIcon,
  MouseIcon,
  PaintbrushIcon,
  QuoteIcon,
  ScissorsIcon,
  SeparatorHorizontalIcon,
  ShareIcon,
  SquareDashed,
  Star,
  SunDimIcon,
  TerminalIcon,
  VibrateIcon,
  ZapIcon,
} from "lucide-react"

import { ChanhDaiMark } from "@/components/chanhdai-mark"
import {
  AppleIcon,
  ReactIcon,
  ReactWheelPickerIcon,
  XIcon,
} from "@/components/icons"

const COMPONENT_ICONS: Record<string, React.ReactNode> = {
  "work-experience-component": <BriefcaseBusinessIcon />,
  "react-wheel-picker": <ReactWheelPickerIcon />,
  "theme-switcher": <MoonStarIcon />,
  "apple-hello-effect": <AppleIcon />,
  "shimmering-text": <ZapIcon />,
  "slide-to-unlock": (
    // Icon designed by @ncdai
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M3 10a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
      <path
        d="M6 12h6M9 15l3-3-3-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  testimonial: <QuoteIcon />,
  "testimonials-marquee": <GalleryHorizontalEndIcon />,
  "github-stars": <Star />,
  "github-contributions": (
    // Icon designed by @ncdai
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M11 5h2v2h-2zM15 17h2v2h-2zM7 17h2v2H7zM15 5h2v2h-2zM15 13h2v2h-2zM11 13h2v2h-2zM11 17h2v2h-2zM15 9h2v2h-2zM3 13h2v2H3zM3 17h2v2H3zM3 9h2v2H3zM3 5h2v2H3zM7 9h2v2H7zM19 17h2v2h-2zM19 9h2v2h-2zM7 5h2v2H7z"
      />
    </svg>
  ),
  "scroll-fade-effect": <MouseIcon />,
  "consent-manager": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2.182a1.636 1.636 0 1 0 0 3.273 1.636 1.636 0 0 0 0-3.273ZM8.182 3.818a3.818 3.818 0 1 1 2.002 3.36l-3.006 3.006c.125.23.226.474.3.725h9.044A3.82 3.82 0 0 1 24 12a3.818 3.818 0 0 1-7.478 1.092H7.478c-.098.33-.241.647-.425.939l2.917 2.917a3.818 3.818 0 1 1-1.442 1.644L5.41 15.47a3.818 3.818 0 1 1 .225-6.831l3.007-3.005a3.801 3.801 0 0 1-.46-1.817ZM18.546 12v.004a1.636 1.636 0 1 0 0-.008V12ZM3.818 10.364a1.636 1.636 0 1 0 0 3.272 1.636 1.636 0 0 0 0-3.272Zm6.546 9.818a1.636 1.636 0 1 1 3.272 0 1.636 1.636 0 0 1-3.272 0Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  ),
  "copy-button": <CopyIcon />,
  "code-block-command": <TerminalIcon />,
  "text-flip": <SeparatorHorizontalIcon />,
  haptic: <VibrateIcon />,
  "testimonial-spotlight": <SunDimIcon />,
  "glow-card-grid": <LayoutGridIcon />,
  "middle-truncation": <ScissorsIcon />,
  twemoji: <XIcon />,
  "theme-toggle-effect": <PaintbrushIcon />,
  "elastic-slider": (
    // Icon designed by @ncdai
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M3 10a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
      <path d="M17 10v4" strokeLinecap="round" />
    </svg>
  ),
  "toc-minimap": (
    // Icon designed by @ncdai
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 5H3" />
      <path d="M21 12H9" />
      <path d="M21 19H9" />
    </svg>
  ),
  "fluid-gradient-text": <Droplet />,
  "brand-assets-menu": <SquareDashed />,
  "icon-swap": <IconCircleSquare />,
  "dot-grid-spotlight": <IconGridDots />,
  "spinning-circular-text": <IconCircle />,
  "mobius-loop-icon": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M 6 16 C 11 16 13 8 18 8 C 23.333 8 23.333 16 18 16 C 13 16 11 8 6 8 C 0.667 8 0.667 16 6 16 Z" />
    </svg>
  ),
  "chevrons-up-down-icon": <ChevronsUpDownIcon />,
  "logos-carousel": <IconRipple />,
  "testimonial-2": <IconBlockquote />,
  "line-nav": <IconBaselineDensitySmall />,
  "share-menu": <ShareIcon />,
  "spotlight-logo": <ChanhDaiMark />,
  timescale: (
    // Icon designed by @ncdai
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="3" y1="7" x2="3" y2="17" />
      <line x1="21" y1="7" x2="21" y2="17" />
      <path d="M6 12H8" />
      <path d="M16 12H18" />
      <path d="M11 12H13" />
    </svg>
  ),
  "status-button": (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect
        x="17.76"
        y="10.875"
        width="6"
        height="2.25"
        rx="1.125"
        transform="rotate(288 12 12)"
      />
      <rect
        x="17.76"
        y="10.875"
        width="6"
        height="2.25"
        rx="1.125"
        transform="rotate(324 12 12)"
        opacity="0.9"
      />
      <rect
        x="17.76"
        y="10.875"
        width="6"
        height="2.25"
        rx="1.125"
        opacity="0.8"
      />
      <rect
        x="17.76"
        y="10.875"
        width="6"
        height="2.25"
        rx="1.125"
        transform="rotate(36 12 12)"
        opacity="0.7"
      />
      <rect
        x="17.76"
        y="10.875"
        width="6"
        height="2.25"
        rx="1.125"
        transform="rotate(72 12 12)"
        opacity="0.6"
      />
      <rect
        x="17.76"
        y="10.875"
        width="6"
        height="2.25"
        rx="1.125"
        transform="rotate(108 12 12)"
        opacity="0.5"
      />
      <rect
        x="17.76"
        y="10.875"
        width="6"
        height="2.25"
        rx="1.125"
        transform="rotate(144 12 12)"
        opacity="0.4"
      />
      <rect
        x="17.76"
        y="10.875"
        width="6"
        height="2.25"
        rx="1.125"
        transform="rotate(180 12 12)"
        opacity="0.3"
      />
      <rect
        x="17.76"
        y="10.875"
        width="6"
        height="2.25"
        rx="1.125"
        transform="rotate(216 12 12)"
        opacity="0.2"
      />
      <rect
        x="17.76"
        y="10.875"
        width="6"
        height="2.25"
        rx="1.125"
        transform="rotate(252 12 12)"
        opacity="0.15"
      />
    </svg>
  ),
}

export function ComponentIcon({ slug }: { slug: string }) {
  return COMPONENT_ICONS[slug] ?? <ReactIcon />
}
