import dynamic from "next/dynamic"
import Link from "next/link"

import blocks from "@/__registry__/__blocks__.json"
import { DesktopNav } from "@/components/desktop-nav"
import { NavItemGitHub } from "@/components/nav-item-github"
import { MAIN_NAV } from "@/config/site"
import { getAllDocs } from "@/features/doc/data/documents"
import type { DocPreview } from "@/features/doc/types/document"
import { cn } from "@/lib/utils"

import { SiteHeaderMark } from "./site-header-mark"
import { ThemeToggle } from "./theme-toggle"
import { Separator } from "./ui/separator"

const BrandContextMenu = dynamic(() =>
  import("@/components/brand-context-menu").then((mod) => mod.BrandContextMenu)
)

const CommandMenu = dynamic(() =>
  import("@/components/command-menu").then((mod) => mod.CommandMenu)
)

const MobileNav = dynamic(() =>
  import("@/components/mobile-nav-v2").then((mod) => mod.MobileNavV2)
)

export function SiteHeader({
  width = "default",
}: {
  width?: "default" | "wide"
}) {
  const posts = getAllDocs()

  // Minimize data serialized to client component - only send necessary fields
  const postPreviews: DocPreview[] = posts.map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    category: post.metadata.category,
  }))

  return (
    <header
      className={cn(
        "sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2"
        // "data-[affix=true]:shadow-[0_0_16px_0_black]/8 dark:data-[affix=true]:shadow-[0_0_16px_0_black]",
        // "not-dark:data-[affix=true]:**:data-header-container:after:bg-border",
        // "transition-shadow duration-300"
      )}
    >
      <div
        data-slot="site-header-container"
        data-width={width}
        className="screen-line-before screen-line-after mx-auto flex h-12 items-center justify-between gap-2 border-x border-edge px-2 after:z-1 after:transition-[background-color] data-[width=wide]:container sm:gap-4 data-[width=default]:md:max-w-3xl"
        data-header-container
      >
        <BrandContextMenu>
          <Link
            className="transition-[scale] ease-out active:scale-[0.98] has-data-[visible=false]:pointer-events-none [&_svg]:h-8"
            href="/"
            aria-label="Home"
          >
            <SiteHeaderMark />
          </Link>
        </BrandContextMenu>

        <div className="flex-1" />

        <DesktopNav items={MAIN_NAV} />

        <div className="flex items-center *:first:mr-2">
          <CommandMenu posts={postPreviews} blocks={blocks} />
          <NavItemGitHub />
          <Separator
            orientation="vertical"
            className="mx-2 data-vertical:h-4 data-vertical:self-center"
          />
          <ThemeToggle />
          <MobileNav items={MAIN_NAV} />
        </div>
      </div>
    </header>
  )
}
