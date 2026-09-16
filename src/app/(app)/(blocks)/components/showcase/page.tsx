import type { Metadata } from "next"
import Link from "next/link"
import { Grip, LayoutDashboard } from "lucide-react"

import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  PageHeading,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { RemountOnThemeChange } from "@/components/remount-on-theme-change"
import AppleHelloEffectAllDemo from "@/registry/examples/apple-hello-effect-languages-demo"
import BrandAssetsMenuDemo from "@/registry/examples/brand-assets-menu-demo"
import CodeBlockCommandDemo from "@/registry/examples/code-block-command-demo"
import CopyButtonDemo from "@/registry/examples/copy-button-demo"
import DotGridSpotlightDemo from "@/registry/examples/dot-grid-spotlight-demo"
import ElasticSliderDemo from "@/registry/examples/elastic-slider-demo"
import FluidGradientTextDemo from "@/registry/examples/fluid-gradient-text-demo"
import GitHubContributionsDemo from "@/registry/examples/github-contributions-demo"
import GitHubStarsDemo from "@/registry/examples/github-stars-demo"
import GlowCardGridDemo from "@/registry/examples/glow-card-grid-demo"
import HapticDemo from "@/registry/examples/haptic-demo"
import IconSwapDemo from "@/registry/examples/icon-swap-demo"
import MiddleTruncationDemo from "@/registry/examples/middle-truncation-demo"
import ScrollFadeEffectDemo from "@/registry/examples/scroll-fade-effect-demo"
import ShimmeringTextDemo2 from "@/registry/examples/shimmering-text-demo-02"
import SlideToUnlockDemo from "@/registry/examples/slide-to-unlock-demo"
import TestimonialSpotlightDemo from "@/registry/examples/testimonial-spotlight-demo"
import TestimonialsMarqueeDemo from "@/registry/examples/testimonials-marquee-demo"
import TextFlipDemo from "@/registry/examples/text-flip-demo"
import ThemeSwitcherDemo from "@/registry/examples/theme-switcher-demo"
import ThemeToggleEffectDemo from "@/registry/examples/theme-toggle-effect-demo"
import TOCMinimapDemo from "@/registry/examples/toc-minimap-demo"
import TwemojiDemo from "@/registry/examples/twemoji-demo"
import WheelPickerDemo from "@/registry/examples/wheel-picker-demo"
import WorkExperienceDemo from "@/registry/examples/work-experience-demo"

import { GridItem } from "./grid-item"

const title = "Component Showcase"
const description = "Pixel-perfect, uniquely crafted."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/components/showcase",
  },
  openGraph: {
    url: "/components/showcase",
    type: "website",
    images: {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    creator: X_HANDLE,
    images: [ogImage],
  },
}

export default function ComponentsShowcasePage() {
  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          {
            name: "Home",
            href: "/",
          },
          {
            name: "Components",
            href: "/components",
          },
          {
            name: "Component Showcase",
            href: "/components/showcase",
          },
        ])}
      />

      <PageHeading>
        <PageHeadingTagline>Component Showcase</PageHeadingTagline>
        <PageHeadingTitle>Pixel-perfect, uniquely crafted.</PageHeadingTitle>
      </PageHeading>

      <div className="flex items-center justify-end gap-1 p-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                className="size-7 border-none text-muted-foreground"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href="/components" />}
                aria-label="List"
              >
                <Grip />
              </Button>
            }
          />
          <TooltipContent>
            <p>List</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                className="size-7"
                variant="outline"
                size="icon-sm"
                aria-label="Showcase"
              >
                <LayoutDashboard />
              </Button>
            }
          />
          <TooltipContent>
            <p>Showcase</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="screen-line-bottom h-px" />

      <div className="grid auto-rows-[minmax(--spacing(42),auto)] grid-cols-1 gap-1 p-1 md:grid-cols-3">
        <GridItem className="md:row-span-2">
          <AppleHelloEffectAllDemo />
        </GridItem>

        <GridItem>
          <RemountOnThemeChange>
            <SlideToUnlockDemo />
          </RemountOnThemeChange>
        </GridItem>

        <GridItem>
          <ThemeSwitcherDemo />
        </GridItem>

        <GridItem className="md:row-span-2">
          <ElasticSliderDemo />
        </GridItem>

        <GridItem>
          <ThemeToggleEffectDemo />
        </GridItem>

        <GridItem className="**:data-rwp-wrapper:rounded-xl md:row-span-2">
          <WheelPickerDemo />
        </GridItem>

        <GridItem className="md:row-span-2">
          <MiddleTruncationDemo />
        </GridItem>

        <GridItem>
          <TestimonialSpotlightDemo />
        </GridItem>

        <GridItem className="px-0 md:col-span-2 md:row-span-2">
          <GitHubContributionsDemo />
        </GridItem>

        <GridItem>
          <TextFlipDemo />
        </GridItem>

        <GridItem>
          <CopyButtonDemo />
        </GridItem>

        <GridItem>
          <BrandAssetsMenuDemo />
        </GridItem>

        <GridItem className="[--code:var(--surface)]">
          <CodeBlockCommandDemo />
        </GridItem>

        <GridItem>
          <IconSwapDemo />
        </GridItem>

        <GridItem>
          <TwemojiDemo />
        </GridItem>

        <GridItem className="md:col-span-2 md:row-span-2">
          <FluidGradientTextDemo />
        </GridItem>

        <GridItem>
          <ShimmeringTextDemo2 />
        </GridItem>

        <GridItem className="overflow-hidden px-0 md:col-span-3">
          <TestimonialsMarqueeDemo />
        </GridItem>

        <GridItem className="md:col-span-2 md:row-span-2">
          <GlowCardGridDemo />
        </GridItem>

        <div className="grid grid-cols-2 gap-1">
          <GridItem>
            <GitHubStarsDemo />
          </GridItem>

          <GridItem className="pr-0">
            <TOCMinimapDemo />
          </GridItem>
        </div>

        <GridItem className="**:data-[slot=scroll-fade-effect-demo]:rounded-xl">
          <ScrollFadeEffectDemo />
        </GridItem>

        <GridItem className="items-start overflow-clip p-0 md:col-span-2 md:row-span-2">
          <WorkExperienceDemo />
        </GridItem>

        <GridItem className="p-0">
          <HapticDemo />
        </GridItem>

        <GridItem className="overflow-clip p-0 *:aspect-video *:w-full *:rounded-none *:border-none">
          <DotGridSpotlightDemo />
        </GridItem>
      </div>
    </>
  )
}
