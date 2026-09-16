import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RemountOnThemeChange } from "@/components/remount-on-theme-change"
import AppleHelloEffectAllDemo from "@/registry/examples/apple-hello-effect-languages-demo"
import BrandAssetsMenuDemo from "@/registry/examples/brand-assets-menu-demo"
import CodeBlockCommandDemo from "@/registry/examples/code-block-command-demo"
import CopyButtonDemo from "@/registry/examples/copy-button-demo"
import ElasticSliderDemo from "@/registry/examples/elastic-slider-demo"
import FluidGradientTextDemo from "@/registry/examples/fluid-gradient-text-demo"
import GitHubContributionsDemo1 from "@/registry/examples/github-contributions-demo"
import IconSwapDemo from "@/registry/examples/icon-swap-demo"
import MiddleTruncationDemo from "@/registry/examples/middle-truncation-demo"
import ShimmeringTextDemo2 from "@/registry/examples/shimmering-text-demo-02"
import SlideToUnlockDemo from "@/registry/examples/slide-to-unlock-demo"
import TestimonialSpotlightDemo from "@/registry/examples/testimonial-spotlight-demo"
import TextFlipDemo from "@/registry/examples/text-flip-demo"
import ThemeSwitcherDemo from "@/registry/examples/theme-switcher-demo"
import ThemeToggleEffectDemo from "@/registry/examples/theme-toggle-effect-demo"
import TwemojiDemo from "@/registry/examples/twemoji-demo"
import WheelPickerDemo from "@/registry/examples/wheel-picker-demo"
import { GridItem } from "@/app/(app)/(blocks)/components/showcase/grid-item"
import { getComponentDocs } from "@/features/doc/data/documents"

import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const ID = "components"

export function ComponentsShowcase() {
  const components = getComponentDocs()

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Components</a>
          <PanelTitleSup>({components.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

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
          <GitHubContributionsDemo1 />
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
      </div>

      <div className="screen-line-top flex justify-center py-2">
        <Button
          className="gap-2 pr-2.5 pl-3"
          variant="secondary"
          size="sm"
          nativeButton={false}
          render={<Link href="/components" />}
        >
          All Components
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}

export default ComponentsShowcase
