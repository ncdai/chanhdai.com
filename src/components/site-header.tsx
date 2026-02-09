import dynamic from "next/dynamic"
import Link from "next/link"

import { DesktopNav } from "@/components/desktop-nav"
import { NavItemGitHub } from "@/components/nav-item-github"
import { MAIN_NAV } from "@/config/site"
import { getAllPosts } from "@/features/blog/data/posts"
import type { PostPreview } from "@/features/blog/types/post"
import { cn } from "@/lib/utils"

import { SiteHeaderMark } from "./site-header-mark"
import { ThemeToggle } from "./theme-toggle"

const BrandContextMenu = dynamic(() =>
  import("@/components/brand-context-menu").then((mod) => mod.BrandContextMenu)
)

const CommandMenu = dynamic(() =>
  import("@/components/command-menu").then((mod) => mod.CommandMenu)
)

const MobileNav = dynamic(() =>
  import("@/components/mobile-nav").then((mod) => mod.MobileNav)
)

export function SiteHeader() {
  const posts = getAllPosts()

  // Minimize data serialized to client component - only send necessary fields
  const postPreviews: PostPreview[] = posts.map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    category: post.metadata.category,
    icon: post.metadata.icon,
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
        className="screen-line-before screen-line-after mx-auto flex h-12 items-center justify-between gap-2 border-x border-edge px-2 after:z-1 after:transition-[background-color] sm:gap-4 md:max-w-3xl"
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
          <CommandMenu posts={postPreviews} />
          <NavItemGitHub />
          <span className="mx-2 flex h-4 w-px bg-border" />
          <ThemeToggle />
          <MobileNav items={MAIN_NAV} />
        </div>
      </div>
    </header>
  )
}
